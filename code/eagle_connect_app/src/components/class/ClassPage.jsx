//Used to redirect the user to certain components
import "../../design/ClassPageStyle.css";
import { useState, useRef, useEffect } from "react";
import ClassTemplate from "./ClassTemplate";
import ClassInfo from "./ClassInfo";
import Notes from "./Notes";
import RateClass from "./RateClass";
import Resources from "./Resources";
import Reminders from "./Reminders";
import Chat from "./Chat";
import Dashboard from "../dashboard/Dashboard";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
function ClassPage({ classID, email }) {

  const [user] = useAuthState(auth);

  const [sectionClicked, setSectionClicked] = useState("chat");
  const[username, setUsername] = useState("");
  const messageContainerRef = useRef(null);
  
  
  useEffect(() => {
      getUserName();
    }, []);

    function getUserName(){
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
               
               var toSend;
               toSend = users_from_response.at(0).data.firstName;
               toSend += " ";
               toSend += users_from_response.at(0).data.lastName;
               setUsername(toSend);
             })
             .catch((error) => console.log(error));
    }
    //we want to scroll down for chat messages, it must be defined here
    function scrollDown(){
      const el = messageContainerRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }

  function handleCallBack(x) {
    setSectionClicked(x);
  }

  //handle which component to render based on what section the user clicks
  switch (sectionClicked) {
    case "chat":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} classID={classID} />
          <main className="main-section" ref ={messageContainerRef}>
            <Chat classID={classID} userName = {username} email={email} updateEvent = {scrollDown} />

          </main>
        </>
      );

    case "notes":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} classID={classID} />
          <main className="main-section">
            <Notes classID={classID} email={email} />
            
          </main>
        </>
      );

    case "reminders":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} classID={classID} />
          <main className="main-section">
            <Reminders classID={classID} email={email} />

          </main>
        </>
      );

    case "resources":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} classID={classID} />
          <main className="main-section">
            <Resources classID={classID} email={email} />
          </main>
        </>
      );
      
    case "rate":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} classID={classID} />
          <main className="main-section">
            <RateClass classID={classID} email={email} />
          </main>
        </>
      );

      case "info":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} classID={classID} />
          <main className="main-section">
            <ClassInfo classID={classID} toClassPage={handleCallBack}/>
          </main>
        </>
      );
//if no section is clicked then render the dashboard
      case "none":
      return (
        <>
          <Dashboard email = {user.email}/>
        </>
      );
  }

  return <></>;
}

export default ClassPage
