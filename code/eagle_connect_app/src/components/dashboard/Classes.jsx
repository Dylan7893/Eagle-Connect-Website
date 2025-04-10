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
  const [notUserJoinedClasses, setNotUserJoinedClasses] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getClasses();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  function getUserJoinedClasses() {
    let userJoinedClassesArr = [];
    console.log("get user classes called");

    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    {
      /*Use query to get user object (contains first name, last name, etc.) */
    }
    getDocs(userQuery)
      .then((response) => {
        const users_from_response = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        {
          /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
        }
        users_from_response.at(0).data.joinedClasses.forEach((item, index) => {
          userJoinedClassesArr.push(item.className);
        });
      })
      .catch((error) => console.log(error));
    console.log("user joined classes array: ");
    console.log(userJoinedClassesArr);
    setUserJoinedClasses(userJoinedClassesArr);
    console.log("User joined classes use state thing: ");
    console.log(userJoinedClasses);
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

    // Gets the class document reference from firestore with class id
    const classDocRef = doc(db, "availableClasses", classToJoin.id);

    // adds the class to the joinedClasses array
    // users can now successfully join a class from avaiable class sidebar
    try {
      await updateDoc(userDocRef, {
        joinedClasses: arrayUnion({
          classInitials: classToJoin.data.classInitials.toUpperCase(),
          classNumber: classToJoin.data.classNumber,
          classExtension: classToJoin.data.classExtension,
          classSection: classToJoin.data.classSection,
          classLevelUp: classToJoin.data.classLevelUp,
          className: classToJoin.data.className.toUpperCase(),
          joinedAt: new Date(),
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

  return (
    <>
      {classes.map((each_class) => (
        <li className="class-list-item">
          <div>
            <h3>{each_class.data.className}</h3>
            <p>
              {" "}
              {each_class.data.classInitials}-{each_class.data.classNumber}
              {each_class.data.classExtension}-{each_class.data.classSection}
              {each_class.data.classLevelUp}{" "}
            </p>
            <p> Students: {each_class.data.numberOfStudents} </p>
            <button onClick={() => joinClass(each_class)}>Join</button>
          </div>
        </li>
      ))}
    </>
  );
}

export default Classes;
