import classInfoPageStyle from "../../design/classInfoPage.css";
import React from "react";
import { db } from "../../firebase";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

// function for retrieving class information for the class info component
function ClassInfo({ className }) {
  const [classData, setClassData] = useState(""); // this will hold all of the class info that is pulled from firebase
  const [classLevel, setClassLevel] = useState(""); // this will hold what level the class is (fresh, soph, jun, sen.)
  const [classLevelUp, setClassLevelUp] = useState(""); // this will hold if class is a level up class 
  const [classLab, setClassLab] = useState(""); // this will hold if class has a lab or not

  // create class query to get the class object from the class name 
  const classQuery = query(
    collection(db, "availableClasses"),
    where("className", "==", className)
  );

  // use query to get class object (contains all class data) 
  getDocs(classQuery).then((response) => {
    const class_from_response = response.docs.map((doc) => ({
      data: doc.data(),
      id: doc.id,
    }));
    setClassData(class_from_response.at(0).data) // this will store all the class info in the classData variable 

    // if the class number is between 100-199, then the classLevel variable will be a freshmen level course
    if (class_from_response.at(0).data.classNumber >= 100 && class_from_response.at(0).data.classNumber < 200) {
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
    if (class_from_response.at(0).data.classLevelUp == "UR") {
      setClassLevelUp("Yes");
    }
    // if the classLevelUp from firebase is not UR then it is not a level up course
    else {
      setClassLevelUp("No");
    }
    
    // if the classExtension from firebase is L then it has a lab
    if (class_from_response.at(0).data.classExtension == "L") {
      setClassLab("Yes");
    }
    // if the classExtension from firebase is not L then it does not have a lab
    else {
      setClassData("No");
    }

  })

  return (
    <>
      <title>Class Information</title>
      <link rel="stylesheet" href={classInfoPageStyle} />
      <div className="class-info">
        <h1>Class Information</h1>
        <div className="class-info-grid">
          <div>
            <span className="title">Class Name: </span>
            <span className="info">{classData.className}</span> {/*Pulled directly from firebase*/}
          </div>
          <div>
            <span className="title">Class Number: </span>
            <span className="info">{classData.classInitials}-{classData.classNumber} </span> {/*Pulled directly from firebase*/}
          </div>
          <div>
            <span className="title">Course Level: </span>
            <span className="info">{classLevel}</span> {/*Pulled from const variables declared at top of code*/}
          </div>
          <div>
            <span className="title">Number of Students: </span>
            <span className="info">{classData.numberOfStudents}</span> {/*Pulled directly from firebase*/}
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
            <span className="title">Description: </span>
            <span className="info">
              Course covers the dicipline that applies engineering principles to
              the design, development, testing, and maintenance of software
              systems, aiming to create high-quality, reliable, and maintainable
              software.
            </span>
          </div>
        </div>
        <button className="leave-class">Leave Class</button>
      </div>
    </>
  );
}

export default ClassInfo;
