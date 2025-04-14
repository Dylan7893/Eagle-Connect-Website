/*
Dashboard page that is rendered when a user signs in
From this page user can create a class, see all available classes, search for specific classes
Users can also click a joined class to go to that class page
Users should be able to search through joined classes (NOT YET IMPLEMENTED)
*/

import React, { useState, useEffect } from "react"; //useState for popup
import MyPopup from "../MyPopup";
import { auth } from "../../firebase";
import "../../design/dashboard2Style.css";
import { db } from "../../firebase";
import ClassPage from "../class/ClassPage";
import ProfilePage from "../profile/ProfilePage";
import JoinedClass from "./JoinedClass";
import Class from "./Class";
import {
  collection,
  getDocs,
  doc,
  arrayUnion,
  updateDoc,
  increment,
  where,
  query,
} from "firebase/firestore";



//Dashboard only takes 1 argument, that is the prop "email" because from the users email we use that to get all other information from the database
function Dashboard({ email }) {
  //control visibility
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  //for search all functionality
  const [searchInput, setSearchInput] = useState(""); //string state variable and function to set it
  const [classInfo, setClassInfo] = useState([]); //list state variable and function to set it
  const [classClickedID, setClassClickedID] = useState("none");
  const [isProfilePage, setProfilePage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [classes, setClasses] = useState([]);
  const [userJoinedClasses, setUserJoinedClasses] = useState([]);


  //gets the users joined classes
  useEffect(() => {
    //function to retreive searched classes
    const getUserJoinedClasses = async () => {
      {
        /*Create query to get the user object from their email*/
      }
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
          setUserJoinedClasses(users_from_response.at(0).data.joinedClasses);
        })
        .catch((error) => console.log(error));
    }

    //call back to the get classes function whenever the search input changes
    getUserJoinedClasses();
  }, [userJoinedClasses]);

  //gets all classes and image url, refresh every 100 ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      getClasses();
      getImageUrl();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  //functionality for searching all available classes
  useEffect(() => {
    //function to retreive searched classes
    const getClasses = async () => {
      if (searchInput.trim() === "") {
        //check if the search bar is empty
        setClassInfo([]); //empty class list
        return;
      }

      //attempt to search database
      try {
        const formattedSearchInput = searchInput.trim().toUpperCase(); //remove leading and trailing space and use uppercase

        const searchOutput = await getDocs(
          query(
            //search
            collection(db, "availableClasses"), //firebase collection
            where("className", ">=", formattedSearchInput) //firebase className field
          )
        );

        //iterate over array of retreived classes and map documents
        const retrievedClasses = searchOutput.docs.map((document) => ({
          data: document.data(),
          id: document.id,
        }));

        setClassInfo(retrievedClasses);
      } catch (error) {
        console.error("There was an error searching class:", error);
      }
    };

    //call back to the get classes function whenever the search input changes
    getClasses();
  }, [searchInput]); //search input triggers the call back function getClasses()

  async function handleAttemptJoinClass(classToJoin) {
    const user = auth.currentUser; // Gets the current user from firebase authentication

    const userId = user.uid; // Gets firebase authentication uid

    // Gets the user document reference from firestore with auth uid
    const userDocRef = doc(db, "users", userId);
    var shouldJoinClass = true;
    // Gets the class document reference from firestore with class id
    const classDocRef = doc(db, "availableClasses", classToJoin.id);
    userJoinedClasses.forEach((item, index) => {
      if (item.classID == classToJoin.id) {
        alert("Already joined this class.");
        shouldJoinClass = false;
        return;
      }

    });


    // adds the class to the joinedClasses array
    // users can now successfully join a class from avaiable class sidebar
    console.log("we are inside join class. this is userJoined classes: " + userJoinedClasses);
    if (shouldJoinClass) {
      try {
        await updateDoc(userDocRef, {
          joinedClasses: arrayUnion({
            classID: classToJoin.id,
          }),
        });


        // each time a class is joined, the number of students will increment by one each time
        await updateDoc(classDocRef, {
          numberOfStudents: increment(1),
        });

        console.log("Class successfully joined!");
      } catch (error) {
        console.log("Error joining class:", error);
        alert("Failed to join the class. Please try again.");
      }
    }

  }

  // Function to handle getting the availableClasses collection
  function getClasses() {
    // db is from the firebase.js file, exported constant so it can be used in different components
    const classesRef = collection(db, "availableClasses");

    // Query handling function I believe
    getDocs(classesRef)
      .then((response) => {
        const classes_from_response = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setClasses(classes_from_response);
      })
      .catch((error) => console.log(error));
  }

  //gets the URL for the users profile picture
  function getImageUrl() {
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    getDocs(userQuery)
      .then((response) => {
        const users_from_response = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        {
          /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
        }

        setImageUrl(users_from_response.at(0).data.pfpUrl);
      })
      .catch((error) => console.log(error));
  }

  //whenever a use clicks a joined class go to that classes page
  function handleClassChange(x) {
    setClassClickedID(x);
  }

  //function to take user to profile page to edit their profile
  function toProfilePage() {
    setProfilePage(true);
  }

  //return profile page if user clicks on it
  if (isProfilePage == true) {
    return (
      <>
        <ProfilePage email={email} toDashFunction={setProfilePage} />
      </>
    );
  }

  //return dashboard if no class clicked
  if (classClickedID == "none") {
    return (
      <>
        {/* navigation header */}
        <header className="navigation-bar">
          <input
            type="text"
            className="search-bar"
            placeholder="Search Joined"
          />
          {/* right navigation buttons */}
          <div className="navigation-bar-right">
            {/* profile image serving as a button for profile */}
            <button className="profile-button" onClick={toProfilePage}>
              {/* default image asset */}
              <img
                className="profile-picture"
                src={imageUrl}
                alt="profile picture"
              />
            </button>
          </div>
        </header>
        {/* sidebar start */}
        <aside className="sidebar">
          {/* sidebar join class with code */}
          <h2>Join Class</h2>

          {/* when click add new class button a popup appears */}
          <button className="add-new-class" onClick={openModal}>
            Create Class
          </button>

          {/* sidebar discover all classes */}
          <h3>Discover</h3>
          <form action="">
            {/* action should be defined later for searching list of classes*/}

            {/* search all classes input*/}
            <input
              type="text" //text input
              value={searchInput} //bind input field to variable
              onChange={(inputEvent) => setSearchInput(inputEvent.target.value)} //event handler setting textfield input to var
              placeholder="Search All"
            />
          </form>

          {/* search all classes output*/}

          <ul className="list-of-classes">
            {" "}
            {/* styling for the class list as a whole*/}
            {classInfo.length > 0 ? ( //if search bar is not empty empty ...
              //iterates over the array of classes
              classInfo.map(
                (
                  classListItem //for every classListItem a list elemnt is created
                ) => (
                  <li className="class-list-item">
                    <Class classDataStuff={classListItem} joinClassCallback={handleAttemptJoinClass} userJoinedClasses={userJoinedClasses} />
                  </li>
                )
              )
            ) : (//if not searching for any class in particular, then just return all classes.
              <>
                {classes.map((each_class) => (
                  <li className="class-list-item">
                    <Class classDataStuff={each_class} joinClassCallback={handleAttemptJoinClass} userJoinedClasses={userJoinedClasses} />
                  </li>
                ))}

              </>
            )}
          </ul>

          {/* end side bar*/}
        </aside>
        {/* main section */}
        <main className="main-section">
          <section className="joined-classes">
            <h2>Joined Classes</h2>
            <div className="joined-classes-layout">
              {userJoinedClasses.map((each_class) => (
                <JoinedClass
                  classID={each_class}
                  toParentCallBack={handleClassChange}
                />
              ))}

              {/* end main layout */}
            </div>
            {/* end main section */}
          </section>
          {/* end main */}
        </main>
        {/*add class popup */}
        <MyPopup isOpen={open} closePopup={closeModal} />
        {/* Log out button */}

        {/* end body */}
      </>
    );
  } else {
    //return certain class page if it is clicked
    return (
      <>
        <ClassPage classID={classClickedID} email={email} />
      </>
    );
  }
}


export default Dashboard;