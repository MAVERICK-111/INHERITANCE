import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');  // Backend URL

function ChatSystem({ selectedHobby }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // When hobby is selected, join the related room
  useEffect(() => {
    if (selectedHobby) {
      socket.emit('joinRoom', selectedHobby);
      
      // Listen for incoming messages
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Listen for previous messages
      socket.on('previousMessages', (previousMessages) => {
        setMessages(previousMessages);  // Set the previous messages from MongoDB
      });
    }

    // Cleanup the socket listeners when the component unmounts or selectedHobby changes
    return () => {
      socket.off('message');
      socket.off('previousMessages');
    };
  }, [selectedHobby]);

  // Send a message to the selected hobby room
  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        room: selectedHobby,
        text: newMessage,
        sender: 'User',  // Replace with real user info if applicable
        timestamp: new Date(),
      };
      socket.emit('message', messageData);
      setNewMessage('');  // Clear the input
    }
  };

  return (
    <div>
      <h2>Chat for {selectedHobby}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>: {msg.text} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatSystem;
