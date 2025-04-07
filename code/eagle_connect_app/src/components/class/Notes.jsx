import React from "react";
import { db, storage } from "../../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  arrayUnion,
  updateDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//Component where you can upload pdf documents for certain study resources or notes 
function Notes({ className, email, }) {
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
      getNameAndPfp();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  //function for handling the uploaded note files
  async function handleNotesFileUpload() {
    // prevents user from uploading same file and title 
    if (!notesUrl || !notesUrl.name) {
      alert("You have already uploaded this document or the file is missing.");
      return;
    }

    const uniqueFileUrl = `${Date.now()}-${notesUrl.name}`;  //timestamp will avoid overwritting file in storage
                          //took a while to debug, only most recent would be shown, but this line solved the issue
    const storageRef = ref(storage, `notes/${email}/${uniqueFileUrl}`); //storage reference location
    const uploadTask = uploadBytesResumable(storageRef, notesUrl); //task to upload from that reference location

    //uploading the file
    uploadTask.on('state_changed',
      (snapshot) => {
        //observe upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        //handle errors
        console.error('Upload failed:', error);
      },
      () => {
        //this will get the download URL once the upload is complete (this will be stored in storage)
        console.log("notes upload is complete")
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setNotesURL(downloadURL);
          console.log("okay notes url is now: ");
          console.log(notesUrl);
          uploadNewNotesFile(downloadURL);
        });
      }
    );
  };
  //function for getting the user's name and profile pic
  async function getNameAndPfp() {
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    //Use query to get user object (contains first name, last name, etc.) 
    getDocs(userQuery)
      .then((response) => {
        const users_from_response = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        {
          /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
        }
        var toSend;
        toSend = users_from_response.at(0).data.firstName;
        toSend += " ";
        toSend += users_from_response.at(0).data.lastName;
        setName(toSend);
        setImageUrl(users_from_response.at(0).data.pfpUrl);
      })
      .catch((error) => console.log(error));
  }

  //function for getting the notes collection in firestore and all of its data
  async function getAllNotes() {
    const classQuery = query(
      collection(db, "availableClasses"),
      where("className", "==", className)
    );

    //use query to get user object (contains first name, last name, etc.) 
    getDocs(classQuery)
      .then((response) => {
        const class_from_responses = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setNotes(class_from_responses.at(0).data.notes);
      })
      .catch((error) => console.log(error));
  }

  // this function will allow for the new notes to be uploaded 
  async function uploadNewNotesFile(x) {
    var class_id;
    getNameAndPfp();
    const classQuery = query(
      collection(db, "availableClasses"),
      where("className", "==", className)
    );

    {
      /*Use query to get user object (contains first name, last name, etc.) */
    }
    getDocs(classQuery).then((response) => {
      const class_from_response = response.docs.map((doc) => ({
        data: doc.data(),
        id: doc.id,
      }));
      {
        /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
      }
      class_id = class_from_response.at(0).id;
      const classDocRef = doc(db, "availableClasses", class_id);
      updateDoc(classDocRef, {
        notes: arrayUnion({
          name: name, // name of user
          title: title, // title of notes
          notesUrl: x, // this is the full url from google api
          notesUrlName: notesUrl.name, // this is the display file name (local)
          pfpUrl: imgageUrl, // this is for the user's pfp
        }),
      });
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
    if (selectedNotesFile) { // ensures that user selected a file
      setNotesURL(selectedNotesFile); // set the url to the file that user selected
    }
  };

return (
  <>
    {notes.map((each_class) => ( // mapping 
      <Note // parent
        key={each_class.id} // user id
        name={each_class.name} // user name
        title={each_class.title} // user uploaded file title
        notesUrl={each_class.notesUrl} // user uploaded file full url
        notesUrlName={each_class.notesUrlName} // user uploaded file display url
        pfpUrl={each_class.pfpUrl} // user uploaded profile picture
      />
    ))}

    <div class="add-resource-elements">
      <form>
        <div class="resource-field">
          <label for="Title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
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
            placeholder="Choose File"
            required
          />
        </div>
      </form>
      <button onClick={handleNotesFileUpload}>Submit</button>
    </div>
  </>
);
}

function Note({ name, title, notesUrl, notesUrlName, pfpUrl}) {
  return (
    <>
      <div class="resource-box"> 
        <img
          src={pfpUrl}
          alt="Profile Image"
          className="profile-image"
        />

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
