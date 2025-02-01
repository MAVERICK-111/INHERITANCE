import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import './Profile.css';

const ViewProfile = () => {
  const { isAuthenticated } = useAuth0();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/getUser/${userId}`)
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => {
          console.error('Error fetching user profile:', err);
          setProfile(null);
        });
    }
  }, [userId, isAuthenticated]);

  if (!isAuthenticated) return <p>Please log in</p>;
  if (profile === null) return <p>Loading...</p>;

  return (
    <div className="main-container">
      <div className="box-container">
        <div className="box1">
          <img
            src={profile.profilePicture || "/api/placeholder/128/128"}
            alt="Profile"
          />
          <h2>{profile.username || "Username not set"}</h2>
        </div>
        <div className="box2">
          <div>
            <p>Email: {profile.email}</p>
            <p>Age: {profile.age}</p>
            <p>Member Since: {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewProfile;