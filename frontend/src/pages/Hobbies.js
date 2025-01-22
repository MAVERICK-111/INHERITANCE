import React, { useState } from "react";
// import './Homepage.css';
import './Hobbies.css';
import ChatSystem from '../components/ChatSystem';  // Import the ChatSystem component

const Hobbies = () => {
    // Store hobbies
    const [hobbies, setHobbies] = useState([]);
    // Store the typed string for a new hobby
    const [newHobby, setNewHobby] = useState("");
    // Store the selected hobby for chat
    const [selectedHobby, setSelectedHobby] = useState(null);

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

    // Handle selecting a hobby to start the chat
    const selectHobbyForChat = (hobby) => {
        setSelectedHobby(hobby);
    };

    return (
        <div className="hobbies_container">
            <div className="top-hobbies">LOGO</div>
            <div className="bottom">
                <div className="left">
                    {/* Input for new hobby */}
                    <div className="hobby-input-container">
                       <input 
                            type="text" 
                            value={newHobby} 
                            onChange={handleInputChange} 
                           placeholder="Enter a new hobby" 
                            className="hobby-input"
                            onKeyDown={(e) =>{
                                if (e.key == "Enter"){
                                    addHobby();
                                }
                            }}
                        />
                        <button onClick={addHobby} className="add-hobby-button">
                            Add Hobby
                        </button>
                    </div>

                    {/* List of hobbies */}
                    <div className="hobbies-list">
                        {hobbies.map((hobby, index) => (
                            <div 
                                key={index} 
                                className="hobby-box" 
                                onClick={() => selectHobbyForChat(hobby)}
                            >
                                {hobby}
                            </div>
                        ))}
                    </div>


                </div>

                <div className="right">
                    {/* Display the ChatSystem component when a hobby is selected */}
                    {selectedHobby && <ChatSystem selectedHobby={selectedHobby} />}
                </div>
            </div>           
            
        </div>
    );
};

export default Hobbies;
