import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { io } from "socket.io-client";
import axios from "axios";

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

  return (
    <div>
      <h2>Chat with {selectedUser.username}</h2>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc" }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.senderId === user.sub ? "right" : "left" }}>
            <strong>{msg.senderId === user.sub ? "You" : selectedUser.username}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatWindow;
