/*
Class Component that will show the user all of the class information

If the user created the class, then they are allowed to edit the class page information if a mistake was made

Users an also leave the class from this page
*/

import classInfoPageStyle from "../../design/classInfoPage.css";
import React from "react";
import { auth, db } from "../../firebase";
import { useState, useEffect } from "react";
import {
  arrayRemove,
  increment,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
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
  const [classSection, setClassSection] = useState("");
  const [classIsLevelUp, setClassIsLevelUp] = useState("");
  const [classIsLevelUpOpposite, setClassIsLevelUpOppopsite] = useState("");
  const [classRequiresLab, setClassRequiresLab] = useState("");
  const [classExtension, setClassExtension] = useState("");
  const [classExtensionOpp1, setClassExtensionOpp1] = useState("");
  const [classExtensionOpp2, setClassExtensionOpp2] = useState("");
  const [classExtensionOpp3, setClassExtensionOpp3] = useState("");
  const [classRequiresLabOpposite, setClassRequiresLabOpposite] = useState("");
  const [shouldGetClassData, setShouldGetClassData] = useState(true);
  const navigate = useNavigate();

  //get all class data to display to the user
  try {
    useEffect(() => {
      getClassData();
    }, [classData]);
  } catch (error) {
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
        alert("Only users who created the class have access to edit it.");
        return;
      }

      const classDocRef = doc(db, "availableClasses", classID.classID);
      var clu = "";
      var clab = "";
      if (classIsLevelUp === "Yes") {
        clu = "UR";
      }

      if (classExtension === "L") {
        clab = "L";
      }

      if (classExtension === "C") {
        clab = "C";
      }

      if (classExtension === "D") {
        clab = "D";
      }

      if (classExtension === "") {
        clab = "";
      }
      //update the document if there were changes and if the user created the class
      try {
        await updateDoc(classDocRef, {
          className: classNameEdit.toUpperCase(),
          description: classDescription,
          classInitials: classInitials.toUpperCase(),
          classNumber: classNumber,
          classSection: classSection,
          classLevelUp: clu,
          classExtension: clab,
        });
      } catch (error) {
        // catch any errors if any
        console.log("Error leaving class:", error);
        // debug stuff
        alert("Failed to leave the class. Please try again.");
      }
    } catch (error) {
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
          setClassToLeave(thisclassData); // this will store all the class info in the classData variable
          setClassDescription(thisclassData.description);
          setClassNameEdit(thisclassData.className);
          setClassInitials(thisclassData.classInitials);
          setClassNumber(thisclassData.classNumber);
          setClassSection(thisclassData.classSection);
          setClassExtension(thisclassData.classExtension);
          setShouldGetClassData(false);

          //logic for determining if class is for freshman, sophomore, junior, senior, or graduate

          // if the class number is between 100-199, then the classLevel variable will be a freshmen level course
          if (thisclassData.classNumber < 200) {
            setClassLevel("Freshman");
          }
          // if the class number is between 200-299, then the classLevel variable will be a sophomore level course
          else if (
            thisclassData.classNumber >= 200 &&
            thisclassData.classNumber < 300
          ) {
            setClassLevel("Sophomore");
          }
          // if the class number is between 300-399, then the classLevel variable will be a junior level course
          else if (
            thisclassData.classNumber >= 300 &&
            thisclassData.classNumber < 400
          ) {
            setClassLevel("Junior");
          }
          // if the class number is between 400-499, then the classLevel variable will be a senior level course
          else if (
            thisclassData.classNumber >= 400 &&
            thisclassData.classNumber < 500
          ) {
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
            setClassIsLevelUpOppopsite("No");
          }
          // if the classLevelUp from firebase is not UR then it is not a level up course
          else {
            setClassLevelUp("No");
            setClassIsLevelUp("No");
            setClassIsLevelUpOppopsite("Yes");
          }

          // if the classExtension from firebase is L then it has a lab
          if (thisclassData.classExtension === "L") {
            setClassExtension("L");
            setClassExtensionOpp1("");
            setClassExtensionOpp2("C");
            setClassExtensionOpp3("D");
          }
          // if the classExtension from firebase is C then it has a capstone C
          else if (thisclassData.classExtension === "C") {
            setClassExtension("C");
            setClassExtensionOpp1("");
            setClassExtensionOpp2("L");
            setClassExtensionOpp3("D");
          }
          // if the classExtension from firebase is D then it has a capstone D
          else if (thisclassData.classExtension === "D") {
            setClassExtension("D");
            setClassExtensionOpp1("");
            setClassExtensionOpp2("C");
            setClassExtensionOpp3("L");
          }
          // if the classExtension from firebase is not L, C, D then it does not have an extension
          else {
            setClassExtension("");
            setClassExtensionOpp1("L");
            setClassExtensionOpp2("C");
            setClassExtensionOpp3("D");
          }
        } else {
          console.log("get class data classnap does not exist.");
        }
      }
    } catch (error) {
      navigate();
    }
  };

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
      const specificJoinedClass = userDocData.joinedClasses.find(
        (classToFind) => classToFind.classID === classID.classID
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
      } catch (error) {
        // catch any errors if any
        console.log("Error leaving class:", error);
        // debug stuff
        alert("Failed to leave the class. Please try again.");
      }
    } catch (error) {
      navigate();
    }
  }
  // function for redirecting to dashboard
  function toDashboard() {
    try {
      toClassPage("none");
      handleLeaveClass();
    } catch (error) {
      navigate();
    }
  }

  //returning class data if class data has been loaded
  if (classData != null) {
    return (
      <>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // this disables the automatic reload of the page
            if (
              classInitials === "" || // if any field is empty other than extension or levelUP then ...
              classNumber === "" ||
              classSection === "" ||
              classNameEdit === "" ||
              classDescription === ""
            ) {
              return; // this will prevent from creating a class with empty required fields
            }
            saveClassChanges(); // this will only execute if input is valid, that's why I moved it up here - Landon
          }}
        >
          <title>Class Information</title>
          <link rel="stylesheet" href={classInfoPageStyle} />
          <div className="class-info">
            <h1>Class Information</h1>
            <div className="class-info-grid">
              <div className="title-column">
                <span className="title"> Class Name:</span>
                <input
                  className="info-input"
                  type="text"
                  value={classNameEdit}
                  onChange={(e) => setClassNameEdit(e.target.value)}
                  required
                />

                <div>
                  <span className="title"> Description:</span>
                  <input
                    className="info-input"
                    type="text"
                    value={classDescription}
                    onChange={(e) => setClassDescription(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="info-input-text">
                    <span className="title">Course Level: </span>
                    <span className="info">{classLevel}</span>{" "}
                  </div>
                  {/*Pulled from const variables declared at top of code*/}
                </div>

                <div>
                  <span className="title">Number of Students: </span>
                  <span className="info">
                    {classToLeave.numberOfStudents}
                  </span>{" "}
                  {/*Pulled directly from firebase*/}
                </div>
              </div>

              <div className="title-column">
                <span className="title"> Class Initials:</span>
                <input
                  className="info-input"
                  type="text"
                  value={classInitials}
                  minLength="2"
                  maxLength="4"
                  onChange={(e) =>
                    setClassInitials(e.target.value.replace(/[^A-Za-z]/g, ""))
                  }
                  required
                />

                <span className="title"> Class Number:</span>
                <input
                  className="info-input"
                  type="number"
                  value={classNumber}
                  min="0"
                  max="999"
                  onChange={(e) => setClassNumber(e.target.value)}
                  required
                />

                <span className="title"> Class Section:</span>
                <input
                  className="info-input"
                  type="number"
                  value={classSection}
                  min="0"
                  max="999"
                  onChange={(e) => setClassSection(e.target.value)}
                  required
                />

                <div>
                  <span className="title"> Level UP?: </span>

                  <select
                    className="classInfoSelect"
                    onChange={(e) => setClassIsLevelUp(e.target.value)}
                  >
                    <option value={classIsLevelUp}>{classIsLevelUp}</option>
                    <option value={classIsLevelUpOpposite}>
                      {classIsLevelUpOpposite}
                    </option>
                  </select>
                </div>
                <div>
                  <span className="title"> Class Extension: </span>
                  <select onChange={(e) => setClassExtension(e.target.value)}>
                    <option value={classExtension}>{classExtension}</option>
                    <option value={classExtensionOpp1}>
                      {classExtensionOpp1}
                    </option>
                    <option value={classExtensionOpp2}>
                      {classExtensionOpp2}
                    </option>
                    <option value={classExtensionOpp3}>
                      {classExtensionOpp3}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <button className="save-class" type="submit">
              Save Class Changes
            </button>
            <button className="leave-class" onClick={toDashboard}>
              Leave Class
            </button>
          </div>
        </form>
      </>
    );
  } else {
    return (
      <>
        <p>Loading I guess?</p>
        <p>Class data is null.</p>
      </>
    );
  }
}

export default ClassInfo;
