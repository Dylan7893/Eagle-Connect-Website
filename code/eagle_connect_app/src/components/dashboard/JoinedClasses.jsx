import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";
import "../../design/dashboard2Style.css";
import {collection, getDocs, query,where} from "firebase/firestore";
import Classes from "./Classes";
import {db} from "../../firebase";
import {useEffect, useState} from "react";


function JoinedClasses({toDashboardCallBack, email}){

    const [joinedClasses, setJoinedClasses] = useState([]);
    
    
        useEffect( ()=> {
            getJoinedClasses();
        }, [])

       function initCallBack(x){
        toDashboardCallBack(x);
       }

    {/*Function that returns all of the joined clases the user has joined*/}
      async function getJoinedClasses(){
        {/*Create query to get the user object from their email*/}
        const userQuery = query(
          collection(db, "users"),
          where('email', '==', email)
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
        {joinedClasses.map(each_class =><JoinedClass toParentCallBack = {initCallBack} number={each_class.className}/>)}
        </>
    );
}

{/*Template For each joined class*/}
function JoinedClass({ toParentCallBack, number}){
  {/*When a user clicks on a joined class, we want to set the component to that class.*/}
  function initCallBack(){
    toParentCallBack(number);
  }
    return(
        <>
        <div className="joined-class-card" onClick={initCallBack}>
          {/* example class */}
          <h3>{number}</h3>⭐ ⭐ ⭐
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