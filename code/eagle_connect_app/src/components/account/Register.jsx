import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import "../../design/loginStyle.css";
import {db} from "../../firebase";
import {collection, addDoc} from "firebase/firestore";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  {/* Upon successful registration, add that user's credential to the database*/}
  function databaseAddUser(){
    alert("database add user called");
    const usersCollectRef = collection(db, "users");
    addDoc(usersCollectRef, {firstName, lastName, email}).then(response =>{
      console.log(response);
    })
  }

  
  const signUp = (e) => {
    e.preventDefault();

    if(!email.endsWith("@moreheadstate.edu")){
      alert("Must be an MSU Email to Sign Up.");
    }else{
      createUserWithEmailAndPassword(auth, email, password, firstName, lastName)
      .then((userCredential) => {
        console.log(userCredential);
        {/*Add users info the database*/}
        databaseAddUser();
        navigate("/app");
      })
      .catch((error) => {
        console.log(error);
      });
    }
};

  return (
    <div class="outside">
      <div class="sign-in-container">
      <form onSubmit={signUp}>
        <h1>Create Account</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          type="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        ></input>
        <input
          type="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        ></input>
        <button type="submit">Sign Up</button>
      </form>
      </div>
    </div>

      
   
  );
};

export default Register;
