import React, { useState } from "react";
import './Alumni.css'; 

const Alumni = () => {
    // State to store alumni data
    const [alumniData, setAlumniData] = useState([]);
    const [name, setName] = useState("");
    const [info, setInfo] = useState("");

    // Function to handle form submission
    const handleAddAlumni = (e) => {
        e.preventDefault();

        if (name.trim() && info.trim()) {
            setAlumniData([...alumniData, { name, info }]);
            setName("");
            setInfo("");
        } else {
            alert("Please fill in both fields.");
        }
    };

    return (
        <div className="Alumni_container">
            <h1>Alumni Page</h1>
            
            
            {/* Form to add alumni */}
            <form onSubmit={handleAddAlumni} className="alumni-form">
                <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter info"
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                />
                <button type="submit">Add Alumni</button>
            </form>

            {/* Alumni Boxes */}
            <div className="alumni-list">
                {alumniData.map((alumni, index) => (
                    <div className="alumni-box" key={index}>
                        <h3>{alumni.name}</h3>
                        <p>{alumni.info}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Alumni;
