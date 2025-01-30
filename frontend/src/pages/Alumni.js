import React, { useState } from 'react';
import './Alumni.css';

const Alumni = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alumni, setAlumni] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    company: '',
    role: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlumni(prev => [...prev, formData]);
    setShowForm(false);
    setFormData({ name: '', batch: '', company: '', role: '', email: '' });
  };

  const filteredAlumni = alumni.filter(person =>
    person.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="alumni-container">
      <div className="content-wrapper">
        <h1 className="main-title">Alumni Directory</h1>
        
        <div className="button-container">
          <button 
            onClick={() => setShowForm(true)}
            className="register-button"
          >
            Register as Alumni
          </button>
        </div>

        {showForm ? (
          <div className="form-card">
            <form onSubmit={handleSubmit} className="registration-form">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className="form-input"
              />
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                placeholder="Batch Year"
                required
                className="form-input"
              />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company"
                required
                className="form-input"
              />
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Role"
                required
                className="form-input"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="form-input"
              />
              <div className="button-group">
                <button type="submit" className="submit-button">Submit</button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="search-card">
            <input
              type="text"
              placeholder="Search by company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        <div className="alumni-grid">
          {filteredAlumni.map((person, index) => (
            <div key={index} className="alumni-card">
              <h2 className="alumni-name">{person.name}</h2>
              <div className="alumni-details">
                <p><span>Batch:</span> {person.batch}</p>
                <p><span>Company:</span> {person.company}</p>
                <p><span>Role:</span> {person.role}</p>
                <p><span>Email:</span> {person.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alumni;