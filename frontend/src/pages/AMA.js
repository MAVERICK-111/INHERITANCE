import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import io from 'socket.io-client';
import axios from 'axios';
import './AMA.css';
import { useAuth0 } from "@auth0/auth0-react";


const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);  // Socket.io server URL

const AMA = () => {
  const { user } = useAuth0();
  const [AMAthreads, setAMAthreads] = useState([]);
  const [newAMAthreadTitle, setNewAMAthreadTitle] = useState('');
  const [newAMAthreadCreator, setNewAMAthreadCreator] = useState(user?.sub || 'Unknown');
  const [selectedAMAthread, setSelectedAMAthread] = useState(null);
  const [newAMAMessage, setNewAMAMessage] = useState('');
  const [AMAmessages, setAMAmessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');

  const getUsername = async (auth0Id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/getUsername/${auth0Id}`);
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching username:', error);
      setUsername('Unknown');
    }
  };
  useEffect(() => {
    if (user?.sub) {
      getUsername(user.sub);
    }
  }, [user?.sub]);

  // Fetch existing AMA threads from the backend
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getAMAThreads`)
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
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getAMAMessages/${AMAthreadId}`)
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
    const creatorName = username || 'Unknown';
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/createAMAThread`, {
        title: newAMAthreadTitle,
        creator: newAMAthreadCreator,
        creatorName: creatorName,  // Pass creatorName correctly
      });
  
      // Add the new thread to the top of the list without refreshing
      setAMAthreads([response.data.AMAthread, ...AMAthreads]);
      setNewAMAthreadTitle('');
      setNewAMAthreadCreator('');
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };
  
  // Handle the delete AMA thread action
  const handleDeleteAMAthread = (AMAthreadId, creator) => {
    // Only the creator can delete the thread
    if (user?.sub !== creator) {
      alert("You are not authorized to delete this thread.");
      return;
    }

    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/deleteAMAThread/${AMAthreadId}`, {
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
    const sendername = username || 'Unknown';
    const AMAMessageData = {
      AMAthreadId: selectedAMAthread,
      sender: user?.sub,  // Replace with actual user info
      senderName: sendername,
      text: newAMAMessage
    };

    // Optimistically add the message to the state before the server responds
    setAMAmessages(prevMessages => [
      ...prevMessages,
      { sender: user?.sub, senderName: username, text: newAMAMessage, AMAthreadId: selectedAMAthread,timestamp: new Date() }
    ]);

    // Send the message to the backend
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sendAMAmessage`, AMAMessageData)
      .then(response => {
        setNewAMAMessage('');  // Clear the input field after sending
      })
      .catch(error => {
        console.error('Error sending AMA message:', error);
        // Optionally handle errors (e.g., show a message or revert the optimistic update)
      })
      .finally(() => {
        setNewAMAMessage('');
      });
    // Emit the message to other clients via Socket.IO
    socket.emit('sendAMAmessage', AMAMessageData);
  };

  const filteredAMAthreads = AMAthreads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  
  // Automatically scroll to the bottom of the message list
  useEffect(() => {
    const messagesContainer = document.querySelector('.ama-thread-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [AMAmessages, selectedAMAthread]);

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
          {/* Search bar for filtering threads */}
          <div className='ama-search-bar'>
            <input 
              type="text" 
              placeholder="Revisit To.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredAMAthreads.length > 0 ? (
            <ul>
              {filteredAMAthreads.map(AMAthread => (
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
                  // <div key={index}>
                  //   <p><strong>{AMAmessage.senderName}</strong> <span className="timestamp">({new Date(AMAmessage.timestamp).toLocaleString()})</span></p>
                  //   <p>{AMAmessage.text}</p>
                  // </div>
                  <div key={index}>
                    <p>
                      <Link to={`/viewprofile/${AMAmessage.sender}`}>
                        <strong>{AMAmessage.senderName}</strong>
                      </Link>
                      <span className="timestamp">({new Date(AMAmessage.timestamp).toLocaleString()})</span>
                    </p>
                    <p>{AMAmessage.text}</p>
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
