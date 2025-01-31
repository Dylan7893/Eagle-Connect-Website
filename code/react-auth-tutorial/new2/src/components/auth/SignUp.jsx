import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();

    if(!email.endsWith("@moreheadstate.edu")){
      console.log("Must be an MSU EMAIL!!!!!");
      alert("Must be an MSU Email to Sign Up.");
    }else{
      createUserWithEmailAndPassword(auth, email, password, firstName, lastName)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
    }
};

  return (
    <div className="sign-in-container">
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
  );
};

export default SignUp;
