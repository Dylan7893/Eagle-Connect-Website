// CreateClass.jsx (Modified version of MyPopup.jsx)
//documentation: https://react-popup.elazizi.com/react-modal
import React, { useState } from "react";
import Popup from "reactjs-popup";
import "../design/dashboard2Style.css";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  arrayUnion,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const MyPopup = ({ isOpen, closePopup, setOpen }) => {
  // popup menu
  const [classInitials, setClassInitials] = useState(""); // this is for class abbrev. like CS, MATH, EEC
  const [classNumber, setClassNumber] = useState(""); // this is for class number like 170, 308, 355
  const [classExtension, setClassExtension] = useState(""); // this is for class extension like L, C, D
  const [classSection, setClassSection] = useState(""); // this is for class section like 001, 002, 700
  const [classLevelUp, setClassLevelUp] = useState(""); // this is for class level up like UR
  const [className, setClassName] = useState(""); // this is for the class name like Intro to Computer Science
  const [numberOfStudents] = useState(1); // this is for the number of students within a class
  // initialized to 1 because when student creates a class, they will have joined the class
  const [classDescription, setClassDescription] = useState("");
  const [numberOfRatings] = useState(0);
  const [messages] = useState([]); //so we can send chat messages ~Chase
  const [resources] = useState([]); //so we can send resources ~ Chase
  const [ratings] = useState([]); //so we can send ratings
  const [notes] = useState([]); //so we can send notes ~ Landon
  const [reminders] = useState([]); //so we can send reminders

  // Function to handle adding the class to the avaiableClasses collection
  async function handleCreate() {
    const user = auth.currentUser; // gets current user from firebase auth

    const userId = user.uid; // gets the current user unique id

    const userDocRef = doc(db, "users", userId); // reference to current user

    // try this
    try {
      // query to search through the fields of available classes, searches to match by initials, number, extension, section, levelUp
      const classQuery = query(
        collection(db, "availableClasses"),
        where("classInitials", "==", classInitials.toUpperCase()),
        where("classNumber", "==", classNumber),
        where("classExtension", "==", classExtension),
        where("classSection", "==", classSection),
        where("classLevelUp", "==", classLevelUp)
      );

      // after the query searches through the avaiable classes
      const snapshot = await getDocs(classQuery);
      if (!snapshot.empty) {
        // if the fields match
        alert("This class has already been created."); // alearts user that the class already has been created
        setOpen(false); // closes the popup
        return; // returns and doesn't continue with rest of this code
      }

      // this will add the created class that user creates into the avaiableClasses collection
      const createClassRef = await addDoc(collection(db, "availableClasses"), {
        classInitials: classInitials.toUpperCase(), // created class abbrev. CS, MATH, EEC
        classNumber: classNumber, // created class number 170, 308, 355
        classExtension: classExtension, // created class extension L, C, D
        classSection: classSection, // created class section 001, 002, 700
        classLevelUp: classLevelUp, // created class levelUp UR
        className: className.toUpperCase(), // created class name Intro to Computer Science
        createdBy: userId, // created by current user
        numberOfStudents: numberOfStudents, // created field to hold num of students
        createdAt: new Date(), // created at certain date and time
        resources: resources, // created to hold resources
        messages: messages, // created to hold messages
        ratings: ratings, // created to hold ratings
        numberOfRatings: numberOfRatings, // created to hold number of ratings
        notes: notes, // created to hold notes
        reminders: reminders, // created to hold reminders
        description: classDescription, // created to hold class description
      });

      // this will update the joined classes for the user immediately after the user creates the class
      await updateDoc(userDocRef, {
        joinedClasses: arrayUnion({
          classID: createClassRef.id, // joined created class id
        }),
      });

      console.log("Class successfully created!"); // console log if successful
      setOpen(false);
    } catch (error) {
      // if any errors
      console.error("Error creating class:", error); // console log if error
      alert("Failed to create the class. Please try again."); // alert user if error
    }
  }
  // not sure how to comment in return function
  // only changes that I have done is the onChange=...
  // I also had to change the value on the select in order to successfully save in firebase - Landon
  // other than that, this is the same as what Dylan implemented

  return (
    <Popup open={isOpen} closeOnDocumentClick={false}>
      <h2>Create A Class</h2>
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault(); // this disables the automatic reload of the page
          if (
            classInitials === "" || // if any field is empty other than extension or levelUP then ...
            classNumber === "" ||
            classSection === "" ||
            className === "" ||
            classDescription === ""
          ) {
            return; // this will prevent from creating a class with empty required fields
          }
          handleCreate(); // this will only execute if input is valid, that's why I moved it up here - Landon
          setClassInitials(""); // resets class initials so it doesn't keep its previous value
          setClassNumber(""); // resets class number so it doesn't keep its previous value
          setClassExtension(""); // resets class extension so it doesn't keep its previous value
          setClassSection(""); // resets class section so it doesn't keep its previous value
          setClassLevelUp(""); // resets class levelUp so it doesn't keep its previous value
          setClassName(""); // resets class name so it doesn't keep its previous value
          setClassDescription(""); // resets class description so it doesn't keep its previous value
          // for some reason it will hold the value of previous class created by user so this should solve that problem - Landon
        }}
      >
        <label htmlFor="className">Class Number: </label>

        <div className="className">
          {/*This is for the class initials input field*/}
          {/*Value is required as this will eliminate the ability to enter anything except for letters for initials*/}
          {/*limits characters between 2-4*/}
          {/*the .replace will search through the string and replace any characters that not a letter with empty string (updates in reali time)*/}
          <input
            type="text"
            id="className"
            className="input-small"
            placeholder="CS"
            value={classInitials}
            minLength="2"
            maxLength="4"
            onChange={(e) =>
              setClassInitials(e.target.value.replace(/[^A-Za-z]/g, ""))
            }
            required
          />
          <label htmlFor="className3" className="dash">
            -
          </label>
          {/*This input field is for the class number input field*/}
          {/*limits numbers between 0-999*/}
          <input
            type="number"
            id="className"
            className="classNameIn"
            min="0"
            max="999"
            placeholder="170"
            onChange={(e) => setClassNumber(e.target.value)}
            required
          />
          {/*This input field is for the class extension (lab, capstone C/D) input field*/}
          {/*drop down menu*/}
          <select onChange={(e) => setClassExtension(e.target.value)}>
            <option value=""></option>
            <option value="L">L</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>

          <label htmlFor="className3" class="dash">
            -
          </label>
          {/*This input field is for the class section input field*/}
          {/*limits numbers between 0-999*/}
          <input
            type="number"
            id="className"
            onChange={(e) => setClassSection(e.target.value)}
            className="classNameIn"
            min="0"
            max="999"
            placeholder="001"
            required
          />
          {/*This input field is for the class levelUP (UR) input field*/}
          {/*drop down menu*/}
          <select onChange={(e) => setClassLevelUp(e.target.value)}>
            <option value=""></option>
            <option value="UR">UR</option>
          </select>
        </div>

        <label htmlFor="classNumber">Class Name: </label>
        {/*This input field is for the class name input field*/}
        <input
          type="text"
          id="classNumber"
          className="input-with-padding"
          placeholder="Introduction to Computer Science"
          onChange={(e) => setClassName(e.target.value)}
          required
        />

        <label htmlFor="classNumber">Class Description: </label>
        {/*This input field is for the class description input field*/}
        <input
          type="text"
          id="classNumber"
          className="input-with-padding"
          placeholder="An overview of modern computer science."
          onChange={(e) => setClassDescription(e.target.value)}
          required
        />

        {/*This the add class button. This only registers the "submit" type if all input is valid*/}
        {/*Since the field is type onSubmit, the handleCreate() function earlier takes care of class creation if input is valid*/}
        <button type="submit" class="add-button">
          Add
        </button>

        <button
          type="button"
          className="close-button"
          onClick={() => {
            setOpen(false);
            setClassInitials("");
            setClassDescription("");
            setClassName("");
            setClassLevelUp("");
            setClassNumber("");
            setClassSection("");
            setClassExtension("");
          }}
        >
          Close
        </button>
      </form>
    </Popup>
  );
};

export default MyPopup;
