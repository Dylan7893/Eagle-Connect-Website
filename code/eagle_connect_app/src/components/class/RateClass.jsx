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
function RateClass({ className, email }) {
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
      <div className="rate-info">
        <div className="rate">
          <label for="url">Rating:</label>
          <span className="star-no-hover" star-rating="1">
            &#9733;
          </span>
          <span className="star-no-hover" star-rating="2">
            &#9733;
          </span>
          <span className="star-no-hover" star-rating="3">
            &#9733;
          </span>
          <span className="star-no-hover" star-rating="4">
            &#9733;
          </span>
          <span className="star-no-hover" star-rating="5">
            &#9733;
          </span>
        </div>
        <div className="resource-field">
          <label for="url"> Reviews:</label>
          <p>15</p>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((each_class) => (
          <Message
            key={each_class.id}
            name={each_class.name}
            message={each_class.message}
          />
        ))}
      </div>

      <div class="add-resource-elements">
        <div class="rate">
          <label for="rate">Rate:</label>
          <span className="star" star-rating="1">
            &#9733;
          </span>
          <span className="star" star-rating="2">
            &#9733;
          </span>
          <span className="star" star-rating="3">
            &#9733;
          </span>
          <span className="star" star-rating="4">
            &#9733;
          </span>
          <span className="star" star-rating="5">
            &#9733;
          </span>
        </div>
        <form>
          <div className="resource-field">
            <label for="feedback" className="resource-field-label">
              Feedback:
            </label>
            <input
              type="text"
              id="url"
              value="NULL"
              onChange="NULL"
              placeholder="Enter URL"
              required
            />
          </div>
        </form>
        <button onClick="NULL">Submit</button>
      </div>
    </>
  );
}

function Message({ name, message }) {
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
          <div class="message">{message}</div>
        </div>
      </div>
    </>
  );
}
export default RateClass;
