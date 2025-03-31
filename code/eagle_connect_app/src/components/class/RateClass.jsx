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
} from "firebase/firestore";

/*Component where you can post links for certain study resources */
function RateClass({ className, email }) {
  //form handling stuff
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [name, setName] = useState("Test");
  const [resources, setResources] = useState([]);

  //refresh the resources every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllResources();
      getName();
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  async function getName() {
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
      })
      .catch((error) => console.log(error));
  }

  async function getAllResources() {
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
        setResources(class_from_responses.at(0).data.resources);
      })
      .catch((error) => console.log(error));
  }

  async function uploadNewLink() {
    var class_id;
    getName();
    const classQuery = query(
      collection(db, "availableClasses"),
      where("className", "==", className)
    );

    {
      /*Use query to get user object (contains first name, last name, etc.) */
    }
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
      updateDoc(classDocRef, {
        resources: arrayUnion({
          name: name,
          title: title,
          url: url,
        }),
      });
    });
  }

  //assert that the URL is not malicious
  function isValidURL(link) {
    var goodURL = false;
    const validURLs = [
      "https://quizlet.com/",
      "https://www.chegg.com/",
      "https://www.symbolab.com/",
      "https://www.wolframalpha.com/",
      "https://www.khanacademy.org//",
      "https://www.youtube.com",
      "https://www.youtu.be",
      "https://scholar.google.com/",
      "https://my.moreheadstate.edu",
    ];

    for (let link_in_list of validURLs) {
      if (link.startsWith(link_in_list)) {
        goodURL = true;
      }
    }
    return goodURL;
  }
  //validate title and url and push to the database.
  function handleLinkSubmit() {
    if (isValidURL(url)) {
      uploadNewLink();
      setTitle("");
      setURL("");
    } else {
      alert("Bad url.");
    }
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleURLChange = (e) => {
    setURL(e.target.value);
  };

  return (
    <>
      {resources.map((each_class) => (
        <Resource
          name={each_class.name}
          title={each_class.title}
          url={each_class.url}
        />
      ))}

      <div class="add-resource-elements">
        <form>
          <div class="resource-field">
            <label for="Title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter Title"
              required
            />
          </div>
          <div class="resource-field">
            <label for="url">URL:</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={handleURLChange}
              placeholder="Enter URL"
              required
            />
          </div>
        </form>
        <button onClick={handleLinkSubmit}>Submit</button>
      </div>
    </>
  );
}

function Resource({ name, title, url }) {
  return (
    <>
      <div class="resource-box">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          alt="Profile Image"
          class="profile-image"
        />

        <div class="resource">
          <div class="name">{name}</div>

          <strong>Title: {title}</strong>

          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      </div>
    </>
  );
}
export default RateClass;
