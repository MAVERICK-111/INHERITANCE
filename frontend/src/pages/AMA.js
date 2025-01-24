import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './AMA.css';

const socket = io('http://localhost:5000');  // Socket.io server URL

const AMA = () => {
  const [AMAthreads, setAMAthreads] = useState([]);
  const [newAMAthreadTitle, setNewAMAthreadTitle] = useState('');
  const [newAMAthreadCreator, setNewAMAthreadCreator] = useState('');
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
  const handleCreateAMAthread = async() => {
    if (!newAMAthreadTitle || !newAMAthreadCreator) {
      alert('Please provide both title and creator name');
      return;
    }

    axios.post('http://localhost:5000/api/createAMAThread', {
      title: newAMAthreadTitle,
      creator: newAMAthreadCreator
    })
      .then(response => {
        setAMAthreads([...AMAthreads, response.data.AMAthread]); // Add new thread to the list
        setNewAMAthreadTitle('');
        setNewAMAthreadCreator('');
      })
      .catch(error => {
        console.error('Error creating thread:', error);
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
      sender: 'User',  // Replace with actual user info
      text: newAMAMessage
    };

    // Optimistically add the message to the state before the server responds
    setAMAmessages(prevMessages => [
      ...prevMessages,
      { sender: 'User', text: newAMAMessage, AMAthreadId: selectedAMAthread }
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
    <div className='AMA-container'>
      <h1>AMA Threads</h1>
      
      {/* AMA thread creation form */}
      <div className='new-thread'>
        <div className='heading'>Ask Something!</div>
        <input 
          type="text" 
          placeholder="AMA thread Title"
          value={newAMAthreadTitle}
          onChange={(e) => setNewAMAthreadTitle(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Creator Name"
          value={newAMAthreadCreator}
          onChange={(e) => setNewAMAthreadCreator(e.target.value)}
        />
        <button onClick={handleCreateAMAthread}>Post</button>
      </div>

      {/* Display list of AMA threads */}
      <div className='threads-container'>
        <div className='Threads'>
          <div className='headingdiv'>Existing Threads</div>
          {AMAthreads.length > 0 ? (
            <ul>
              {AMAthreads.map(AMAthread => (
                <li key={AMAthread._id}>
                  <button onClick={() => joinAMAthread(AMAthread._id)}>{AMAthread.title}</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No threads available</p>
          )}
        </div>

        <div className='Th-msg'>
          {/* AMA messages section for the selected AMA thread */}
          {selectedAMAthread && (
            <div>
              <h3>AMA messages in this AMA thread</h3>
              <div className='Thread-messages'>
                {AMAmessages.map((AMAmessage, index) => (
                  <div key={index}>
                    <strong>{AMAmessage.sender}:</strong> {AMAmessage.text}
                  </div>
                ))}
              </div>

              {/* Send a new AMA message */}
              <textarea
                value={newAMAMessage}
                onChange={(e) => setNewAMAMessage(e.target.value)}
                placeholder="Type your AMA message"
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
