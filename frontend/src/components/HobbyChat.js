import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io('http://localhost:5000');

const HobbyChat = ({ selectedHobby }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (selectedHobby) {
            socket.emit('joinHobbyRoom', selectedHobby);

            // Fetch previous messages
            axios.get(`http://localhost:5000/api/hobbyChat/${selectedHobby}`)
                .then((response) => {
                    if (response.data.success) {
                        setMessages(response.data.messages);
                    }
                })
                .catch((error) => console.error('Error fetching messages:', error));
        }

        return () => {
            socket.emit('leaveHobbyRoom', selectedHobby);
            socket.off('receiveHobbyMessage');
        };
    }, [selectedHobby]);

    useEffect(() => {
        socket.on('receiveHobbyMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            const messageData = {
                room: selectedHobby,
                text: newMessage,
                sender: "User", // Replace with dynamic user data if available
                timestamp: new Date(),
            };

            socket.emit('sendHobbyMessage', messageData);
            setNewMessage("");
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
