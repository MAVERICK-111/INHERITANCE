
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HobbyManager = () => {
  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState('');

  // Fetch hobbies from the backend
  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/hobbies');
        setHobbies(response.data.hobbies);
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      }
    };

    fetchHobbies();
  }, []);

  // Handle creating a new hobby
  const handleCreateHobby = async () => {
    if (!newHobby) return;

    try {
      const response = await axios.post('http://localhost:5000/createHobby', { name: newHobby });
      setHobbies([...hobbies, response.data.hobby]);
      setNewHobby('');
    } catch (error) {
      console.error('Error creating hobby:', error);
    }
  };

  // Handle deleting a hobby
  const handleDeleteHobby = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deleteHobby/${id}`);
      setHobbies(hobbies.filter(hobby => hobby._id !== id));
    } catch (error) {
      console.error('Error deleting hobby:', error);
    }
  };

  return (
    <div>
      <h2>Manage Hobbies</h2>
      
      {/* Input to create a new hobby */}
      <div>
        <input
          type="text"
          value={newHobby}
          onChange={(e) => setNewHobby(e.target.value)}
          placeholder="Enter hobby name"
        />
        <button onClick={handleCreateHobby}>Create Hobby</button>
      </div>
      
      {/* List of hobbies */}
      <div>
        {hobbies.map(hobby => (
          <div key={hobby._id}>
            <h3>{hobby.name}</h3>
            <button onClick={() => handleDeleteHobby(hobby._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HobbyManager;
