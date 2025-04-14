//DEPRECATED THIS SHOULD BE DELETED SOON ~Chase
/*
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";
import "../../design/dashboard2Style.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import Classes from "./Classes";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

function JoinedClasses({ toDashboardCallBack, email }) {
  const [joinedClasses, setJoinedClasses] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getJoinedClasses();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  function initCallBack(x) {
    toDashboardCallBack(x);
  }


  async function getJoinedClasses() {
   
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

   
    getDocs(userQuery)
      .then((response) => {
        const users_from_response = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
       

     
        setJoinedClasses(users_from_response.at(0).data.joinedClasses);
      })
      .catch((error) => console.log(error));
  }

  return (
    <>

      {joinedClasses.map((each_class) => (
        <JoinedClass
          toParentCallBack={initCallBack}
          name={each_class.className}
          number={each_class.classNumber}
          initials={each_class.classInitials}
          section={each_class.classSection}
          extension={each_class.classExtension}
          levelUp={each_class.classLevelUp}
        />
      ))}
    </>
  );
}


function JoinedClass({
  toParentCallBack,
  name,
  number,
  initials,
  section,
  extension,
  levelUp,
}) {

  function initCallBack() {
    toParentCallBack(name, number, initials, section, extension, levelUp);
  }
  return (
    <>
      <div className="joined-class-card" onClick={initCallBack}>

        <h3>{name}</h3>
        <p>
          {" "}
          {initials}-{number}
          {extension}-{section}
          {levelUp}{" "}
        </p>

      </div>
    </>
  );
}

export default JoinedClasses;
*/