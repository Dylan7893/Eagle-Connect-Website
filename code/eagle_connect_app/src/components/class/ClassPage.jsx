
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
  arrayUnion,
  updateDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
function ClassPage({ className, email }) {

  const [user] = useAuthState(auth);

  const [sectionClicked, setSectionClicked] = useState("chat");
  const[username, setUsername] = useState("");
  const messageContainerRef = useRef(null);
    //refresh the messages every 100ms
  
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
    function scrollDown(){
      const el = messageContainerRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
  
    /*
    useEffect(() => {
      const intervalId = setInterval(() => {
        scrollDown();
      }, 100);
      return () => clearInterval(intervalId);
    }, []);
  */

  function handleCallBack(x) {
    setSectionClicked(x);
  }
  {
    /*There has GOT to be a better way to do this. ~Chase*/
  }
  switch (sectionClicked) {
    case "chat":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section" ref ={messageContainerRef}>
            <Chat className={className} userName = {username} email={email} updateEvent = {scrollDown} />
            {/* end main */}
          </main>
        </>
      );

    case "notes":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <Notes className={className} email={email} />
            {/* end main */}
          </main>
        </>
      );

    case "reminders":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <Reminders className={className} email={email} />
            {/* end main */}
          </main>
        </>
      );

    case "resources":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <Resources className={className} email={email} />
            {/* end main */}
          </main>
        </>
      );
      
    case "rate":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <RateClass className={className} email={email} />
            {/* end main */}
          </main>
        </>
      );

      case "info":
      return (
        <>
          <ClassTemplate toClassPage={handleCallBack} className={className} />
          <main className="main-section">
            <ClassInfo className={className} toClassPage={handleCallBack}/>
            {/* end main */}
          </main>
        </>
      );

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
