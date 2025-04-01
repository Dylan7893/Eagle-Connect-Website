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

/*Component where you can send chat messages */
function Reminders({ className, email }) {
  //form handling stuff
  const [message_to_send, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("Test");

  //refresh the messages every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllMessages();
      getName();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const handleClearMessage = () => {
    setMessageToSend("");
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

  async function getAllMessages() {
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
        setMessages(class_from_responses.at(0).data.messages);
      })
      .catch((error) => console.log(error));
  }

  async function uploadNewMessage() {
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
        messages: arrayUnion({
          name: name,
          message: message_to_send,
        }),
      });
    });
    setMessages(messages);
  }

  //validate message
  function handleMessageSubmit() {
    handleClearMessage();
    uploadNewMessage();
  }

  const handleNewMessageChange = (e) => {
    setMessageToSend(e.target.value);
  };

  return (
    <>
      <div className="messages-container">
        {messages.map((each_class) => (
          <Message
            key={each_class.name}
            name={each_class.name}
            message={each_class.message}
          />
        ))}
      </div>

      <div class="bar">
        <div class="message-field">
          <form>
            <input
              type="text"
              id="message"
              value={message_to_send}
              onChange={handleNewMessageChange}
              placeholder="Enter Reminder"
              required
            />
          </form>
          <button onClick={handleMessageSubmit}>Send</button>
        </div>
      </div>
    </>
  );
}

function Message({ name, message }) {
  return (
    <>
      <div className="resource-box-no-line">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          alt="Profile Image"
          className="profile-image"
        />

        <div className="resource">
          <div className="name">{name}</div>
          <div className="message">{message}</div>
        </div>
      </div>
    </>
  );
}
export default Reminders;
