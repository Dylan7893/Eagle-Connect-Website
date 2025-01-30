// I'm currently working on this file

import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";

// function to send forgot password link to email
function ForgotPassword() 
{
    const handleSubmit = async(e) => {
        e.preventDefault()
        const emailVal = e.target.email.value;
        sendPasswordResetEmail(auth, emailVal).then(auth=>{
            alert("Check your email!")
        }).catch(err=>{
            alert(err.code)
        })
    }
    // once user clicks reset button, they are redirected to login page
    return(
        <div className="App">
            <h1>Password Reset</h1>
            <form>
                <input name="email" /><br /><br />
                <a href="/login">Reset</a>
            </form>
        </div>
    )
}
export default ForgotPassword;