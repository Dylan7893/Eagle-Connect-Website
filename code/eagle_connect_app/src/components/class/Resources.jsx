/*Class Component where you can post links for certain study resources */
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
  getDoc,
} from "firebase/firestore";

import { getNameAndPfp } from "../util/Util";
import {Filter} from "bad-words";

const filter = new Filter();
//handles displaying all resources and sending new resources
function Resources({ classID, email }) {
  //form handling stuff
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [name, setName] = useState("Test");
  const [resources, setResources] = useState([]);
  const [imgageUrl, setImageUrl] = useState("");

  //refresh the resources every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllResources();
      getNameAndPfp(email, setName, setImageUrl);
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  async function getAllResources() {
    const classDocRef = doc(db, "availableClasses", classID.classID);
    const classSnap = await getDoc(classDocRef);
    const thisclassData = classSnap.data();
    setResources(thisclassData.resources);
  }

  //function to upload the users inputted resource
  async function uploadNewLink() {
    getNameAndPfp(email, setName, setImageUrl);
    //do not let users send bad messages!
    if(filter.isProfane(title)){
      alert("Do not put profanity in the title.");
      setTitle("");
      setURL("");
      return; 
    }
    const classDocRef = doc(db, "availableClasses", classID.classID);
    updateDoc(classDocRef, {
      resources: arrayUnion({
        name: name,
        title: title,
        url: url,
        pfpUrl: imgageUrl,
      }),
    });
  }

  //assert that the URL is not malicious, more URLS can be added later if need be
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
    console.log("handle link submit");
    if (isValidURL(url)) {
      uploadNewLink();
      setTitle("");
      setURL("");
    } else {
      alert("Bad url.");
    }
  }

  //form input handling
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleURLChange = (e) => {
    setURL(e.target.value);
  };

  return (
    <>
      <div className="notes-resource-reminder-container">
        {resources.map((each_class) => (
          <Resource
            key={each_class.id}
            name={each_class.name}
            title={each_class.title}
            url={each_class.url}
            pfpUrl={each_class.pfpUrl}
          />
        ))}
      </div>
      <div class="add-resource-elements">
        <form>
          <div class="resource-field">
            <label for="Title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLinkSubmit();
                }
              }}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLinkSubmit();
                }
              }}
              placeholder="Enter URL"
              required
            />
          </div>
        </form>
        <button className="blue-buttons" onClick={handleLinkSubmit}>
          Submit
        </button>
      </div>
    </>
  );
}

//component to handle resource formatting
function Resource({ name, title, url, pfpUrl }) {
  return (
    <>
      <div class="resource-box">
        <img src={pfpUrl} alt="Profile Image" class="profile-image" />

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
export default Resources;
