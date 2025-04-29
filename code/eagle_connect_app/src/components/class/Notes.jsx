/*
Component to show uploaded notes on the class page
allows the user to upload notes
*/

import React from "react";
import { db, storage } from "../../firebase";
import { useEffect, useState } from "react";
import { arrayUnion, updateDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getNameAndPfp } from "../util/Util";
import {Filter} from "bad-words";

const filter = new Filter();
//Component where you can upload pdf documents for certain study resources or notes
function Notes({ classID, email }) {
  //form handling stuff
  const [title, setTitle] = useState(""); // title for notes
  const [notesUrl, setNotesURL] = useState(null); // for firebase storage purposes
  const [name, setName] = useState("Test"); // user's name will display
  const [notes, setNotes] = useState([]); // for firebase firestore purposes
  const [imgageUrl, setImageUrl] = useState(""); // user's profile pic will display

  //this function will refresh the notes every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllNotes();
      getNameAndPfp(email, setName, setImageUrl);
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  //function for handling the uploaded note files
  async function handleNotesFileUpload() {

    
    //do not let users send bad messages!
    if(filter.isProfane(title)){
      alert("Do not put profanity in the title.");
      setTitle("");
      return; 
    }

    //assert char limit has not been reached
    if(title.length > 250){
      alert("Error: Message cannot be more than 250 characters long, you need to delete the last " 
        + (title.length - 250) + " characters");
        return;
    }


    // prevents user from uploading same file and title
    if (!notesUrl || !notesUrl.name) {
      alert("You have already uploaded this document or the file is missing.");
      return;
    }

    if(!notesUrl.name.endsWith(".pdf")){
      alert("Error: Only PDF Files are allowed");
      return;
    }

    console.log("notesurl.name", notesUrl.name);
    const uniqueFileUrl = `${Date.now()}-${notesUrl.name}`; //timestamp will avoid overwritting file in storage
    //took a while to debug, only most recent would be shown, but this line solved the issue
    const storageRef = ref(storage, `notes/${email}/${uniqueFileUrl}`); //storage reference location
    const uploadTask = uploadBytesResumable(storageRef, notesUrl); //task to upload from that reference location

    //uploading the file
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //observe upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        //handle errors
        console.error("Upload failed:", error);
      },
      () => {
        //this will get the download URL once the upload is complete (this will be stored in storage)
        console.log("notes upload is complete");
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setNotesURL(downloadURL);
          console.log("okay notes url is now: ");
          console.log(notesUrl);
          uploadNewNotesFile(downloadURL);
        });
      }
    );
  }

  //function for getting the notes collection in firestore and all of its data
  async function getAllNotes() {
    const classDocRef = doc(db, "availableClasses", classID.classID);
    const classSnap = await getDoc(classDocRef);
    const thisclassData = classSnap.data();
    //SRS States we may only show last 15 notes
    setNotes(thisclassData.notes.slice(-15));
  }

  // this function will allow for the new notes to be uploaded
  async function uploadNewNotesFile(x) {
    getNameAndPfp(email, setName, setImageUrl);

    const classDocRef = doc(db, "availableClasses", classID.classID);
    updateDoc(classDocRef, {
      notes: arrayUnion({
        name: name, // name of user
        title: title, // title of notes
        notesUrl: x, // this is the full url from google api
        notesUrlName: notesUrl.name, // this is the display file name (local)
        pfpUrl: imgageUrl, // this is for the user's pfp
      }),
    });

    setNotes(notes); // this will set the notes collection
  }

  // function for handling a title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value); // sets the title name to whatever user enters
  };
  // function for handling a file upload change
  const handleURLChange = (e) => {
    console.log("Handle url change called."); // debugging statement (will take out later)
    const selectedNotesFile = e.target.files[0]; // whatever file the user selects
    console.log(selectedNotesFile); // debugging statement (will take out later)
    if (selectedNotesFile) {
      // ensures that user selected a file
      setNotesURL(selectedNotesFile); // set the url to the file that user selected
    }
  };

  return (
    <>
      <div className="notes-resource-reminder-container">
        {notes.map(
          (
            each_class // mapping
          ) => (
            <Note // parent
              key={each_class.id} // user id
              name={each_class.name} // user name
              title={each_class.title} // user uploaded file title
              notesUrl={each_class.notesUrl} // user uploaded file full url
              notesUrlName={each_class.notesUrlName} // user uploaded file display url
              pfpUrl={each_class.pfpUrl} // user uploaded profile picture
            />
          )
        )}
      </div>
      <div class="add-resource-elements">
        <form>
          <div class="resource-field">
            <label for="Title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNotesFileUpload();
                }
              }}
              placeholder="Enter Title"
              required
            />
          </div>
          <div class="resource-field">
            <label for="url">Upload File:</label>
            <input
              type="file"
              id="url"
              accept="application/pdf"
              onChange={handleURLChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNotesFileUpload();
                }
              }}
              placeholder="Choose File"
              required
            />
          </div>
        </form>
        <button className="blue-buttons" onClick={handleNotesFileUpload}>
          Submit
        </button>
      </div>
    </>
  );
}

function Note({ name, title, notesUrl, notesUrlName, pfpUrl }) {
  return (
    <>
      <div class="resource-box">
        <img src={pfpUrl} alt="Profile Image" className="profile-image" />

        <div class="resource">
          <div class="name">{name}</div>

          <strong>Title: {title}</strong>
          <strong>File: {notesUrlName}</strong>

          <a href={notesUrl} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
          <a href={notesUrl} download target="_blank" rel="noopener noreferrer">
            Download PDF
          </a>
        </div>
      </div>
    </>
  );
}
export default Notes;
