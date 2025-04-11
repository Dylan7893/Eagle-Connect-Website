import classInfoPageStyle from "../../design/classInfoPage.css";
import React from "react";
import { auth, db } from "../../firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, arrayRemove, increment, doc, arrayUnion, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

// function for retrieving class information for the class info component
function ClassInfo({ className, toClassPage }) {
  const [classData, setClassData] = useState(""); // this will hold all of the class data that is pulled from firebase
  const [classToLeave, setClassToLeave] = useState(""); // this will hold all of the class info that user wants to leave that is pulled from firebase
  const [classLevel, setClassLevel] = useState(""); // this will hold what level the class is (fresh, soph, jun, sen.)
  const [classLevelUp, setClassLevelUp] = useState(""); // this will hold if class is a level up class 
  const [classLab, setClassLab] = useState(""); // this will hold if class has a lab or not
  const [classDescription, setClassDescription] = useState("");
  const [classNameEdit, setClassNameEdit] = useState("");
  const [classInitials, setClassInitials] = useState("");
  const [classNumber, setClassNumber] = useState(0);
  const [classSection, setClassSection] = useState("")
  useEffect(() => {
        getClassData();
    }, []);


    async function saveClassChanges(){
      const classDocRef = doc(db, "availableClasses", classData.id);
      try {
        await updateDoc(classDocRef, {
          className: classNameEdit,
          description: classDescription,
          classInitials: classInitials,
          classNumber: classNumber,
          classSection: classSection,

          
        });
        alert("Changes saved successfully!");
      }catch (error) { // catch any errors if any
        console.log("Error leaving class:", error);
        // debug stuff
        alert("Failed to leave the class. Please try again.");
      }
    }


  function getClassData(){
//create class query to get the class object from the class name 
const classQuery = query(
  collection(db, "availableClasses"),
  where("className", "==", className),
);

// use query to get class object (contains all class data) 
getDocs(classQuery).then((response) => {
  const class_from_response = response.docs.map((doc) => ({
    data: doc.data(),
    id: doc.id,
  }));
  setClassData(class_from_response.at(0)) // this will store all the class info in the classData variable 
  setClassToLeave(class_from_response.at(0).data) // this will store all the class info in the classData variable 
  setClassDescription(class_from_response.at(0).data.description);
  setClassNameEdit(class_from_response.at(0).data.className);
  setClassInitials(class_from_response.at(0).data.classInitials);
  setClassNumber(class_from_response.at(0).data.classNumber);
  setClassSection(class_from_response.at(0).data.classSection);
  // if the class number is between 100-199, then the classLevel variable will be a freshmen level course
  if (class_from_response.at(0).data.classNumber < 200) {
    setClassLevel("Freshman");
  }
  // if the class number is between 200-299, then the classLevel variable will be a sophomore level course
  else if (class_from_response.at(0).data.classNumber >= 200 && class_from_response.at(0).data.classNumber < 300) {
    setClassLevel("Sophomore");
  }
  // if the class number is between 300-399, then the classLevel variable will be a junior level course
  else if (class_from_response.at(0).data.classNumber >= 300 && class_from_response.at(0).data.classNumber < 400) {
    setClassLevel("Junior");
  }
  // if the class number is between 400-499, then the classLevel variable will be a senior level course
  else if (class_from_response.at(0).data.classNumber >= 400 && class_from_response.at(0).data.classNumber < 500) {
    setClassLevel("Senior");
  }
  // if the class number is 500 or above, then the classLevel variable will be a graduate level course
  else if (class_from_response.at(0).data.classNumber >= 500) {
    setClassLevel("Graduate");
  }
  // else any user input error for class number
  else {
    setClassLevel("Unknown");
  }

  // if the classLevelUp from firebase is UR then it is a level up course
  if (class_from_response.at(0).data.classLevelUp === "UR") {
    setClassLevelUp("Yes");
  }
  // if the classLevelUp from firebase is not UR then it is not a level up course
  else {
    setClassLevelUp("No");
  }

  // if the classExtension from firebase is L then it has a lab
  if (class_from_response.at(0).data.classExtension === "L") {
    setClassLab("Yes");
  }
  // if the classExtension from firebase is not L then it does not have a lab
  else {
    setClassLab("No");
  }
})
  }
  

  //validate message
  async function handleLeaveClass() {

    const user = auth.currentUser; // gets the current user from firebase authentication

    const userId = user.uid; // gets firebase authentication uid

    // gets the user document reference from firestore with auth uid
    const userDocRef = doc(db, "users", userId);

    // gets the user document that contains all of the various fields
    const userDoc = await getDoc(userDocRef);

    // this will hold all of the data/fields that is retreived from the user documents
    const userDocData = userDoc.data();

    // gets the class document reference from firestore with class id
    const classDocRef = doc(db, "availableClasses", classData.id);

    // this will search through the joinedClasses array and find the class that matches
    // the class that the user wants to leave
    const specificJoinedClass = userDocData.joinedClasses.find((classToFind) =>
      classToFind.className === classToLeave.className &&
      classToFind.classNumber === classToLeave.classNumber &&
      classToFind.classSection === classToLeave.classSection
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
  // function for redirecting to dashboard 
  function toDashboard() {
    toClassPage("none");
    handleLeaveClass();
  }
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
            <span className="title">Level UP?: </span>
            <span className="info">{classLevelUp}</span> {/*Pulled from const variables declared at top of code*/}
          </div>
          <div>
            <span className="title">Requires Lab?: </span>
            <span className="info">{classLab}</span> {/*Pulled from const variables declared at top of code*/}
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
}


export default ClassInfo;
