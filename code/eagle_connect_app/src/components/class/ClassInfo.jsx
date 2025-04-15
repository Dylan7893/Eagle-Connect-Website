/*
Class Component that will show the user all of the class information

If the user created the class, then they are allowed to edit the class page information if a mistake was made

Users an also leave the class from this page
*/

import classInfoPageStyle from "../../design/classInfoPage.css";
import React from "react";
import { auth, db } from "../../firebase";
import { useState, useEffect } from "react";
import { arrayRemove, increment, doc, updateDoc, getDoc, } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// function for retrieving class information for the class info component
function ClassInfo({ classID, toClassPage }) {
  const [classData, setClassData] = useState(null); // this will hold all of the class data that is pulled from firebase
  const [classToLeave, setClassToLeave] = useState(""); // this will hold all of the class info that user wants to leave that is pulled from firebase
  const [classLevel, setClassLevel] = useState(""); // this will hold what level the class is (fresh, soph, jun, sen.)
  const [classLevelUp, setClassLevelUp] = useState(""); // this will hold if class is a level up class 
  const [classLab, setClassLab] = useState(""); // this will hold if class has a lab or not
  const [classDescription, setClassDescription] = useState("");
  const [classNameEdit, setClassNameEdit] = useState("");
  const [classInitials, setClassInitials] = useState("");
  const [classNumber, setClassNumber] = useState(0);
  const [classSection, setClassSection] = useState("")
  const [classIsLevelUp, setClassIsLevelUp] = useState("");
  const [classRequiresLab, setClassRequiresLab] = useState("");
  const [shouldGetClassData, setShouldGetClassData] = useState(true);
  const navigate = useNavigate();

  //get all class data to display to the user
  try {

    useEffect(() => {
      getClassData();
    }, [classData]);
  }
  catch (error) {
    navigate();
  }


  async function saveClassChanges() {

    try {
      const user = auth.currentUser; // gets the current user from firebase authentication

      const userId = user.uid; // gets firebase authentication uid

      // gets the user document reference from firestore with auth uid
      const userDocRef = doc(db, "users", userId);

      // gets the user document that contains all of the various fields
      const userDoc = await getDoc(userDocRef);

      // this will hold all of the data/fields that is retreived from the user documents
      const userDocData = userDoc.data();

      //only allows the user who created the class to edit it
      if (classData.createdBy !== userId) {
        alert("You didnt create this class");
        return;
      }

      if (classIsLevelUp !== "No" && classIsLevelUp !== "Yes") {
        alert("Invalid input for is class level up.");
        return;
      }

      if (classRequiresLab !== "No" && classRequiresLab !== "Yes") {
        alert("Invalid input for is class requires lab.");
        return;
      }


      const classDocRef = doc(db, "availableClasses", classID.classID);
      var clu = "";
      var clab = "";
      if (classIsLevelUp === "Yes") {
        clu = "UR";
      }

      if (classRequiresLab === "Yes") {
        clab = "L";
      }
      //update the document if there were changes and if the user created the class
      try {
        await updateDoc(classDocRef, {
          className: classNameEdit,
          description: classDescription,
          classInitials: classInitials,
          classNumber: classNumber,
          classSection: classSection,
          classLevelUp: clu,
          classExtension: clab,
        });
        alert("Changes saved successfully!");
      } catch (error) { // catch any errors if any
        console.log("Error leaving class:", error);
        // debug stuff
        alert("Failed to leave the class. Please try again.");
      }
    }

    catch (error) {
      navigate();
    }
  }

  //function to get class data, may not be avaiable upon rendering so must be async
  const getClassData = async () => {
    try {
    //only get class data once! if this happens constantly then user can not edit class info
    if (shouldGetClassData) {
      const classDocRef = doc(db, "availableClasses", classID.classID);
      const classSnap = await getDoc(classDocRef);
      if (classSnap.exists) {
        const thisclassData = classSnap.data();

        setClassData(thisclassData);
        setClassToLeave(thisclassData) // this will store all the class info in the classData variable 
        setClassDescription(thisclassData.description);
        setClassNameEdit(thisclassData.className);
        setClassInitials(thisclassData.classInitials);
        setClassNumber(thisclassData.classNumber);
        setClassSection(thisclassData.classSection);
        setShouldGetClassData(false);


        //logic for determining if class is for freshman, sophomore, junior, senior, or graduate

        // if the class number is between 100-199, then the classLevel variable will be a freshmen level course
        if (thisclassData.classNumber < 200) {
          setClassLevel("Freshman");
        }
        // if the class number is between 200-299, then the classLevel variable will be a sophomore level course
        else if (thisclassData.classNumber >= 200 && thisclassData.classNumber < 300) {
          setClassLevel("Sophomore");
        }
        // if the class number is between 300-399, then the classLevel variable will be a junior level course
        else if (thisclassData.classNumber >= 300 && thisclassData.classNumber < 400) {
          setClassLevel("Junior");
        }
        // if the class number is between 400-499, then the classLevel variable will be a senior level course
        else if (thisclassData.classNumber >= 400 && thisclassData.classNumber < 500) {
          setClassLevel("Senior");
        }
        // if the class number is 500 or above, then the classLevel variable will be a graduate level course
        else if (thisclassData.classNumber >= 500) {
          setClassLevel("Graduate");
        }
        // else any user input error for class number
        else {
          setClassLevel("Unknown");
        }

        // if the classLevelUp from firebase is UR then it is a level up course
        if (thisclassData.classLevelUp === "UR") {
          setClassLevelUp("Yes");
          setClassIsLevelUp("Yes");
        }
        // if the classLevelUp from firebase is not UR then it is not a level up course
        else {
          setClassLevelUp("No");
          setClassIsLevelUp("No");
        }

        // if the classExtension from firebase is L then it has a lab
        if (thisclassData.classExtension === "L") {
          setClassLab("Yes");
          setClassRequiresLab("Yes");
        }
        // if the classExtension from firebase is not L then it does not have a lab
        else {
          setClassLab("No");
          setClassRequiresLab("No");
        }

      } else {
        console.log("get class data classnap does not exist.");
      }
    }
  }
  catch (error) {
    navigate();
  }

  }




  //allow the user to leave the class
  async function handleLeaveClass() {
    try {
      const user = auth.currentUser; // gets the current user from firebase authentication

      const userId = user.uid; // gets firebase authentication uid

      // gets the user document reference from firestore with auth uid
      const userDocRef = doc(db, "users", userId);

      // gets the user document that contains all of the various fields
      const userDoc = await getDoc(userDocRef);

      // this will hold all of the data/fields that is retreived from the user documents
      const userDocData = userDoc.data();

      // gets the class document reference from firestore with class id
      const classDocRef = doc(db, "availableClasses", classID.classID);

      // this will search through the joinedClasses array and find the class that matches
      // the class that the user wants to leave
      const specificJoinedClass = userDocData.joinedClasses.find((classToFind) =>
        classToFind.classID === classID.classID
      );

      // removes the class from the joinedClasses array
      // this will also update the joined classes that are shown on dashboard
      try {
        await updateDoc(userDocRef, {
          joinedClasses: arrayRemove(specificJoinedClass),
        });

        // each time a user leaves a class, the number of students will decrement by one each time
        // decrement is not apart of jsx so increment(-1) is same as decrement(1)
        await updateDoc(classDocRef, {
          numberOfStudents: increment(-1),
        });

        // debug stuff
        console.log("Class successfully left!");
      } catch (error) { // catch any errors if any
        console.log("Error leaving class:", error);
        // debug stuff
        alert("Failed to leave the class. Please try again.");
      }
    }
    catch (error) {
      navigate();
    }
  }
  // function for redirecting to dashboard 
  function toDashboard() {
    try {
      toClassPage("none");
      handleLeaveClass();
    }
    catch (error) {
      navigate();
    }
  }

  //returning class data if class data has been loaded
  if (classData != null) {
    return (
      <>
        <title>Class Information</title>
        <link rel="stylesheet" href={classInfoPageStyle} />
        <div className="class-info">

          <h1>Class Information</h1>
          <div className="class-info-grid">
            <div>


              <label> Class Name:</label>
              <input type="text" value={classNameEdit} onChange={(e) => setClassNameEdit(e.target.value)} />

            </div>
            <div>
              <label> Class Initials:</label>
              <input type="text" value={classInitials} onChange={(e) => setClassInitials(e.target.value)} />

              <label> Class Number:</label>
              <input type="text" value={classNumber} onChange={(e) => setClassNumber(e.target.value)} />

              <label> Class Section:</label>
              <input type="text" value={classSection} onChange={(e) => setClassSection(e.target.value)} />


            </div>
            <div>
              <span className="title">Course Level: </span>
              <span className="info">{classLevel}</span> {/*Pulled from const variables declared at top of code*/}
            </div>
            <div>
              <span className="title">Number of Students: </span>
              <span className="info">{classToLeave.numberOfStudents}</span> {/*Pulled directly from firebase*/}
            </div>
            <div>
              <label> Level UP?:</label>
              <input type="text" value={classIsLevelUp} onChange={(e) => setClassIsLevelUp(e.target.value)} />


            </div>
            <div>
              <label> Requires Lab?:</label>
              <input type="text" value={classRequiresLab} onChange={(e) => setClassRequiresLab(e.target.value)} />


            </div>
            <div>

              <label> Description:</label>
              <input type="text" value={classDescription} onChange={(e) => setClassDescription(e.target.value)} />

            </div>
          </div>
          <button className="leave-class" onClick={saveClassChanges}>Save Class Changes</button>
          <button className="leave-class" onClick={toDashboard}>Leave Class</button>

        </div>
      </>
    );
  } else {
    return (
      <>
        <p>Loading I guess?</p>
        <p>Class data is null.</p>
      </>
    )
  }

}

export default ClassInfo;
