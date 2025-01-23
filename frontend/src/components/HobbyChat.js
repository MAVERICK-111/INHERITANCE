import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios"; // Import Axios
// import './HobbyChat.css';

const socket = io('http://localhost:5000'); // Update with your server's URL

const HobbyChat = ({ selectedHobby }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    //const [username, setUsername] = useState("User" + Math.floor(Math.random() * 1000)); // Random username

    useEffect(() => {
        if (selectedHobby) {
            // Join the selected hobby's chat room
            socket.emit('joinHobbyRoom', selectedHobby);

            // Fetch previous messages for the hobby room
            axios.get(`http://localhost:5000/api/hobbyChat/${selectedHobby}/messages`)
                .then((response) => {
                    if (response.data.success) {
                        setMessages(response.data.messages);
                    }
                })
                .catch((error) => console.error('Error fetching chat messages:', error));
        }

        return () => {
            socket.disconnect();
        };
    }, [selectedHobby]);

    useEffect(() => {
        // Listen for incoming messages
        socket.on('receiveHobbyMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveHobbyMessage');
        };
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            axios.post(`http://localhost:5000/api/hobbies/${selectedHobby}/messages`, { message: newMessage })
                .then(response => {
                    if (response.data.success) {
                        setMessages([...messages, response.data.message]);
                        setNewMessage("");
                    }
                })
                .catch(error => console.error('Error sending message:', error));
        }
    };

    return (
        <div className="chat-container">
            <h2>Chat for: {selectedHobby}</h2>
            <div className="chat-box">
                {messages.map((message, index) => (
                    <div key={index} className="chat-message">
                        <strong>{message.sender}: </strong>
                        <span>{message.text}</span>
                        <div className="chat-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</div>
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message"
                    className="chat-input"
                />
                <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
};

export default HobbyChat;