import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Hobbies.css';
import { useAuth0 } from "@auth0/auth0-react";


const socket = io('http://localhost:5000');

const Hobbies = () => {
  const { user } = useAuth0();
  const [Hobbythreads, setHobbythreads] = useState([]);
  const [newHobbythreadTitle, setNewHobbythreadTitle] = useState('');
  const [newHobbythreadCreator, setNewHobbythreadCreator] = useState(user?.sub || 'Unknown');
  const [selectedHobbythread, setSelectedHobbythread] = useState(null);
  const [newHobbyMessage, setNewHobbyMessage] = useState('');
  const [Hobbymessages, setHobbymessages] = useState([]);

  //get Hobby threads
  useEffect(() => {
    axios.get('http://localhost:5000/api/getHobbyThreads')
      .then(response => {
        setHobbythreads(response.data.Hobbythreads);
      })
      .catch(error => {
        console.error('Error fetching Hobby threads:', error);
      });
  }, []);

  // Join Hobby thread
  const joinHobbythread = (HobbythreadId) => {
    socket.emit('joinHobbythread', HobbythreadId);
    setSelectedHobbythread(HobbythreadId);

    //get Hobby messages for the Hobby thread
    axios.get(`http://localhost:5000/api/getHobbyMessages/${HobbythreadId}`)
      .then(response => {
        setHobbymessages(response.data.Hobbymessages);
      })
      .catch(error => {
        console.error('Error fetching Hobby messages:', error);
      });
  };

  //create new Hobby thread
  const handleCreateHobbythread = async () => {
    if (!newHobbythreadTitle) {
      alert('Please ask a question!');
      return;
    }
    const creatorName = user?.name;
  
    axios.post('http://localhost:5000/api/createHobbyThread', {
      title: newHobbythreadTitle,
      creator: newHobbythreadCreator,
      creatorName: creatorName,
    })
      .then(response => {
        setHobbythreads([...Hobbythreads, response.data.Hobbythread]);
        setNewHobbythreadTitle('');
        setNewHobbythreadCreator('');
      })
      .catch(error => {
        console.error('Error creating thread:', error);
      });
  };
  
  //delete Hobby thread
  const handleDeleteHobbythread = (HobbythreadId, creator) => {
    if (user?.sub !== creator) {
      alert("You are not authorized to delete this thread.");
      return;
    }

    axios.delete(`http://localhost:5000/api/deleteHobbyThread/${HobbythreadId}`, {
      data: { userSub: user?.sub }
    })
    .then(response => {
      setHobbythreads(prevThreads => prevThreads.filter(thread => thread._id !== HobbythreadId));
      setSelectedHobbythread(null);
    })
    .catch(error => {
      console.error('Error deleting Hobby thread:', error);
      alert('Failed to delete the thread');
    });
  };

  //sending Hobby message in selected Hobby thread
  const handleSendHobbyMessage = () => {
    if (!newHobbyMessage) {
      alert('Please enter a message');
      return;
    }

    const HobbyMessageData = {
      HobbythreadId: selectedHobbythread,
      sender: user?.sub,
      senderName: user?.name,
      text: newHobbyMessage
    };

    setHobbymessages(prevMessages => [
      ...prevMessages,
      { sender: user?.sub, senderName: user?.name, text: newHobbyMessage, HobbythreadId: selectedHobbythread }
    ]);

    // Send message to backend
    axios.post('http://localhost:5000/api/sendHobbymessage', HobbyMessageData)
      .then(response => {
        setNewHobbyMessage('');
      })
      .catch(error => {
        console.error('Error sending Hobby message:', error);
      });

    //message refresh
    socket.emit('sendHobbymessage', HobbyMessageData);
  };

  //notification
  useEffect(() => {
    socket.on('Hobbymessage', (data) => {
      if (data.HobbythreadId === selectedHobbythread) {
        setHobbymessages(prevMessages => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off('Hobbymessage');
    };
  }, [selectedHobbythread]);

  return (
    <div className='Hobby-container'>
      <div className="Hobby-logo">
          <h1>Ask Me Anything</h1>
      </div>
      
      {/*thread creation form */}
      <div className='new-thread'>
        <div className='heading'>Ask Something!</div>
        <input 
          type="text" 
          placeholder="Your Query Please"
          value={newHobbythreadTitle}
          onChange={(e) => setNewHobbythreadTitle(e.target.value)}
        />
        {/* <input 
          type="text" 
          placeholder="Creator Name"
          value={newHobbythreadCreator}
          onChange={(e) => setNewHobbythreadCreator(e.target.value)}
        /> */}
        <button onClick={handleCreateHobbythread}>Post</button>
      </div>

      {/*list of Hobby threads */}
      <div className='threads-container'>
        <div className='Threads'>
          <div className='headingdiv'>Existing Threads</div>
          {Hobbythreads.length > 0 ? (
            <ul>
              {Hobbythreads.map(Hobbythread => (
                <li key={Hobbythread._id}>
                  <button onClick={() => joinHobbythread(Hobbythread._id)}>{Hobbythread.title}</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No threads available</p>
          )}
        </div>

        <div className='Th-msg'>
          {/*messages section for the selected Hobby thread */}
          {selectedHobbythread && (
            <div>
              <h3>{Hobbythreads.find(thread => thread._id === selectedHobbythread)?.title} - {Hobbythreads.find(thread => thread._id === selectedHobbythread)?.creatorName}</h3>
              {/*delete button only for the thread creator */}
              {Hobbythreads.find(thread => thread._id === selectedHobbythread)?.creator === user?.sub && (
                <button
                  onClick={() => handleDeleteHobbythread(selectedHobbythread, Hobbythreads.find(thread => thread._id === selectedHobbythread)?.creator)}
                  style={{ color: 'red', marginBottom: '10px' }}
                >
                  Delete Thread
                </button>
              )}
              <div className='Thread-messages'>
                {Hobbymessages.map((Hobbymessage, index) => (
                  <div key={index}>
                    <strong>{Hobbymessage.senderName}:</strong> {Hobbymessage.text}
                  </div>
                ))}
              </div>

              {/* Send a new Hobby message */}
              <textarea
                value={newHobbyMessage}
                onChange={(e) => setNewHobbyMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendHobbyMessage();
                  setNewHobbyMessage('');
                  }
                }}
                placeholder="Your Answer"
              />
              <button onClick={handleSendHobbyMessage}>Send Message</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hobbies;