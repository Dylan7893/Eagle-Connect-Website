import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc, addDoc } from "firebase/firestore";
import { auth } from '../../firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { storage, db } from '../../firebase'; // Adjust the import path
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function ProfilePage({ email, toDashFunction }) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    // Save the image URL to Firestore (optional)
  const saveImageUrlToFirestore = async (url) => {
    try {
      const docRef = await addDoc(collection(db, 'images'), {
        url: url,
        timestamp: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.log(e);
    }
  };

    const handleImageUpload = () => {
        if (!image) {
          alert("You must select an image!");
          return;
        }
    
        const storageRef = ref(storage, `images/${email}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
    
        // Monitor the upload progress
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            // Optionally, save the URL in Firestore
            saveImageUrlToFirestore(downloadURL);
          }
        );
      };

    const handleImageChange = (e) => {
        console.log("Handle image change called.");
        const selectedImage = e.target.files[0];
        console.log(selectedImage);
        if (selectedImage) {
          setImage(selectedImage);
        }
      };

    function backToDashboard(){
        toDashFunction(false);
    }

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
        handleImageUpload();
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
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            userSignOut();
          } catch (err) {
            console.log(err.message);
            
          }
        
    }

    function handleUpdateUser() {
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
            {
              /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
            }
            const user_id = user_from_response.at(0).id;
            const userDocRef = doc(db, "users", user_id);
            updateDoc(userDocRef, {
              firstName: firstName,
              lastName: lastName,
            });
          });
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
                <button type="submit" onClick={backToDashboard} className="return-button">
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
                            onChange={handleImageChange}
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