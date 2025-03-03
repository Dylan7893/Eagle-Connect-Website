import React from "react";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, arrayUnion, updateDoc, query, where, doc } from "firebase/firestore";


/*Component where you can post links for certain study resources */
function Resources({ className }) {

    //form handling stuff
    const [title, setTitle] = useState("");
    const [url, setURL] = useState("");

    const [resources, setResources] = useState([]);


    useEffect(() => {
        getAllResources();
    }, [])

    async function getAllResources() {
        {/*Create query to get the user object from their email*/ }
        const classQuery = query(
            collection(db, "availableClasses"),
            where('name', '==', className)
        );

        {/*Use query to get user object (contains first name, last name, etc.) */ }
        getDocs(classQuery).then(response => {
            const class_from_responses = response.docs.map(doc => ({
                data: doc.data(),
                id: doc.id,
            }))
            setResources(class_from_responses.at(0).data.uploadedLinks);
        }).catch(error => console.log(error));

    }

    async function uploadNewLink() {
        var class_id;
        const classQuery = query(
            collection(db, "availableClasses"),
            where("name", "==", className)
        );

        {
            /*Use query to get user object (contains first name, last name, etc.) */
        }
        getDocs(classQuery)
            .then((response) => {
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
                    uploadedLinks: arrayUnion({
                        name: "Test",
                        title: title,
                        url: url,
                    }),
                });
            })
    }



    //assert that the URL is not malicious
    function isValidURL(link) {
        var goodURL = false;
        const validURLs =
            ["https://quizlet.com/",
                "https://www.chegg.com/",
                "https://www.symbolab.com/",
                "https://www.wolframalpha.com/",
                "https://www.khanacademy.org//",
                "https://www.youtube.com",
                "https://www.youtu.be",
                "https://scholar.google.com/",
                "https://my.moreheadstate.edu"];

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
            alert("Title: " + title + " URL: " + url + " className : " + className);
            uploadNewLink();
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
            {resources.map(each_class => <Resource name={each_class.name} title={each_class.title}
                url={each_class.url}
            />)}
            <form>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter Title"
                    required
                />
                <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={handleURLChange}
                    placeholder="Enter URL"
                    required
                />

            </form>
            <button onClick={handleLinkSubmit}>Submit</button>
        </>
    )
}

function Resource({ name, title, url }) {
    return (
        <>
            <p>Name: {name}</p>
            <p>Title: {title}</p>
            <p>URL: {url}</p>
        </>
    );
}
export default Resources;