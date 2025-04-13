import React from "react";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";


function JoinedClass({ toParentCallBack, classID }) {
    //holds data we will be using to display class info
    const [classData, setClassData] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getClassData();
    }, [classData]);

    /*When a user clicks on a joined class, we want to set the component to that class.*/

    function initCallBack() {
        toParentCallBack(classID);
    }

    async function getClassData() {
        console.log("hello from getClassData");
        console.log("ClassID: ", classID);


        const classDocRef = doc(db, "availableClasses", classID.classID);
        const classSnap = await getDoc(classDocRef);
        const thisclassData = classSnap.data();
        console.log(thisclassData);
        setClassData(thisclassData);
        setLoading(false);
    }

    if(!loading){
        return (
            <>
                <div className="joined-class-card" onClick={initCallBack}>
                    {/* example class */}
                    <h3>{classData.className}</h3>
                    <p>
                        {" "}
                        {classData.classInitials}-{classData.classNumber}
                        {classData.classExtension}-{classData.classSection}
                        {classData.classLevelUp}{" "}
                    </p>
                </div>
            </>
        );
    }else{
        return(
<>
                <div className="joined-class-card" onClick={initCallBack}>
                    {/* example class */}
                    <h3>loading</h3>
                    <p>
                        {" "}
                        loading-loading
                        loading-loading
                        loading{" "}
                    </p>
                </div>
            </>
        );
    }
    
}

export default JoinedClass;