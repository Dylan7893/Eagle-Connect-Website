//DEPRECATED SHOULD BE DELETED SOON. 
//DO NOT USE THIS

/*
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  arrayUnion,
  updateDoc,
  getDoc,
  increment,
  setDoc,
  where,
  query,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import "../../design/dashboard2Style.css";

function Classes({ email }) {
  const [classes, setClasses] = useState([]);
  const [userJoinedClasses, setUserJoinedClasses] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getClasses();
      getUserJoinedClasses();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const getUserJoinedClasses = async () => {
    let userJoinedClassesArr = [];

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
      
        users_from_response.at(0).data.joinedClasses.forEach((item, index) => {
          userJoinedClassesArr.push(item.className);

        });
        setUserJoinedClasses(userJoinedClassesArr);
      })
      .catch((error) => console.log(error));

  }
  // Function to handle getting the availableClasses collection
  function getClasses() {
    // db is from the firebase.js file, exported constant so it can be used in different components
    const classesRef = collection(db, "availableClasses");

    // Query handling function I believe
    getDocs(classesRef)
      .then((response) => {
        const classes_from_response = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));

        //WORK HERE:::: FOR EACH CLASS IN CLASSES FROM RESPONSE IF NAME IS NOT IN USER JOINED CLASSES THEN ADD IT TO THE CLASSES
        setClasses(classes_from_response);
      })
      .catch((error) => console.log(error));
  }

  // Function to handle adding the class to the joinedClasses collection
  async function joinClass(classToJoin) {
    const user = auth.currentUser; // Gets the current user from firebase authentication

    const userId = user.uid; // Gets firebase authentication uid

    // Gets the user document reference from firestore with auth uid
    const userDocRef = doc(db, "users", userId);
    var shouldJoinClass = true;
    // Gets the class document reference from firestore with class id
    const classDocRef = doc(db, "availableClasses", classToJoin.id);
    await getUserJoinedClasses();
    userJoinedClasses.forEach((item, index) => {
      if (item == classToJoin.data.className) {
        alert("Already joined this class.");
        shouldJoinClass = false;
        return;
      }

    });


    // adds the class to the joinedClasses array
    // users can now successfully join a class from avaiable class sidebar
    console.log("we are inside join class. this is userJoined classes: " + userJoinedClasses);
    if (shouldJoinClass) {
      try {
        await updateDoc(userDocRef, {
          joinedClasses: arrayUnion({
            classID: classToJoin.id,
          }),
        });


        // each time a class is joined, the number of students will increment by one each time
        await updateDoc(classDocRef, {
          numberOfStudents: increment(1),
        });

        console.log("Class successfully joined!");
      } catch (error) {
        console.log("Error joining class:", error);
        alert("Failed to join the class. Please try again.");
      }
    }

  }

  return (
    <>
      {classes.map((each_class) => (
        <li className="class-list-item">
          <Class classDataStuff={each_class} joinClassCallback={joinClass} userJoinedClasses={userJoinedClasses} />
        </li>
      ))}

    </>
  );
}
function Class({ classDataStuff, joinClassCallback, userJoinedClasses }) {
  var classAlreadyJoined = false;
  userJoinedClasses.forEach((item, index) => {
    if (item == classDataStuff.data.className) {
      classAlreadyJoined = true;
        }

  });

  if(classAlreadyJoined){
    return (
      <>
        <div>
          <h3>{classDataStuff.data.className}</h3>
          <p>
            {" "}
            {classDataStuff.data.classInitials}-{classDataStuff.data.classNumber}
            {classDataStuff.data.classExtension}-{classDataStuff.data.classSection}
            {classDataStuff.data.classLevelUp}{" "}
          </p>
          <p> Students: {classDataStuff.data.numberOfStudents} </p>
  
          <button
            className="blue-buttons"
            onClick={() => joinClassCallback(classDataStuff)}
          >
            Already Joined
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <div>
        <h3>{classDataStuff.data.className}</h3>
        <p>
          {" "}
          {classDataStuff.data.classInitials}-{classDataStuff.data.classNumber}
          {classDataStuff.data.classExtension}-{classDataStuff.data.classSection}
          {classDataStuff.data.classLevelUp}{" "}
        </p>
        <p> Students: {classDataStuff.data.numberOfStudents} </p>

        <button
          className="blue-buttons"
          onClick={() => joinClassCallback(classDataStuff)}
        >
          Join
        </button>
      </div>
    </>
  );

}



export default Classes;
*/