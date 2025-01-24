import React, { useState, useEffect } from "react";
import axios from "axios";
import './Hobbies.css';
import HobbyChat from '../components/HobbyChat';

const Hobbies = () => {
    const [hobbies, setHobbies] = useState([]);
    const [newHobby, setNewHobby] = useState("");
    const [selectedHobby, setSelectedHobby] = useState(null);

    useEffect(() => {
        // Fetch hobbies from the backend
        axios.get('http://localhost:5000/api/hobbies')
            .then((response) => {
                if (response.data.success) {
                    setHobbies(response.data.hobbies.map(hobby => hobby.name));
                }
            })
            .catch((error) => console.error('Error fetching hobbies:', error));
    }, []);

    const handleAddHobby = () => {
        if (newHobby.trim() !== "") {
            axios.post('http://localhost:5000/api/createHobby', { name: newHobby })
                .then((response) => {
                    if (response.data.success) {
                        setHobbies([...hobbies, response.data.hobby.name]);
                        setNewHobby("");
                    }
                })
                .catch((error) => console.error('Error adding hobby:', error));
        }
    };

    return (
        <div className="hobbies-app">
      <h1>Enter your favorite hobby</h1>
      <div className="hobby-input">
        <input
          type="text"
          placeholder="Enter hobby..."
          value={hobby}
          onChange={(e) => setHobby(e.target.value)}
        />
        <button onClick={handleAddHobby}>Add Hobby</button>
      </div>
      <div className="hobby-grid">
        {hobbies.map((h, index) => (
          <div key={index} className="hobby-block">
            <div className="hobby-icon">🎨</div> {/* You can replace with any icon */}
            <div className="hobby-name">{h}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Hobbies;
