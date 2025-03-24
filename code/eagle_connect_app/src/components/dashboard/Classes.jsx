import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, arrayUnion, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "../../design/dashboard2Style.css";

function Classes() {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        getClasses();
    }, []);


    // Function to handle getting the availableClasses collection 
    function getClasses() {

        // db is from the firebase.js file, exported constant so it can be used in different components 
        const classesRef = collection(db, "availableClasses");

        // Query handling function I believe
        getDocs(classesRef).then(response => {
            const classes_from_response = response.docs.map(doc => ({
                data: doc.data(),
                id: doc.id,

            }))
            setClasses(classes_from_response);
        }).catch(error => console.log(error));
    }

    // Function to handle adding the class to the joinedClasses collection
     function joinClass(classToJoin) {
        const user = auth.currentUser; // Gets the current user from firebase authentication

        const userId = user.uid; // Gets firebase authentication uid

        // Gets the user document reference from firestore with auth uid
        const userDocRef = doc(db, "users", userId);

        // adds the class to the joinedClasses array
        // users can now successfully join a class from avaiable class sidebar
        try {
            updateDoc(userDocRef, {
                joinedClasses: arrayUnion({
                    classInitials: classToJoin.classInitials,
                    classNumber: classToJoin.classNumber,
                    classExtension: classToJoin.classExtension,
                    classSection: classToJoin.classSection,
                    classLevelUp: classToJoin.classLevelUp,
                    className: classToJoin.className,
                    joinedAt: new Date(),
                }),
            });

            console.log("Class successfully joined!");
            alert(`You have joined the class: ${classToJoin.className}`);
        } catch (error) {
            console.log("Error joining class:", error);
            alert("Failed to join the class. Please try again.");
        }
    };

    return (
        <>
            <ul className="list-of-classes">
                {classes.map((each_class) => (
                    <li className="class-list-item" >
                        <div>
                            <h3>{each_class.data.className}</h3>
                            <p>{each_class.data.classInitials}</p>
                            <p>{each_class.data.classNumber}</p>
                            <p>{each_class.data.classSection}</p>
                            <button onClick={() => joinClass(each_class.data)}>
                                Join
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Classes;
