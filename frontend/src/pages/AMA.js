import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');  // Socket.io server URL

const AMA = () => {
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCreator, setNewThreadCreator] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  // Fetch existing threads from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/threads')
      .then(response => {
        setThreads(response.data.threads);
      })
      .catch(error => {
        console.error('Error fetching threads:', error);
      });
  }, []);

  // Join a specific thread (Socket.IO)
  const joinThread = (threadId) => {
    socket.emit('joinRoom', threadId);
    setSelectedThread(threadId);
    
    // Fetch existing messages for the thread
    axios.get(`http://localhost:5000/messages/${threadId}`)
      .then(response => {
        setMessages(response.data.messages);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  };

  // Handle the creation of a new thread
  const handleCreateThread = () => {
    if (!newThreadTitle || !newThreadCreator) {
      alert('Please provide both title and creator name');
      return;
    }

    axios.post('http://localhost:5000/createThread', {
      title: newThreadTitle,
      creator: newThreadCreator
    })
      .then(response => {
        setThreads([...threads, response.data.thread]); // Add new thread to the list
        setNewThreadTitle('');
        setNewThreadCreator('');
      })
      .catch(error => {
        console.error('Error creating thread:', error);
      });
  };

  // Handle sending a new message in the selected thread
  const handleSendMessage = () => {
    if (!newMessage) {
      alert('Please enter a message');
      return;
    }
  
    const messageData = {
      threadId: selectedThread,  // Ensure the correct threadId is used
      sender: 'User',  // Replace with actual user info
      text: newMessage
    };
  
    // Log the message data before sending to the backend
    console.log(messageData);
  
    axios.post('http://localhost:5000/sendMessage', messageData)
      .then(response => {
        setMessages([...messages, response.data.message]);  // Add message to chat
        setNewMessage('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };
  

  // Listen for new messages via Socket.IO
  useEffect(() => {
    socket.on('message', (data) => {
      if (data.room === selectedThread) {
        setMessages([...messages, data]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [messages, selectedThread]);

  return (
    <div>
      <h1>AMA Threads</h1>
      
      {/* Thread creation form */}
      <div>
        <h2>Create a new thread</h2>
        <input 
          type="text" 
          placeholder="Thread Title" 
          value={newThreadTitle} 
          onChange={(e) => setNewThreadTitle(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Creator Name" 
          value={newThreadCreator} 
          onChange={(e) => setNewThreadCreator(e.target.value)} 
        />
        <button onClick={handleCreateThread}>Create Thread</button>
      </div>

      {/* Display list of threads */}
      <div>
        <h2>Existing Threads</h2>
        {threads.length > 0 ? (
          <ul>
            {threads.map(thread => (
              <li key={thread._id}>
                <button onClick={() => joinThread(thread._id)}>{thread.title}</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No threads available</p>
        )}
      </div>

      {/* Messages section for the selected thread */}
      {selectedThread && (
        <div>
          <h3>Messages in this Thread</h3>
          <div>
            {messages.map((message, index) => (
              <div key={index}>
                <strong>{message.sender}:</strong> {message.text}
              </div>
            ))}
          </div>

          {/* Send a new message */}
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={handleSendMessage}>Send Message</button>
        </div>
      )}
    </div>
  );
};

export default AMA;

