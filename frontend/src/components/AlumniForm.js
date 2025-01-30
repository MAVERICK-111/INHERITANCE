import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AlumniForm.css";

const AlumniForm = () => {
  const [info, setInfo] = useState('');
  const [photo, setPhoto] = useState(null);
  const [alumniList, setAlumniList] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null); // For popup

  // Handle file selection
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Handle text input change
  const handleInfoChange = (e) => {
    setInfo(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('info', info);
    formData.append('photo', photo);

    try {
      const response = await axios.post('http://localhost:5000/api/alumni', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setMessage('Alumni data saved successfully!');
        setAlumniList([...alumniList, { photo: response.data.photo, info }]);
        setInfo('');
        setPhoto(null);
      } else {
        setMessage('Error saving alumni data');
      }
    } catch (error) {
      setMessage('Error saving alumni data');
    }
  };

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alumni');
        if (response.data.success) {
          setAlumniList(response.data.alumni);
        } else {
          console.error('Failed to fetch alumni data');
        }
      } catch (error) {
        console.error('Error fetching alumni data:', error);
      }
    };

    fetchAlumni();
  }, []);

  // Function to open popup
  const openPopup = (alumni) => {
    setSelectedAlumni(alumni);
  };

  // Function to close popup
  const closePopup = () => {
    setSelectedAlumni(null);
  };

  return (
    <div>
      <div className='aluminiheader'>Alumni</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Photo:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Info:</label>
          <textarea value={info} onChange={handleInfoChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}

      <div className="alumni-box-container">
        {alumniList.map((alumni, index) => (
          <div key={index} className="alumni-box" onClick={() => openPopup(alumni)}>
            <img src={alumni.photo} alt="Alumni" />
            <p>{alumni.info}</p>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedAlumni && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <img src={selectedAlumni.photo} alt="Alumni" />
            <p>{selectedAlumni.info}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniForm;
