//this function is called several times so we will just define it once
import {
    collection,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
import { db } from "../../firebase";
//get the current user's name and profile picture url
  export async function getNameAndPfp(email, setName, setImageUrl) {
    console.log("Email: ", email);
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

        /*We only want the first element. if the element size is greater than 1 then there is a big problem.*/
        var toSend;
        toSend = users_from_response.at(0).data.firstName;
        toSend += " ";
        toSend += users_from_response.at(0).data.lastName;
        setName(toSend);
        setImageUrl(users_from_response.at(0).data.pfpUrl);
      })
      .catch((error) => console.log(error));
  }