import React, { useEffect, useState } from "react";

function Class({ classDataStuff, joinClassCallback, userJoinedClasses }) {
const [buttonText, setButtonText] = useState("Join");

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
              onClick={() => joinClassCallback(classDataStuff)}
            >
              {buttonText}
            </button>
          </div>
        </>
      );
}

export default Class;