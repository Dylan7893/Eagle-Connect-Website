//Component that handles when a user forgets their password and has to reset it

import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import Login from "./Login";

// this file is for resetting the password
const ForgotPassword = () => {
    // declaring email and setEmail variable with empty string
    const [email, setEmail] = useState("");
    const [resetPassword_register, setState] = useState("reset");

    // this must be used in order to redirect user
    const navigate = useNavigate();

    // on submission of reset button do the following
    const handleSubmit = async (e) => {
        e.preventDefault() // prevents empty field submissioin
        console.log("email is now reset~Landon", email); // adds to console log
        if (!email.endsWith("@moreheadstate.edu")) {
            console.log("Must be an MSU EMAIL!!!!!");
            alert("Must be an MSU Email to Sign In.");
        }
        // I would like to add another if statement to check if user has an existing account
        // if so, proceed to reset, if not, alert user, then redirect to sign up page ~Landon
        else {
            sendPasswordResetEmail(auth, email).then(auth => { // sends reset email
                alert("Check your email to reset your password!"); // alerts the user that password is reset
                navigate("/app"); // redirects user to login page
            }).catch((error) => { // catch any errors if any
                console.log(error);
            });
        }
    }
    // user will input their email, click submit, then follow the link instructions in email
    if (resetPassword_register === "reset") {
    return (
        <div className="outside">
            <div className="sign-in-container">
                <form onSubmit={handleSubmit}>
                    <h1>Password Reset Page</h1>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <button type="submit">Reset</button>
                    <a onClick={() => setState("login")}>Back</a>
                </form>
            </div>
        </div>

    )
} else {
    return (
      <>
        <Login />
      </>
    );
  }
}
export default ForgotPassword;