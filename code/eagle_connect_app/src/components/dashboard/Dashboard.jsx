import { getAuth, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react"; //useState for popup
import MyPopup from "../MyPopup";
import { auth } from "../../firebase";
import "../../design/dashboard2Style.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import Classes from "./Classes";
import { db } from "../../firebase";
import JoinedClasses from "./JoinedClasses";
import CreateClass from "./CreateClass";
import defaultImage from "../../design/default_pfp.jpg";
import ClassPage from "../class/ClassPage";
import ProfilePage from "../profile/ProfilePage";

{
  /*Dashboard only takes 1 argument, that is the prop "email" because from the users email we use that to get all other information from the database */
}
function Dashboard({ email }) {
  
  //control visibility
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  //for search all functionality
  const [searchInput, setSearchInput] = useState(""); //string state variable and function to set it
  const [classInfo, setClassInfo] = useState([]); //list state variable and function to set it

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
          id: document.id, //include the document id
          ...document.data(), //and then set all other documents to there field name
        }));

        setClassInfo(retrievedClasses);
      } catch (error) {
        console.error("There was an error searching class:", error);
      }
    };

    //call back to the get classes function whenever the search input changes
    getClasses();
  }, [searchInput]); //search input triggers the call back function getClasses()

  {
    /*Used for changing the componenet to the class template page*/
  }
  const [classClicked, setClassClicked] = useState("none");
  const [isProfilePage, setProfilePage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      getImageUrl();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

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

  function handleClassChange(x) {
    setClassClicked(x);
  }

  function toProfilePage() {
    setProfilePage(true);
  }

  if (isProfilePage == true) {
    return (
      <>
        <ProfilePage email={email} toDashFunction={setProfilePage} />
      </>
    );
  }
  if (classClicked == "none") {
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
                    <h3>{classListItem.className}</h3>
                    <p>
                      {" "}
                      {classListItem.classInitials}-{classListItem.classNumber}
                      {classListItem.classExtension}-
                      {classListItem.classSection}
                      {classListItem.classLevelUp}{" "}
                    </p>
                    <p> Students: {classListItem.numberOfStudents} </p>
                    <button onClick={() => {}}>Join</button>
                  </li>
                )
              )
            ) : (
              //else...
              <Classes email={email} /> //show all classes
            )}
          </ul>

          {/* end side bar*/}
        </aside>
        {/* main section */}
        <main className="main-section">
          <section className="joined-classes">
            <h2>Joined Classes</h2>
            <div className="joined-classes-layout">
              <JoinedClasses
                toDashboardCallBack={handleClassChange}
                email={email}
              />

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
    return (
      <>
        <ClassPage className={classClicked} email={email} />
      </>
    );
  }
}

export default Dashboard;
