// Import Firebase from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXyoUGEyXub2FMvAx302wJp-sOFxFoWF4",

  authDomain: "react-auth-tutorial-5ea50.firebaseapp.com",

  projectId: "react-auth-tutorial-5ea50",

  storageBucket: "react-auth-tutorial-5ea50.firebasestorage.app",

  messagingSenderId: "1027259300100",

  appId: "1:1027259300100:web:4c36b9cd164a31b6033851",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch classes from Firestore
async function getAvailableClasses() {
  const availableClassesCollection = collection(db, "availableClasses");
  const classDocs = await getDocs(availableClassesCollection);
  const classList = classDocs.docs.map((doc) => doc.data());
  return classList;
}

// Function to print the classes on the page
async function printClasses() {
  const classes = await getAvailableClasses();
  const classListElement = document.getElementById("class-list");

  classListElement.innerHTML = ""; // Clear the list before adding items

  // Create an <li> for each class and apply styles
  classes.forEach((classItem) => {
    const listItem = document.createElement("li");
    listItem.textContent = classItem.name; // Set the text content of the list item

    // Add the class 'class-list-item' to each li element
    listItem.classList.add("class-list-item");

    // Append the list item to the <ul>
    classListElement.appendChild(listItem);
  });
}

// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", () => {
  printClasses();
});
