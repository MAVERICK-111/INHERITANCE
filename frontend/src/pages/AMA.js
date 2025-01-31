import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './AMA.css';
import { useAuth0 } from "@auth0/auth0-react";


const socket = io('http://localhost:5000');  // Socket.io server URL

const AMA = () => {
  const { user } = useAuth0();
  const [AMAthreads, setAMAthreads] = useState([]);
  const [newAMAthreadTitle, setNewAMAthreadTitle] = useState('');
  const [newAMAthreadCreator, setNewAMAthreadCreator] = useState(user?.sub || 'Unknown');
  const [selectedAMAthread, setSelectedAMAthread] = useState(null);
  const [newAMAMessage, setNewAMAMessage] = useState('');
  const [AMAmessages, setAMAmessages] = useState([]);

  // Fetch existing AMA threads from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/getAMAThreads')
      .then(response => {
        setAMAthreads(response.data.AMAthreads);
      })
      .catch(error => {
        console.error('Error fetching AMA threads:', error);
      });
  }, []);

  // Join a specific AMA thread (Socket.IO)
  const joinAMAthread = (AMAthreadId) => {
    socket.emit('joinAMAthread', AMAthreadId);
    setSelectedAMAthread(AMAthreadId);

    // Fetch existing AMA messages for the AMA thread
    axios.get(`http://localhost:5000/api/getAMAMessages/${AMAthreadId}`)
      .then(response => {
        setAMAmessages(response.data.AMAmessages);
      })
      .catch(error => {
        console.error('Error fetching AMA messages:', error);
      });
  };

  // Handle the creation of a new AMA thread
  const handleCreateAMAthread = async () => {
    if (!newAMAthreadTitle) {
      alert('Please ask a question!');
      return;
    }
  
    // Use the user's name as the creatorName if available
    const creatorName = user?.name || 'Unknown';
  
    axios.post('http://localhost:5000/api/createAMAThread', {
      title: newAMAthreadTitle,
      creator: newAMAthreadCreator,
      creatorName: creatorName,  // Pass creatorName correctly
    })
      .then(response => {
        setAMAthreads([...AMAthreads, response.data.AMAthread]);
        setNewAMAthreadTitle('');
        setNewAMAthreadCreator('');
      })
      .catch(error => {
        console.error('Error creating thread:', error);
      });
  };
  
  // Handle the delete AMA thread action
  const handleDeleteAMAthread = (AMAthreadId, creator) => {
    // Only the creator can delete the thread
    if (user?.sub !== creator) {
      alert("You are not authorized to delete this thread.");
      return;
    }

    axios.delete(`http://localhost:5000/api/deleteAMAThread/${AMAthreadId}`, {
      data: { userSub: user?.sub } // Send user's sub to verify
    })
    .then(response => {
      // Remove the thread from the UI after successful deletion
      setAMAthreads(prevThreads => prevThreads.filter(thread => thread._id !== AMAthreadId));
      setSelectedAMAthread(null); // Clear selected thread
    })
    .catch(error => {
      console.error('Error deleting AMA thread:', error);
      alert('Failed to delete the thread');
    });
  };

  // Handle sending a new AMA message in the selected AMA thread
  const handleSendAMAMessage = () => {
    if (!newAMAMessage) {
      alert('Please enter a message');
      return;
    }

    const AMAMessageData = {
      AMAthreadId: selectedAMAthread,
      sender: user?.sub,  // Replace with actual user info
      senderName: user?.name,
      text: newAMAMessage
    };

    // Optimistically add the message to the state before the server responds
    setAMAmessages(prevMessages => [
      ...prevMessages,
      { sender: user?.sub, senderName: user?.name, text: newAMAMessage, AMAthreadId: selectedAMAthread }
    ]);

    // Send the message to the backend
    axios.post('http://localhost:5000/api/sendAMAmessage', AMAMessageData)
      .then(response => {
        setNewAMAMessage('');  // Clear the input field after sending
      })
      .catch(error => {
        console.error('Error sending AMA message:', error);
        // Optionally handle errors (e.g., show a message or revert the optimistic update)
      });

    // Emit the message to other clients via Socket.IO
    socket.emit('sendAMAmessage', AMAMessageData);
  };

  // Listen for new AMA messages via Socket.IO
  useEffect(() => {
    socket.on('AMAmessage', (data) => {
      if (data.AMAthreadId === selectedAMAthread) {
        setAMAmessages(prevMessages => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off('AMAmessage');
    };
  }, [selectedAMAthread]);  // Listen only when selected thread changes

  return (
    <div className='ama-container'>
      <div className="ama-logo-container">
          <h1>Ask Me Anything</h1>
      </div>
      
      {/* AMA thread creation form */}
      <div className='ama-create-thread'>
        <div className='ama-create-heading'>Ask Something!</div>
        <input 
          type="text" 
          placeholder="Your Query Please"
          value={newAMAthreadTitle}
          onChange={(e) => setNewAMAthreadTitle(e.target.value)}
        />
        <button onClick={handleCreateAMAthread}>Post</button>
      </div>

      {/* Display list of AMA threads */}
      <div className='ama-threads-container'>
        <div className='ama-existing-threads'>
          <div className='ama-thread-heading'>Questions...</div>
          {AMAthreads.length > 0 ? (
            <ul>
              {AMAthreads.reverse().map(AMAthread => (
                <li key={AMAthread._id}>
                  <button onClick={() => joinAMAthread(AMAthread._id)}>{AMAthread.title}</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No threads available</p>
          )}
        </div>

        <div className='ama-chat-section'>
          {/* AMA messages section for the selected AMA thread */}
          
          {selectedAMAthread && (
            <div className='msg-ama'>
              <h3>{AMAthreads.find(thread => thread._id === selectedAMAthread)?.title} - {AMAthreads.find(thread => thread._id === selectedAMAthread)?.creatorName}</h3>
              {/* Render delete button only for the thread creator */}
              {AMAthreads.find(thread => thread._id === selectedAMAthread)?.creator === user?.sub && (
                <button
                  onClick={() => handleDeleteAMAthread(selectedAMAthread, AMAthreads.find(thread => thread._id === selectedAMAthread)?.creator)}
                  style={{ color: 'red', marginBottom: '10px' }}
                >
                  Delete Thread
                </button>
              )}
              <div className='ama-thread-messages'>
                {AMAmessages.map((AMAmessage, index) => (
                  <div key={index}>
                    <strong>{AMAmessage.senderName}:</strong> {AMAmessage.text}
                  </div>
                ))}
              </div>

              {/* Send a new AMA message */}
              <textarea
                value={newAMAMessage}
                onChange={(e) => setNewAMAMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendAMAMessage();
                  setNewAMAMessage('');
                  }
                }}
                placeholder="Your Answer..."
              />
              <button onClick={handleSendAMAMessage}>Send Message</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AMA;
