import React, { useState } from 'react';

function AlumniForm() {
  const [photo, setPhoto] = useState(null);
  const [info, setInfo] = useState('');

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleInfoChange = (e) => {
    setInfo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('info', info);

    for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

    try {
      const response = await fetch('/alumni', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Alumni data saved successfully!');
      } else {
        alert('Error saving alumni data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving alumni data.');
    }
  };

  return (
    <div>
      <h1>Alumni Information</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="photo">Upload your photo:</label>
        <input type="file" name="photo" id="photo" accept="image/*" onChange={handleFileChange} required />

        <label htmlFor="info">Write about yourself:</label>
        <textarea name="info" id="info" rows="4" cols="50" value={info} onChange={handleInfoChange} required></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AlumniForm;
