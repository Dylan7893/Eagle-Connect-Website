

import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";
import "../../design/dashboard2Style.css";
import {collection, getDocs, query,where} from "firebase/firestore";
import Classes from "./Classes";
import {db} from "../../firebase";

{/*Dashboard only takes 1 argument, that is the prop "email" because from the users email we use that to get all other information from the database */}
function Dashboard(props){

  {/*test function that shows that we can get all of a users data just from their email!*/}
  async function testDB(){
   
    console.log(props.email);

    {/*Create query to get the user object from their email*/}
    const userQuery = query(
      collection(db, "users"),
      where('email', '==', props.email)
    );

    {/*Use query to get user object (contains first name, last name, etc.) */}
    getDocs(userQuery).then( response => {
                const users_from_response = response.docs.map(doc => ({
                    data: doc.data(),
                    id: doc.id,
                }))
                {/*We only want the first element. if the element size is greater than 1 then there is a big problem.*/}
                alert("First Name: " + users_from_response.at(0).data.firstName);
            }).catch(error => console.log(error));

  }
    {/*function called when user attempts to sign out */}
    const userSignOut = () => {
        signOut(auth)
          .then(() => {
            console.log("sign out successful");
          })
          .catch((error) => console.log(error));
      };
    
    return(
        <>
  {/* navigation header */}
  <header className="navigation-bar">
    <input type="text" className="search-bar" placeholder="Search Joined" />
    {/* right navigation buttons */}
    <div className="navigation-bar-right">
      <button className="settings">⚙️</button>
      {/* profile image serving as a button for profile */}
      <button className="profile-button">
        {/* default image asset */}
        <img
          className="profile-picture"
          src="default_pfp.jpg"
          alt="profile picture"
        />
      </button>
    </div>
  </header>
  {/* sidebar start */}
  <aside className="sidebar">
    {/* sidebar join class with code */}
    <h2>Join Class</h2>
    <input type="text" placeholder="Class Code" />
    <button className="add-new-class">+</button>
    {/* sidebar discover all classes */}
    <h3>Discover</h3>
    <form action="">
      {/* action should be defined later for searching list of classes*/}
      <input type="search" placeholder="Search All" />
    </form>
    <Classes/>
    {/* end side bar*/}
  </aside>
  {/* main section */}
  <main className="main-section">
    <section className="joined-classes">
      <h2>Joined Classes</h2>
      <div className="joined-classes-layout">
        <div className="joined-class-card">
          {/* example class */}
          <h3>CS-380</h3>⭐ ⭐ ⭐ ⭐ ⭐
          <div className="joined-class-actions">
            <button className="action-button">⭐</button>
            <button className="action-button">⚙️</button>
            <button className="action-button">...</button>
            {/* end joined class actions */}
          </div>
          {/* end joined class card */}
        </div>
        <div className="joined-class-card">
          <h3>CS-360</h3>⭐ ⭐ ⭐
          <div className="joined-class-actions">
            <button className="action-button">⭐</button>
            <button className="action-button">⚙️</button>
            <button className="action-button">...</button>
            {/* end joined class actions */}
          </div>
          {/* end joined class card */}
        </div>
        <div className="joined-class-card">
          <h3>EEC-355</h3>⭐ ⭐ ⭐ ⭐
          <div className="joined-class-actions">
            <button className="action-button">⭐</button>
            <button className="action-button">⚙️</button>
            <button className="action-button">...</button>
            {/* end joined class actions */}
          </div>
          {/* end joined class card */}
        </div>
        {/* end main layout */}
      </div>
      {/* end main section */}
    </section>
    {/* end main */}
  </main>
  {/* end body */}
        <button onClick={userSignOut}>Log out</button>
        <button onClick={testDB}>test</button>
        </>
    )
}

export default Dashboard;