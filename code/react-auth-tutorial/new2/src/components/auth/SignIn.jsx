import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import './main.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    console.log("Form was submitted. ~Chase");
    if(!email.endsWith("@moreheadstate.edu")){
      console.log("Must be an MSU EMAIL!!!!!");
      alert("Must be an MSU Email to Sign In.");
    }else{
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  return (
    <div class= "sign-in-container">
        <h2>Welcome!</h2>
        <form onSubmit={signIn}>
        
            <div class = "sign-in-elements-group">
                <label for= "username"> Username: </label>
                <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type = "email" id= "email" name = "email" placeholder = "Enter email" required></input>
            </div>

       
            <div class = "sign-in-elements-group">
                <label for = "password"> Password: </label>
                <input type = "password" 
                id= "password" name = "password" placeholder = "Enter password" required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ></input>
                
            </div>
            <div class = "sign-in-elements-group">
              <a href="/forgot-password">Forgot Password?</a>
              <a href="/sign-up">Create an Account</a>
            </div>
            <button type="submit">Log In</button>
        </form>

    </div>

  );
};

export default SignIn;