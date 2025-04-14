/*
Class Page Component where users can leave reminders for other students for quizzes, exams, due dates, etc.
Reminders consist of Name, Profile Picture, reminder message, and reminder date
*/
import React from "react";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { arrayUnion, updateDoc, doc, getDoc } from "firebase/firestore";
import { getNameAndPfp } from "../util/Util";
//component that handles displaying all reminders and sending reminders
function Reminders({ classID, email }) {
  //form handling stuff
  const [reminder_to_send, setReminderToSend] = useState("");
  const [reminders, setReminders] = useState([]);
  const [name, setName] = useState("Test");
  const [date, setDate] = useState(new Date());
  const [imgageUrl, setImageUrl] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  //refresh the reminders every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllReminders();
      getNameAndPfp(email, setName, setImageUrl);
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  //clear reminder form input upon entering a reminder
  const handleClearReminder = () => {
    setReminderToSend("");
  };

  //function to get all reminders frm the database
  async function getAllReminders() {
    const classDocRef = doc(db, "availableClasses", classID.classID);
    const classSnap = await getDoc(classDocRef);
    const thisclassData = classSnap.data();

    setReminders(thisclassData.reminders);
  }

  //function to upload a new reminder upon submitting one
  async function uploadNewReminder() {
    getNameAndPfp(email, setName, setImageUrl);

    const formatted = new Date(date);

    setFormattedDate(formatted.toDateString());

    console.log(formattedDate);

    const classDocRef = doc(db, "availableClasses", classID.classID);

    updateDoc(classDocRef, {
      reminders: arrayUnion({
        name: name,
        pfpurl: imgageUrl,
        text: reminder_to_send,
        date: formattedDate,
      }),
    });
    console.log("PFP URL: ");
    console.log(imgageUrl);
  }

  //validate message
  function handleReminderSubmit() {
    handleClearReminder();
    uploadNewReminder();
  }

  //set reminder message to send to whatever the user inputs
  const handleNewReminderChange = (e) => {
    setReminderToSend(e.target.value);
  };

  //currently buggy, needs fixing ~Chase
  const handleNewDateChange = (e) => {
    setDate(e.target.value);
  };

  return (
    <>
      <div className="messages-container">
        {reminders.map((each_class) => (
          <Reminder
            key={each_class.id}
            name={each_class.name}
            text={each_class.text}
            date={each_class.date}
            pfpurl={each_class.pfpurl}
          />
        ))}
      </div>

      <div class="bar">
        <div class="message-field">
          <form>
            <input
              type="text"
              id="message"
              value={reminder_to_send}
              onChange={handleNewReminderChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleReminderSubmit();
                }
              }}
              placeholder="Enter Reminder"
              required
            />
            <label>Date</label>
            <input
              type="datetime-local"
              id="date-and-time"
              onChange={handleNewDateChange}
              required
            />
          </form>
          <button onClick={handleReminderSubmit}>Send</button>
        </div>
      </div>
    </>
  );
}

//component to handle reminder formatting
function Reminder({ name, pfpurl, text, date }) {
  return (
    <>
      <div className="resource-box-no-line">
        <img src={pfpurl} alt="Profile Image" className="profile-image" />

        <div className="resource">
          <div className="name">{name}</div>
          <div className="message">{text}</div>
          <div className="date">{date}</div>
        </div>
      </div>
    </>
  );
}
export default Reminders;
