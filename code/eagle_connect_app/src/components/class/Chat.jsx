import React from "react";
import { auth, db } from "../../firebase";
import { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  arrayUnion,
  updateDoc,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

/*Component where you can send chat messages */
function Chat({ classID, email, updateEvent, userName }) {
  //form handling stuff
  const [message_to_send, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("Test");
  const [imgageUrl, setImageUrl] = useState("");
  const [user_messages, setUserMessages] = useState([]);
  const messageContainerRef = useRef(null);
  

  //refresh the messages every 100ms

  useEffect(() => {
    const intervalId = setInterval(() => {
      getNameAndPfp();
      getAllMessages();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const handleClearMessage = () => {
    setMessageToSend("");
  };

  async function getNameAndPfp() {
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
        setImageUrl(users_from_response.at(0).data.pfpUrl);
      })
      .catch((error) => console.log(error));
  }

  async function getAllMessages() {
    /*Create query to get the user object from their email*/
    await getNameAndPfp();

    const classDocRef = doc(db, "availableClasses", classID.classID);
    const classSnap = await getDoc(classDocRef);
    const thisclassData = classSnap.data();
    setMessages(thisclassData.messages.slice(-20));
  }

  async function uploadNewMessage() {
    var class_id;

    getNameAndPfp();

    
      const classDocRef = doc(db, "availableClasses", classID.classID);
      updateDoc(classDocRef, {
        messages: arrayUnion({
          name: name,
          message: message_to_send,
          pfpUrl: imgageUrl,
        }),
      });
    
    
    setMessages(messages);
    updateEvent();
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
      <div className="messages-container" ref = {messageContainerRef}>
        
        {messages.map((each_class) => (
          <Message
            key={each_class.id}
            name={each_class.name}
            message={each_class.message}
            pfpUrl={each_class.pfpUrl}
            userName = {userName}
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
              placeholder="Enter Message"
              required
            />
          </form>

          <button className="blue-buttons" onClick={handleMessageSubmit}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}

function Message({ name, message, pfpUrl, userName }) {
  //if the message is from the currently logged in user then we want to display it on the right side
  //of the screen instead.
  if(name == userName){
    return(
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

function UserSentMessage({ name, message, pfpUrl }) {
  return (
    <>
      <div className="resource-box-no-line">
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
