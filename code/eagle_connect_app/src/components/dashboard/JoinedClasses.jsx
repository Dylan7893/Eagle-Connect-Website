import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";
import "../../design/dashboard2Style.css";
import {collection, getDocs, query,where} from "firebase/firestore";
import Classes from "./Classes";
import {db} from "../../firebase";
import {useEffect, useState} from "react";


function JoinedClasses(props){

    const [joinedClasses, setJoinedClasses] = useState([]);
    
    
        useEffect( ()=> {
            getJoinedClasses();
        }, [])

       
    {/*Function that returns all of the joined clases the user has joined*/}
      async function getJoinedClasses(){
        {/*Create query to get the user object from their email*/}
        const userQuery = query(
          collection(db, "users"),
          where('email', '==', props.email)
        );
    
        {/*Use query to get user object (contains first name, last name, etc.) */}
        getDocs(userQuery).then( response => {
                    const users_from_response = response.docs.map(doc => ({
                        data: doc.data(),
                        id: doc.id,
                    }))
                    {/*We only want the first element. if the element size is greater than 1 then there is a big problem.*/}
                    console.log("Testing Name of the first class the user has joined" + users_from_response.at(0).data.joinedClasses.at(0).className);

                    {/*Get the joined classes from the user*/}
                    setJoinedClasses(users_from_response.at(0).data.joinedClasses);

                    console.log("Hook test : " + joinedClasses.at(0).className);
                }).catch(error => console.log(error));
    
      }

    return(
        <>
        {/*Return every joined class and convert it using the template*/}
        {joinedClasses.map(each_class =><JoinedClass number={each_class.className}/>)}
        </>
    );
}

{/*Template For each joined class*/}
function JoinedClass(props){
    const number = props.number;
    return(
        <>
        <div className="joined-class-card">
          {/* example class */}
          <h3>{props.number}</h3>⭐ ⭐ ⭐
          <div className="joined-class-actions">
            <button className="action-button">⭐</button>
            <button className="action-button">⚙️</button>
            <button className="action-button">...</button>
            {/* end joined class actions */}
          </div>
          {/* end joined class card */}
        </div>
        </>
    );
}

export default JoinedClasses;