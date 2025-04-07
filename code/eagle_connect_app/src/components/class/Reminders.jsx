import React from "react";
import { auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  arrayUnion,
  updateDoc,
  query,
  where,
  doc,
} from "firebase/firestore";

/*Component where you can send chat messages */
function Reminders({ className, email }) {
  //form handling stuff
  const [reminder_to_send, setReminderToSend] = useState("");
  const [reminders, setReminders] = useState([]);
  const [name, setName] = useState("Test");
  const [date, setDate] = useState(new Date());
  const [imgageUrl, setImageUrl] = useState("");
  const [formattedDate, setFormattedDate] = useState("");



  //refresh the messages every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllReminders();
      getNameAndPfp();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const handleClearReminder = () => {
    setReminderToSend("");
  };

  async function getNameAndPfp() {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
    
        /*Use query to get user object (contains first name, last name, etc.) */
    
        getDocs(userQuery)
          .then((response) => {
            const users_from_response = response.docs.map((doc) => ({
              data: doc.data(),
              id: doc.id,
            }));
            {
              /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
            }
            var toSend;
            toSend = users_from_response.at(0).data.firstName;
            toSend += " ";
            toSend += users_from_response.at(0).data.lastName;
            setName(toSend);
            setImageUrl(users_from_response.at(0).data.pfpUrl);
          })
          .catch((error) => console.log(error));
      }

  async function getAllReminders() {
    /*Create query to get the user object from their email*/

    const classQuery = query(
      collection(db, "availableClasses"),
      where("className", "==", className)
    );

    /*Use query to get user object (contains first name, last name, etc.) */

    getDocs(classQuery)
      .then((response) => {
        const class_from_responses = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setReminders(class_from_responses.at(0).data.reminders);
      })
      .catch((error) => console.log(error));
  }

  async function uploadNewReminder() {
      var class_id;
  
      getNameAndPfp();

      const formatted = new Date(date);

      setFormattedDate(formatted.toDateString());

      console.log(formattedDate);

      const classQuery = query(
        collection(db, "availableClasses"),
        where("className", "==", className)
      );
  
      /*Use query to get user object (contains first name, last name, etc.) */
  
      getDocs(classQuery).then((response) => {
        const class_from_response = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        {
          /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
        }
        class_id = class_from_response.at(0).id;
        const classDocRef = doc(db, "availableClasses", class_id);
        
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
        
        
      });
      
    }

  //validate message
  function handleReminderSubmit() {
    handleClearReminder();
    uploadNewReminder();
  }

  const handleNewReminderChange = (e) => {
    setReminderToSend(e.target.value);
  };

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
            date = {each_class.date}
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

function Reminder({name, pfpurl, text, date}){



  return(
    <>
      <div className="resource-box-no-line">
        <img
          src={pfpurl}
          alt="Profile Image"
          className="profile-image"
        />

        <div className="resource">
          <div className="name">{name}</div>
          <div className="message">{text}</div>
          <div className="date">{date}</div>
        </div>
      </div>
    </>
  )
}
export default Reminders;
