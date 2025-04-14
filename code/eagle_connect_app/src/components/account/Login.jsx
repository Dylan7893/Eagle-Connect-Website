//page that handles the user logging in, user can input their email and password to go to dashboard or reset their password or create an account
import "../../design/loginStyle.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import { useNavigate } from "react-router-dom";


function Login() {
  /*Must use these useStates to track changes of these variables in functions */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login_register, setState] = useState("login");
  const navigate = useNavigate();

  const navigateClick = () => {
    navigate("/");
  };
  {
    /*Function called when a user attempts to sign in with email and password */
  }
  const signIn = (e) => {
    e.preventDefault();
    if (!email.endsWith("@moreheadstate.edu")) {
      alert("Must be an MSU Email to Sign In.");
    } else {
      {
        /**firebase function to handle sign in on their backend */
      }
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential);
        })
        .catch((error) => {
          alert("Invalid username/password. Try Again.");
          console.log(error);
        });
    }
  };

  {
    /*determine what component to display, utilizes hooks */
  }
  if (login_register === "login") {
    return (
      <div class="outside">
        <div class="sign-in-container">
          <h2>Welcome!</h2>
          <form onSubmit={signIn}>
            <div class="sign-in-elements-group">
              <label for="username" class="label">
                {" "}
                Email:{" "}
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                required
                class="input-spacing"
              ></input>
            </div>
            <div class="sign-in-elements-group">
              <label for="password" class="label">
                {" "}
                Password:{" "}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                placeholder="Enter password"
                required
                class="input-spacing"
              ></input>
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
            <div class="nav-link-group">
              <a onClick={() => setState("forgot-password")}>
                Forgot Password?
              </a>
              <a onClick={() => setState("register")}>Create an Account</a>
              <a onClick={navigateClick}>
                Back
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  } else if (login_register === "register") {
    //display register if user wants to create an account
    return (
      <>
        <Register />
      </>
    );
  } else {
    //display forgot password if user clicks the link
    return (
      <>
        <ForgotPassword />
      </>
    );
  }
}

export default Login;
