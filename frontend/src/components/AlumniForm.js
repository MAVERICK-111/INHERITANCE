import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AlumniForm.css";

const AlumniForm = () => {
  const [info, setInfo] = useState('');
  const [photo, setPhoto] = useState(null);
  const [alumniList, setAlumniList] = useState([]);  // To store the list of alumni
  const [message, setMessage] = useState('');  // For error or success messages

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
      const response = await axios.post('http://localhost:5000/alumni', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setMessage('Alumni data saved successfully!');
        setAlumniList([...alumniList, { photo: `http://localhost:5000${response.data.photo}`, info }]);
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
        const response = await axios.get('http://localhost:5000/alumni');
        console.log(response.data.alumni);  // Check the value of alumni
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
          <div key={index} className="alumni-box">
            <img
              src={alumni.photo}  // This is the full URL now
              alt="Alumni"
              width="100"
              height="100"
            />
            <p>{alumni.info}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniForm;
