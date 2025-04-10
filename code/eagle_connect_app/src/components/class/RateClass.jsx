import React from "react";
import { auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import "../../design/Stars.css";
import {
  collection,
  getDocs,
  arrayUnion,
  updateDoc,
  query,
  where,
  doc,
  increment,
} from "firebase/firestore";

/*Component where you can send chat messages */
function RateClass({ className, email }) {
  //form handling stuff
  const [feedBackToSend, setFeedbackToSend] = useState("");
  const [ratings, setRatings] = useState([]);
  const [name, setName] = useState("Test");
  const [imgageUrl, setImageUrl] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [canRate, setCanRate] = useState(true);
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  //refresh the messages every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      getNumberOfRatings();
      getAllRatings();
      getNameAndPfp();
      canUserRate();
      getAverageRating();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  function getAverageRating() {
    let ratings = [];
    let average = 0.0;
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
        class_from_responses.at(0).data.ratings.forEach((item, index) => {
          ratings.push(item.rating);
        });
        ratings.forEach((item, index) => {
          average += parseFloat(item);
        });
        average = average / ratings.length;
        setAverageRating(average);
        console.log(average);
      })
      .catch((error) => console.log(error));
  }
  function getNumberOfRatings() {
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
        setNumberOfRatings(class_from_responses.at(0).data.numberOfRatings);
      })
      .catch((error) => console.log(error));
  }
  const handleClearFeedback = () => {
    setFeedbackToSend("");
  };

  function canUserRate() {
    let ratingEmails = [];
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
        class_from_responses.at(0).data.ratings.forEach((item, index) => {
          ratingEmails.push(item.email);
        });
        ratingEmails.forEach((element) => {
          if (element == email) {
            setCanRate(false);
          }
        });
      })
      .catch((error) => console.log(error));
  }
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

  async function getAllRatings() {
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
        setRatings(class_from_responses.at(0).data.ratings);
      })
      .catch((error) => console.log(error));
  }

  async function uploadNewRating() {
    var class_id;

    getNameAndPfp();
    await canUserRate();
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
    });
  }

  //validate rating
  function handleFeedBackSubmit() {
    handleClearFeedback();
    uploadNewRating();
  }

  const handleNewFeedbackChange = (e) => {
    setFeedbackToSend(e.target.value);
  };

  function handleRatingChange(x) {
    setStarRating(x);
  }
  function test() {
    alert(starRating);
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

      <div className="messages-container">
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
              required
            />
          </div>
        </form>
        <button onClick={handleFeedBackSubmit}>Submit</button>
      </div>
    </>
  );
}

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

//I DID NOT DO THIS: https://codesandbox.io/p/sandbox/musing-lamarr-r3dnvx
function Stars({ rateFunc }) {
  const [rating, setRating] = useState(0);
  let stars = ["★", "★", "★", "★", "★"];
  const handleClick = (rating) => {
    setRating(rating);
    rateFunc(rating);
    localStorage.setItem("starRating", rating);
    console.log(rating);
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
