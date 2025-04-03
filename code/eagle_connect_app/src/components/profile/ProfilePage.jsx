import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from '../../firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
function ProfilePage({ email }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        getUserInfo();
    }, []);

const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

    function handleformSubmit() {
        console.log("****Edit Profile Has been called*****");
        console.log(firstName);
        console.log(lastName);
        console.log(currentPassword);
        console.log(newPassword);
        console.log(confirmPassword);

        handleUpdateUser();

        if (newPassword != "" || currentPassword != "" || confirmPassword != "") {
            handlePasswordChange();
        }

    }

    async function handlePasswordChange() {
        if (newPassword != confirmPassword) {
            alert("Error! new password and confirmed password does not match.");
            return;
        }
        const user = auth.currentUser;
        try {
            // Reauthenticate user before updating password
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
      
            // Now, update the password
            await updatePassword(user, newPassword);
          } catch (err) {
            console.log(err.message);
            
          }
        
    }

    function handleUpdateUser() {

    }

    async function getUserInfo() {
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
                setFirstName(users_from_response.at(0).data.firstName);
                setLastName(users_from_response.at(0).data.lastName);
            })
            .catch((error) => console.log(error));

    }
    return (
        <>
            <title>Profile</title>
            <div>
                <button type="submit" className="return-button">
                    ←
                </button>
                {/*back arrow unicode symbol*/}
            </div>
            <div className="profile-body">
                <h1 className="profile-h1">Edit Profile</h1>
                <h1>
                    <img
                        className="profile-picture"
                        src="default_pfp.jpg"
                        alt="profile picture"
                    />
                    <div className="edit-profile">
                        <input
                            type="file"
                            id="file-upload"
                            name="file"
                            accept="image/jpeg"
                            style={{ display: "none" }}
                        />
                        <label htmlFor="file-upload">Edit Image</label>
                    </div>
                    <div className="profile-sections">
                        <label> First Name:</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="profile-sections">
                        <label> Last Name:</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="profile-sections">
                        <label> Current Password:</label>
                        <input type="password" placeholder="Current Password" onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div className="profile-sections">
                        <label> New Password:</label>
                        <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="profile-sections">
                        <label> Confirm Password:</label>
                        <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button className="save-button" type="submit" onClick={handleformSubmit}>
                        Update Profile
                    </button>
                </h1>
                <button onClick={userSignOut}>Log Out</button>
            </div>
        </>
    );
}

export default ProfilePage;