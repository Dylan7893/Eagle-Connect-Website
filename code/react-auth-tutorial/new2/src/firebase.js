// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

//https://react-auth-tutorial-5ea50.firebaseapp.com/__/auth/handler


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyCXyoUGEyXub2FMvAx302wJp-sOFxFoWF4",

  authDomain: "react-auth-tutorial-5ea50.firebaseapp.com",

  projectId: "react-auth-tutorial-5ea50",

  storageBucket: "react-auth-tutorial-5ea50.firebasestorage.app",

  messagingSenderId: "1027259300100",

  appId: "1:1027259300100:web:4c36b9cd164a31b6033851"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);