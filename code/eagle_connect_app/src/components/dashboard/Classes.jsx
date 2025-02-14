import React, {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase";
import "../../design/dashboard2Style.css";


{/*big help: https://www.youtube.com/watch?v=F7t-n5c7JsE*/}

function Classes(){

    const [classes, setClasses] = useState([]);


    useEffect( ()=> {
        getClasses();
    }, [])


    {/*Function to handle getting the availableClasses collection */}
    function getClasses(){

        {/*db is from the firebase.js file, exported constant so it can be used in different components */}
        const classesRef = collection(db, "availableClasses");

        {/* Query handling function I believe*/}
        getDocs(classesRef).then( response => {
            const classes_from_response = response.docs.map(doc => ({
                data: doc.data(),
                id: doc.id,

            }))
            setClasses(classes_from_response);
        }).catch(error => console.log(error));


    }

    return(
        <>
        {/*classes is an array so you must iterate through each class and display it in tag, doesnt have to be a <p> tag*/}
        <ul className="list-of-classes">
        {classes.map(each_class =><li className = "class-list-item">{each_class.data.name}</li>)}
        </ul>
       </> 
    );
}

export default Classes;