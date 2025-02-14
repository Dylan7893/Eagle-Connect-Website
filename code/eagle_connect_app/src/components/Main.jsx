import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import Dashboard from "./dashboard/Dashboard";
import Login from "./account/Login";
import { useAuthState } from 'react-firebase-hooks/auth';

function Main(){

{/*We need to check if the user is logged in or not and we do this with this hook **/}    
const [user] = useAuthState(auth);


{/*If the user is not signed in show them login page, else we want to show them their dashboard*/}
if(user){
    return(
        <Dashboard email={user.email}/>
    );
  }else{
    return(
        <Login/>
    );
  }
};

export default Main;