/*
Component where users can send chat messages to fellow students who are in the class
*/
import React from "react";
import { db } from "../../firebase";
import { useEffect, useState, useRef } from "react";
import { arrayUnion, updateDoc, doc, getDoc } from "firebase/firestore";
import { getNameAndPfp } from "../util/Util";
import {Filter} from 'bad-words';

const filter = new Filter();
/*Component where you can send chat messages */
function Chat({ classID, updateEvent, userName, email }) {
  //form handling stuff
  const [message_to_send, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("Test");
  const [imgageUrl, setImageUrl] = useState("");
  const messageContainerRef = useRef(null);

  function scrollDownLocal() {
    const el = messageContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  //refresh the messages every 100ms and get name and profile picture
  useEffect(() => {
    const intervalId = setInterval(() => {
      getNameAndPfp(email, setName, setImageUrl);
      getAllMessages();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  //upon entering a message clear the message input field
  const handleClearMessage = () => {
    setMessageToSend("");
  };

  //function to get all the messages from the databse
  async function getAllMessages() {
    /*Create query to get the user object from their email*/
    await getNameAndPfp(email, setName, setImageUrl);

    const classDocRef = doc(db, "availableClasses", classID.classID);
    const classSnap = await getDoc(classDocRef);
    const thisclassData = classSnap.data();
    setMessages(thisclassData.messages.slice(-20));
  }

  //function to upload a new chat message based on what the user entered
  async function uploadNewMessage() {
    getNameAndPfp(email, setName, setImageUrl);

    const classDocRef = doc(db, "availableClasses", classID.classID);

    //do not let users send bad messages!
    if(filter.isProfane(message_to_send)){
      alert("Youre bad that message is bad.");
      handleClearMessage();
      return; 
    }

    updateDoc(classDocRef, {
      messages: arrayUnion({
        name: name,
        message: message_to_send,
        pfpUrl: imgageUrl,
      }),
    });
    setMessages(messages);
    updateEvent();
    scrollDownLocal();
    handleClearMessage();
  }

  //validate message
  function handleMessageSubmit() {
    if (message_to_send === "")
    {
      alert("Must enter a message to send.");
      return;
    }
    uploadNewMessage();
  }
  //set the message to send contents to what the user input
  const handleNewMessageChange = (e) => {
    setMessageToSend(e.target.value);
  };

  return (
    <div className="contain">
      <div className="messages-container" ref={messageContainerRef}>
        {messages.map((each_class) => (
          <Message
            key={each_class.id}
            name={each_class.name}
            message={each_class.message}
            pfpUrl={each_class.pfpUrl}
            userName={userName}
          />
        ))}
      </div>

      <div class="bar">
        <div class="message-field">
          <form autoComplete="off">
            <input
              type="text"
              id="message"
              value={message_to_send}
              onChange={handleNewMessageChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleMessageSubmit();
                }
              }}
              placeholder="Enter Message"
              required
            />

          </form>


          <button className="blue-buttons" onClick={handleMessageSubmit}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

//component to handle each chat message formatting
function Message({ name, message, pfpUrl, userName }) {
  //if the message is from the currently logged in user then we want to display it on the right side
  //of the screen instead.
  if (name == userName) {
    return (
      <>
        <div className="user-sent-message">
          <div className="resource">
            <div className="name">{name}</div>
            <div className="message">{message}</div>
          </div>
          <img src={pfpUrl} alt="Profile Image" className="profile-image" />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="resource-box-no-line-user">
        <img src={pfpUrl} alt="Profile Image" className="profile-image" />

        <div className="resource">
          <div className="name">{name}</div>
          <div className="message">{message}</div>
        </div>
      </div>
    </>
  );
}

export default Chat;
