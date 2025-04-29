/*
Profile page for user to change their name, password, and profile picture
*/

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth } from "../../firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { storage, db } from "../../firebase"; // Adjust the import path
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import profilePageStyle from "../../design/profilePageStyles.css";

function ProfilePage({ email, toDashFunction }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentImageURL, setCurrentImageURL] = useState("");
  const [image, setImage] = useState(null);
  const [newImageUrl, setNewImgUrl] = useState("");

  //get users name and profile picture
  useEffect(() => {
    getUserInfo();
  }, []);

  //function to upload new profile picture
  async function handleImageUpload() {
    // if user changes their profile picture then continue with the saving process
    if (image) {
      //save the image as {their email address}.jpg
      const storageRef = ref(storage, `images/${email}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      //upload the new profile picture to firebase database
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle errors
          console.error("Upload failed:", error);
        },
        () => {
          // Get the download URL once the upload is complete
          console.log("image upload is complete");
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            setNewImgUrl(downloadURL);
            console.log("okay img url is now: ");
            console.log(newImageUrl);
            handleUpdateUserPfP(downloadURL);
          });
        }
      );
    } 
      // if the user doesn't want to change profile picture, ignore the if block statements to save it
  }

  //get image when user uploads it
  const handleImageChange = (e) => {
    console.log("Handle image change called.");
    const selectedImage = e.target.files[0];
    console.log(selectedImage);

    //validates a jpg/jpeg used
    if (!(selectedImage.name.endsWith(".jpg") || selectedImage.name.endsWith(".jpeg"))) {
      alert("Error: Only JPG/JPEG Files are allowed");
      return;
    }

    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  //function to go back (to dashboard)
  function backToDashboard() {
    toDashFunction(false);
  }

  //handle user signing out
  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  //submit profile picture change and change password if user wants to
  async function handleformSubmit() {
    handleImageUpload();

    //confirms new password is 6 characters
    if (
      newPassword.length < 6 &&
      currentPassword != "" &&
      confirmPassword != ""
    ) {
      alert("Error! New password must be atleast six characters.");
      return;
    }

    //confirms confirm password is 6 characters
    if (
      confirmPassword.length < 6 &&
      currentPassword != "" &&
      newPassword != ""
    ) {
      alert("Error! Confirm password must be atleast six characters.");
      return;
    }
    //confirms that current password isn't empty
    if (newPassword != "" && currentPassword == "" && confirmPassword != "") {
      alert("Error! You must enter your current password before updating.");
      return;
    }

    if (newPassword != "" && currentPassword != "" && confirmPassword != "") {
      handlePasswordChange();
    }

    // first and last name cannot be empty
    if (firstName != "" && lastName != "") {
      handleUpdateUserName();
    }
    else {
      alert("Names cannot be empty.");
      return;
    }
  }

  //change users password
  async function handlePasswordChange() {
    if (newPassword != confirmPassword) {
      alert("Error! new password and confirmed password does not match.");
      return;
    }
    const user = auth.currentUser;
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      userSignOut();
    } catch (err) {
      alert("Error: invalid current password.");
      console.log(err.message);
    }
  }

  //updates the users first name and last name information
  function handleUpdateUserName() {
    console.log("handle update user called");
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    /*Use query to get user object (contains first name, last name, etc.) */

    getDocs(userQuery).then((response) => {
      const user_from_response = response.docs.map((doc) => ({
        data: doc.data(),
        id: doc.id,
      }));
      /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
      const user_id = user_from_response.at(0).id;
      const userDocRef = doc(db, "users", user_id);
      updateDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
      });
    });
  }
  //updates the users profile picture information
  function handleUpdateUserPfP(x) {
    console.log("handle update user called");
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    /*Use query to get user object (contains first name, last name, etc.) */

    getDocs(userQuery).then((response) => {
      const user_from_response = response.docs.map((doc) => ({
        data: doc.data(),
        id: doc.id,
      }));
      /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
      const user_id = user_from_response.at(0).id;
      const userDocRef = doc(db, "users", user_id);
      updateDoc(userDocRef, {
        pfpUrl: x,
      });
    });
  }

  //function to get the users information to display it
  function getUserInfo() {
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

        /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/

        setFirstName(users_from_response.at(0).data.firstName);
        setLastName(users_from_response.at(0).data.lastName);
        setCurrentImageURL(users_from_response.at(0).data.pfpUrl);
      })
      .catch((error) => console.log(error));
  }
  //HTML to return the form
  return (
    <>
      <title>Profile</title>
      <link rel="stylesheet" href={profilePageStyle} />
      <div className="return-button">
        <button type="submit" onClick={backToDashboard}>
          ←
        </button>
        {/*back arrow unicode symbol*/}
      </div>
      <div className="profile-body">
        <h1 className="profile-h1">Edit Profile</h1>
        <h1>
          <img
            className="edit-profile-picture"
            src={currentImageURL}
            alt="profile picture"
          />
          <div className="edit-profile">
            <input
              type="file"
              id="file-upload"
              name="file"
              accept="image/jpeg"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="file-upload">Edit Image</label>
          </div>
          <div className="profile-sections">
            <label> First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="profile-sections">
            <label> Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="profile-sections">
            <label> Current Password:</label>
            <input
              type="password"
              placeholder="Current Password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="profile-sections">
            <label> New Password:</label>
            <input
              type="password"
              minLength={6}
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="profile-sections">
            <label> Confirm Password:</label>
            <input
              type="password"
              minLength={6}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            className="save-button"
            type="submit"
            onClick={handleformSubmit}
          >
            Update Profile
          </button>
        </h1>
        <button className="signOut-button" onClick={userSignOut}>
          Log Out
        </button>
      </div>
    </>
  );
}

export default ProfilePage;
