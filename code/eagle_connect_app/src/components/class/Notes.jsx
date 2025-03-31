import React from "react";
import { auth, db } from "../../firebase";
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

/*Component where you can send notes */
function Notes({ className, email }) {
  //form handling stuff
  const [note_to_send, setNoteToSend] = useState("");
  const [title_to_send, setTitleToSend] = useState("");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState([]);
  const [name, setName] = useState("Test");

  //refresh the messages every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllNotes();
      getName();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const handleClearNote = () => {
    setNoteToSend('');
    setTitleToSend('');
  };

  async function getName() {
    const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
    
        
          /*Use query to get user object (contains first name, last name, etc.) */
        
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

          })
          .catch((error) => console.log(error));
      
  }

  async function getAllNotes() {
    
      /*Create query to get the user object from their email*/
    
    const classQuery = query(
      collection(db, "availableClasses"),
      where("className", "==", className)
    );

    
      /*Use query to get user object (contains first name, last name, etc.) */
    
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

  async function uploadNewNote() {
    var class_id;
    
    getName();

    const classQuery = query(
      collection(db, "availableClasses"),
      where("className", "==", className)
    );

    
      /*Use query to get user object (contains first name, last name, etc.) */
    
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
          name: name,
          title: title_to_send,
          note: note_to_send,
        }),
      });
    });
    setNotes(notes);
  }

  //validate note
  function handleNoteSubmit() {
    handleClearNote();
    uploadNewNote();
  }

  const handleNewNoteChange = (e) => {
    setNoteToSend(e.target.value);
  };

  const handleNewTitleChange = (e) => {
    setTitleToSend(e.target.value);
  };

return (
    <>
      <title>Notes</title>
      <link rel="stylesheet" href="notesPageStyle.css" />

      {notes.map((each_class) => (
        <Note name={each_class.name} note={each_class.note} />
      ))}
  
      <div class="add-resource-elements">
        <form>
          <div class="resource-field">
            <label for="title">Title:</label>
            <input
              type="text"
              id="title"
              value={note_to_send}
              onChange={handleNewTitleChange}
              placeholder="Enter Title"
              required
            />
          </div>
  
          <div class="resource-field">
            <label for="url">File:</label>
            <input
              type="file"
              id="url"
              onChange={handleNewNoteChange}
              required
            />
          </div>
        </form>
        <button onClick={handleNoteSubmit}>Upload</button>
      </div>
    </>
  );
}

function Note({ name, note }) {
  return (
    <>
      <div class="resource-box-no-line">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          alt="Profile Image"
          class="profile-image"
        />

        <div class="resource">
          <div class="name">{name}</div>
          <div class="note">{note}</div>
        </div>
      </div>
    </>
  );
}
export default Notes;
