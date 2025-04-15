/*
Class Page component where a user can input their rating of the class (1 to 5 stars and a comment)
The average rating is displayed at the top along with the number of ratings
Limits one rating per user
*/
import React from "react";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  arrayUnion,
  updateDoc,
  query,
  where,
  doc,
  increment,
  getDoc,
} from "firebase/firestore";

import "../../design/Stars.css";
import { getNameAndPfp } from "../util/Util";

function RateClass({ classID, email }) {
  //form handling stuff
  const [feedBackToSend, setFeedbackToSend] = useState("");
  const [ratings, setRatings] = useState([]);
  const [name, setName] = useState("Test");
  const [imgageUrl, setImageUrl] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [canRate, setCanRate] = useState(true);
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [classData, setClassData] = useState([]);

  //post-render get class information as it may not be ready when first rendered.
  useEffect(() => {
    const getClassData = async () => {
      const classDocRef = doc(db, "availableClasses", classID.classID);
      const classSnap = await getDoc(classDocRef);
      if (classSnap.exists) {
        const thisclassData = classSnap.data();

        setClassData(thisclassData);
      } else {
        console.log("getclass data classnap no exist");
      }
    };
    getClassData();
  }, [classData]);

  //refresh the component every 100ms if a new rating has occured
  useEffect(() => {
    const intervalId = setInterval(() => {
      getNumberOfRatings();
      getAllRatings();
      getNameAndPfp(email, setName, setImageUrl);
      canUserRate();
      getAverageRating();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  //function to take all ratings from the database and calculate average
  const getAverageRating = async () => {
    let ratings = [];
    let average = 0.0;
    const classDocRef = doc(db, "availableClasses", classID.classID);
    const classSnap = await getDoc(classDocRef);
    if (classSnap.exists) {
      const thisclassData = classSnap.data();
      thisclassData.ratings.forEach((item, index) => {
        ratings.push(item.rating);
      });
      ratings.forEach((item, index) => {
        average += parseFloat(item);
      });
      average = average / ratings.length;
      setAverageRating(average);
    } else {
      console.log("getAveragerating data classnap no exist");
    }
  };

  //function to get number of ratings from the database
  const getNumberOfRatings = async () => {
    const classDocRef = doc(db, "availableClasses", classID.classID);
    const classSnap = await getDoc(classDocRef);
    if (classSnap.exists) {
      const thisclassData = classSnap.data();

      setNumberOfRatings(thisclassData.numberOfRatings);
    } else {
      console.log("getnumofratings class snap does not exist");
    }
  };
  //upon rating the comment should be cleared from the message bar
  const handleClearFeedback = () => {
    setFeedbackToSend("");
  };

  //checking to make sure user can rate (checks to see if they have already rated)
  const canUserRate = async () => {
    let ratingEmails = [];

    const classDocRef = doc(db, "availableClasses", classID.classID);
    const classSnap = await getDoc(classDocRef);
    if (classSnap.exists) {
      const thisclassData = classSnap.data();

      thisclassData.ratings.forEach((item, index) => {
        ratingEmails.push(item.email);
      });
      ratingEmails.forEach((element) => {
        if (element == email) {
          setCanRate(false);
        }
      });
    }
  };

  //function to set the ratings to the ratings from the database
  const getAllRatings = async () => {
    /*Create query to get the user object from their email*/

    const classDocRef = await doc(db, "availableClasses", classID.classID);
    const classSnap = await getDoc(classDocRef);
    if (classSnap.exists) {
      const thisclassData = classSnap.data();
      setRatings(thisclassData.ratings);
    } else {
      console.log("class snap dont exist");
    }
  };

  //upload the users inputted rating if they can rate
  async function uploadNewRating() {
    var class_id;

    getNameAndPfp(email, setName, setImageUrl);
    await canUserRate();
    const classDocRef = doc(db, "availableClasses", classID.classID);
    //update document reference appropriately
    if (canRate) {
      updateDoc(classDocRef, {
        ratings: arrayUnion({
          name: name,
          pfpurl: imgageUrl,
          feedback: feedBackToSend,
          rating: starRating,
          email: email,
        }),
      });
      updateDoc(classDocRef, {
        numberOfRatings: increment(1),
      });

      setRatings(ratings);
    } else {
      alert("You have already rated.");
    }
  }

  //validate rating
  function handleFeedBackSubmit() {
    handleClearFeedback();
    uploadNewRating();
  }

  const handleNewFeedbackChange = (e) => {
    setFeedbackToSend(e.target.value);
  };

  //client-side set the star rating
  function handleRatingChange(x) {
    setStarRating(x);
  }

  return (
    <>
      <div className="rate-info">
        <div className="rate">
          <label for="rating">Rating:</label>
          <RatedStars avg={averageRating} />
        </div>
        <div className="resource-field">
          <label for="reviews"> Reviews:</label>
          <p>{numberOfRatings}</p>
        </div>
      </div>

      <div className="rateClass-container">
        {ratings.map((each_class) => (
          <Rating
            key={each_class.id}
            name={each_class.name}
            feedback={each_class.feedback}
            pfpurl={each_class.pfpurl}
            rating={each_class.rating}
          />
        ))}
      </div>

      <div class="add-resource-elements">
        <div class="rate">
          <label for="rating" className="resource-field-label">
            Rating:
          </label>
          <Stars rateFunc={handleRatingChange} />
        </div>
        <form>
          <div className="resource-field">
            <label for="feedback" className="resource-field-label">
              Feedback:
            </label>

            <input
              type="text"
              id="url"
              value={feedBackToSend}
              onChange={handleNewFeedbackChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleFeedBackSubmit();
                }
              }}
              required
            />
          </div>
        </form>
        <button className="blue-buttons" onClick={handleFeedBackSubmit}>
          Submit
        </button>
      </div>
    </>
  );
}

//component to handle each rating formating (number of stars, name, pfp, and comment)
function Rating({ name, pfpurl, feedback, rating }) {
  const stars = "★".repeat(rating);
  return (
    <>
      <div class="resource-box">
        <img src={pfpurl} alt="Profile Image" class="profile-image" />

        <div class="resource">
          <div class="name">{name}</div>
          <div className="complete-star">
            <strong>Rating: </strong> {stars}
          </div>
          <div className="feedback-text">
            <strong>Feedback:</strong> {feedback}
          </div>
        </div>
      </div>
    </>
  );
}
export default RateClass;

//handles the star rating for the review
//Inspiration: https://codesandbox.io/p/sandbox/musing-lamarr-r3dnvx
function Stars({ rateFunc }) {
  const [rating, setRating] = useState(0);
  let stars = ["★", "★", "★", "★", "★"];
  const handleClick = (rating) => {
    setRating(rating);
    rateFunc(rating);
    localStorage.setItem("starRating", rating);
  };

  return (
    <div className="starsContainer">
      {stars.map((item, index) => {
        const isActiveColor = rating && index < rating;

        let elementColor = "";

        if (isActiveColor) {
          elementColor = "#ffcc00";
        } else {
          elementColor = "grey";
        }

        return (
          <div
            className="star"
            key={index}
            style={{
              fontSize: "25px",
              color: elementColor,
              filter: `${isActiveColor ? "grayscale(0%)" : "grayscale(100%)"}`,
            }}
            onClick={() => handleClick(index + 1)}
          >
            ★
          </div>
        );
      })}
    </div>
  );
}

//function to return the rounded up stars
function RatedStars({ avg }) {
  let starVal = Math.round(avg);
  let starz = "";
  for (let i = 0; i < starVal; i++) {
    starz += "★";
  }
  return (
    <>
      <p>{starz}</p>
    </>
  );
}
