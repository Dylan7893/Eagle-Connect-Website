/*Component that handles user registration*/
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "../../design/loginStyle.css";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import Login from "./Login";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const pfpUrl = "https://firebasestorage.googleapis.com/v0/b/react-auth-tutorial-5ea50.firebasestorage.app/o/images%2Fdefault%40moreheadstate.edu?alt=media&token=6aa5688c-5b20-4eda-a905-b6a0343fcfad";
  const navigate = useNavigate();
  const [signUp_register, setState] = useState("register");

  
  
    //Upon successful registration, add that user's credential to the database
  
  function databaseAddUser(userCredential) {
    // following three lines will make the firebase auth uid and firestore user uid the same
    // so that collections and documents won't have any issues
    const user = userCredential.user; // firebase auth user object
    const userId = user.uid; // firebase authentication UID
    const usersCollectRef = doc(db, "users", userId);
    setDoc(usersCollectRef, {
      firstName,
      lastName,
      email,
      pfpUrl,
      joinedClasses: [],
    }).then((response) => {
      console.log(response);
    });
  }

  //handle the user signing up
  const signUp = (e) => {
    e.preventDefault();

    if (!email.endsWith("@moreheadstate.edu")) {
      alert("Must be an MSU Email to Sign Up.");
    } else {
      if (password == confirmPassword) {  // if passwords match, creates the account successfully
        createUserWithEmailAndPassword(auth, email, password, firstName, lastName)
          .then((userCredential) => {
            console.log(userCredential);
            {
              /*Add users info the database*/
            }
            databaseAddUser(userCredential);
            navigate("/app"); // nagivate to dashboard
          })
          .catch((error) => { // if there's any error (user already has an account)
            console.log(error);
            alert("User already exists. Please sign in."); // alerts user that they already have an account
            setState("login"); // navigates them back to login screen
          });
      }
      else {
        alert("Password doesn't match!"); // if passwords don't match, alert user
      }
    }
  };
  if (signUp_register === "register") {
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
            class="input-spacing"
          ></input>
          <input
            type="password"
            placeholder="Enter your password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            class="input-spacing"
          ></input>
           <input
            type="password"
            placeholder="Confirm your password"
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            class="input-spacing"
          ></input>
          <input
            type="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            class="input-spacing"
          ></input>
          <input
            type="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            class="input-spacing"
          ></input>
          <button type="submit" class="login-button">
            Sign Up
          </button>
          <a onClick={() => setState("login")}>Back</a>
        </form>
      </div>
    </div>
  );
} else {
  return (
    <>
      <Login />
    </>
  );
}
}

export default Register;
