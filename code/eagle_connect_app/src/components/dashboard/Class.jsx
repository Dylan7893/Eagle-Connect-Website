/*function to return a single class container with information such as Name, Number of Students, etc.
Also has a button to join the class. If the class is already joined the button will say Already Joined

*/
import React, { useEffect, useState } from "react";

function Class({ classDataStuff, joinClassCallback, userJoinedClasses }) {
  const [buttonText, setButtonText] = useState("Join");

  //use effect to check the join status of the class as it may change post render
  useEffect(() => {
    const checkJoin = () => {
      const alreadyJoined = userJoinedClasses.some(
        (item) => item.classID === classDataStuff.id
      );

      if (alreadyJoined) {
        setButtonText("Already Joined");
      } else {
        setButtonText("Join");
      }
    };

    checkJoin();
  }, [userJoinedClasses, classDataStuff.id]);


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
          onClick={() => joinClassCallback(classDataStuff)} //callback that is handled in the dashboard component
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

export default Class;