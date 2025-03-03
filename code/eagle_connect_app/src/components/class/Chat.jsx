import React from "react";
import {auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, arrayUnion, updateDoc, query, where, doc } from "firebase/firestore";

/*Component where you can send chat messages */
function Chat({ className }) {

    //form handling stuff
    const [message_to_send, setMessageToSend] = useState("");

    const [messages, setMessages] = useState([]);


    useEffect(() => {
        getAllMessages();
    }, [])

    async function getAllMessages() {
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
            setMessages(class_from_responses.at(0).data.messages);
        }).catch(error => console.log(error));

    }

    async function uploadNewMessage() {
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
                    messages: arrayUnion({
                        name: "Test",
                        message: message_to_send,
                    }),
                });
            })
    }

    //validate message
    function handleMessageSubmit() {
            uploadNewMessage();
    }

    const handleNewMessageChange = (e) => {
        setMessageToSend(e.target.value);
    };

    return (
        <>
         {messages.map(each_class => <Message name={each_class.name} message={each_class.message}
            />)}
            <form>
               
                <input
                    type="text"
                    id="message"
                    value={message_to_send}
                    onChange={handleNewMessageChange}
                    placeholder="Enter Message"
                    required
                />

            </form>
            <button onClick={handleMessageSubmit}>Submit</button>
        </>
    )
}

function Message({ name, message}) {
    return (
        <>
            <p>Name: {name}</p>
            <p>Message: {message}</p>
        </>
    );
}
export default Chat;