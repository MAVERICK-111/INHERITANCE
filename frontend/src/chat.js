// src/ChatApp.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch messages from the backend
    axios.get("http://localhost:5000/api/chat").then((response) => {
      setMessages(response.data);
    });

    // Listen for real-time messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Join the chat room
    if (user) {
      socket.emit("join", user);
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);

  const sendMessage = () => {
    const messageData = {
      user,
      message,
    };

    // Send message to the backend and broadcast via Socket.io
    axios.post("http://localhost:5000/api/chat", messageData).then((response) => {
      socket.emit("sendMessage", response.data);
      setMessage("");
    });
  };

  return (
    <div>
      {!user ? (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button onClick={() => setUser(user)}>Join Chat</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user}!</h2>
          <div>
            {messages.map((msg) => (
              <div key={msg._id}>
                <strong>{msg.user}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatApp;