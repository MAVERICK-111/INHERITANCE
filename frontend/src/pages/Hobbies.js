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
        <div className="hobbies-container">
            <div className="hobbies-list">
                <input
                    type="text"
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    placeholder="Enter a new hobby"
                    className="hobby-input"
                />
                <button onClick={handleAddHobby} className="add-hobby-button">Add Hobby</button>
                {hobbies.map((hobby, index) => (
                    <div
                        key={index}
                        className={`hobby-item ${selectedHobby === hobby ? 'selected' : ''}`}
                        onClick={() => setSelectedHobby(hobby)}
                    >
                        {hobby}
                    </div>
                ))}
            </div>
            <div className="hobby-chat-container">
                {selectedHobby && <HobbyChat selectedHobby={selectedHobby} />}
            </div>
        </div>
    );
};

export default Hobbies;
