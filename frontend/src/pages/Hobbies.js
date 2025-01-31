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
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState(null);

  // Function to fetch username
  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.sub) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/getUsername/${user.sub}`);
          setUsername(response.data.username);  // Assuming the response has a 'username' field
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
    };
  
    if (user?.sub) {
      fetchUsername();
    }
  }, [user?.sub]);

  // Get Hobby threads
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

    // Get Hobby messages for the selected thread
    axios.get(`http://localhost:5000/api/getHobbyMessages/${HobbythreadId}`)
      .then(response => {
        setHobbymessages(response.data.Hobbymessages);
      })
      .catch(error => {
        console.error('Error fetching Hobby messages:', error);
      });
  };

  // Create new Hobby thread
  const handleCreateHobbythread = async () => {
    if (!newHobbythreadTitle) {
      alert('Please ask a question!');
      return;
    }
    const creatorName = username || 'Unknown';
    try {
      const response = await axios.post('http://localhost:5000/api/createHobbyThread', {
        title: newHobbythreadTitle,
        creator: newHobbythreadCreator,
        creatorName: creatorName,
      });
      setHobbythreads([response.data.Hobbythread, ...Hobbythreads]);
      setNewHobbythreadTitle('');
      setNewHobbythreadCreator('');
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };  

  // Send Hobby message in selected Hobby thread
  const handleSendHobbyMessage = () => {
    if (!newHobbyMessage) {
      alert('Please enter a message');
      return;
    }
    const sendername = username || 'Unknown';
    const HobbyMessageData = {
      HobbythreadId: selectedHobbythread,
      sender: user?.sub,
      senderName: sendername,
      text: newHobbyMessage
    };

    setHobbymessages(prevMessages => [
      ...prevMessages,
      { sender: user?.sub, senderName: username, text: newHobbyMessage, HobbythreadId: selectedHobbythread }
    ]);

    // Send message to backend
    axios.post('http://localhost:5000/api/sendHobbymessage', HobbyMessageData)
      .then(response => {
        setNewHobbyMessage('');
      })
      .catch(error => {
        console.error('Error sending Hobby message:', error);
      })
      .finally(() => {
        setNewHobbyMessage('');
      });

    // Message refresh
    socket.emit('sendHobbymessage', HobbyMessageData);
  };

  const filteredHobbythreads = Hobbythreads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Notification for new Hobby message
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
    <div className='hobbies-container'>
      <div className="heading-container">
        <h1 className="heading-title">Hobbies</h1>
        <p className="heading-subtitle">Dive into your passions and connect with like-minded people.</p>
      </div>

      {/* Thread creation form */}
      <div className='main-box-hob'>
        <div className='left-hob'>
          <div className='hobbies-list'>
            <input 
              type="text" 
              placeholder="New Hobby... "
              value={newHobbythreadTitle}
              onChange={(e) => setNewHobbythreadTitle(e.target.value)}
            />
            <button onClick={handleCreateHobbythread}>+</button>
          </div>
          

          {/* List of Hobby threads */}
          <div className='threads-container'>
            <div className='Threads'>
              <div className='headingdiv'>Hobby Groups</div>
              {/* Search bar for filtering threads */}
              <div className='hobby-search-bar'>
                <input 
                  type="text" 
                  placeholder="Find Your Hobby..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {filteredHobbythreads.length > 0 ? (
                <ul>
                  {filteredHobbythreads.map(Hobbythread => (
                    <li key={Hobbythread._id}>
                      <button onClick={() => joinHobbythread(Hobbythread._id)}>{Hobbythread.title}</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No threads available</p>
              )}
            </div>
          </div>
        </div>
        

        <div className='right-hob'>
          {/* Messages section for the selected Hobby thread */}
          {selectedHobbythread && (
            <div className = 'sendhob'>
              <div className ="hob-h3"><h3>{Hobbythreads.find(thread => thread._id === selectedHobbythread)?.title}</h3></div>
              <div className='Thread-messages-hob'>
                {Hobbymessages.map((Hobbymessage, index) => (
                  <div key={index}>
                    <p><strong>{Hobbymessage.senderName}</strong><span className="timestamp">({new Date(Hobbymessage.timestamp).toLocaleString()})</span></p>
                    <p>{Hobbymessage.text}</p>
                  </div>
                ))}
              </div>
              <div className='input-hob-msg'>
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
                  placeholder="Type something..."
                />
                <button onClick={handleSendHobbyMessage} className='hob-button'>Send Message</button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hobbies;
