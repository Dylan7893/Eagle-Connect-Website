import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react"; //useState for popup
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
  const closeModal = () => setOpen(!open);

  {
    /*Used for changing the componenet to the class template page*/
  }
  const [classClicked, setClassClicked] = useState("none");
  const [isProfilePage, setProfilePage] = useState(false);
  function handleClassChange(x) {
    setClassClicked(x);
  }

  function toProfilePage(){
    setProfilePage(true);
  }

 
  /*function called when user attempts to sign out */

  

  if(isProfilePage == true){
    return(
      <>
      <ProfilePage email={email}/>
      </>
    )
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
            <button className="profile-button" onClick = {toProfilePage}>
              {/* default image asset */}
              <img
                className="profile-picture"
                src={defaultImage}
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
          <button className="add-new-class" onClick={closeModal}>
            Create Class
          </button>

          {/* sidebar discover all classes */}
          <h3>Discover</h3>
          <form action="">
            {/* action should be defined later for searching list of classes*/}
            <input type="search" placeholder="Search All" />
          </form>
          <Classes />
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
        <ClassPage className={classClicked} email = {email} />
      </>
    );
  }
}

export default Dashboard;
