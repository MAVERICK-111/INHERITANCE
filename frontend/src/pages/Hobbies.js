import React, { useState } from "react"; 
import './Page.css'; 
import './Hobbies.css';

const Hobbies = () => {
    //hobbies is an empty array that stores the strings
    const [hobbies, setHobbies] = useState([]);

    //stores the typed string
    const [newHobby, setNewHobby] = useState("");

    // Function to handle input value changes
    const handleInputChange = (e) => {
        setNewHobby(e.target.value);
    };

    // Function to add a new hobby
    const addHobby = () => {
        if (newHobby.trim() !== "") { 
            setHobbies([...hobbies, newHobby]); // Add new hobby to hobbies array
            setNewHobby(""); // Clear the input field
        }
    };

    return (
        <div className="Hobbies_container">
            <div>LOGO</div>
            <br />

            <div className="hobby-input-container">
                <input 
                    type="text" 
                    value={newHobby} 
                    onChange={handleInputChange} 
                    placeholder="Enter a new hobby" 
                    className="hobby-input"
                />
                <button onClick={addHobby} className="add-hobby-button">
                    Add Hobby
                </button>
            </div>

            {/* List of hobbies */}
            <div className="hobbies-list">
                {hobbies.map((hobby, index) => (
                    <div key={index} className="hobby-box">
                        {hobby}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hobbies;
