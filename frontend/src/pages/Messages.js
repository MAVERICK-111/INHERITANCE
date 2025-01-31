import React, { useEffect, useState } from "react";
import './messages.css';
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user, isAuthenticated } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (isAuthenticated && selectedUser) {
      axios.get(`http://localhost:5000/api/messages/get/${user.sub}/${selectedUser.auth0Id}`)
        .then((res) => setMessages(res.data))
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [user, isAuthenticated, selectedUser]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const { data } = await axios.post("http://localhost:5000/api/messages/send", {
        senderId: user.sub,
        receiverId: selectedUser.auth0Id,
        message: messageText,
      });

      setMessages([...messages, data]);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!isAuthenticated) return <p>Please log in</p>;
  //if (!selectedUser) return <p>Select a user to chat with</p>;

  return (
    <div className="main-msg-container">
      {/* User List on the left side */}
      <div className="left-msg">
        <UserList onSelectUser={setSelectedUser} />
      </div>

      {/* Chat Window on the right side */}
      <div className="right-msg-container">
        {selectedUser ? (
          <ChatWindow 
            selectedUser={selectedUser}
            messages={messages}
            setMessages={setMessages}
            messageText={messageText}
            setMessageText={setMessageText}
            sendMessage={sendMessage}
          />
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Messages;