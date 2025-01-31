import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { io } from "socket.io-client";
import axios from "axios";
import "./chatwindow.css";

const socket = io("http://localhost:5000");

const ChatWindow = ({ selectedUser }) => {
  const { user } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  // Fetch messages on user or selectedUser change
  useEffect(() => {
    if (user && selectedUser) {
      axios
        .get(`http://localhost:5000/api/messages/get/${user.sub}/${selectedUser.auth0Id}`)
        .then((res) => setMessages(res.data))
        .catch((error) => console.error("Error fetching messages:", error));
    }

    if (user) {
      socket.emit("join", user.sub);

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]); // Add received message
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [user, selectedUser]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const newMessage = { senderId: user.sub, receiverId: selectedUser.auth0Id, message: messageText };

    try {
      const { data } = await axios.post("http://localhost:5000/api/messages/send", newMessage); // Save message in DB
      socket.emit("sendMessage", newMessage); // Emit to socket

      setMessages([...messages, data]); // Update the UI with the new message
      setMessageText(""); // Reset input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // If Enter is pressed and Shift is not held down (to prevent newline)
      e.preventDefault(); // Prevent default behavior (new line)
      sendMessage(); // Send the message
    }
  };

  return (
    <div className="chat-window">
      <h2>Chat with {selectedUser.username}</h2>
      <div className="msg-chat-container">
        {messages.map((msg, index) => (
          <p 
            key={index} 
            className={msg.senderId === user.sub ? "user-message" : "other-message"}
          >
            {msg.message}
          </p>
        ))}
      </div>

      <div className="msg-send-cont">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown} // Listen for Enter key press
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
