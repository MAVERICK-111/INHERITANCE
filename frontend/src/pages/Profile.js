import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Profile.css";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`http://localhost:5000/api/users/getUser/${user.sub}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setFormData({
            username: data.username || "",
            age: data.age || "",
            profilePicture: data.profilePicture || "",
          });
        })
        .catch(() => setProfile(null));
    }
  }, [user, isAuthenticated]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const updatedProfile = { ...formData, email: user.email, auth0Id: user.sub };
    const res = await fetch(`http://localhost:5000/api/users/updateUser/${user.sub}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProfile),
    });
    const data = await res.json();
    setProfile(data);
    setEditing(false);
  };

  if (!isAuthenticated) return <p>Please log in</p>;
  if (profile === null) return <p>Loading...</p>;

  return (
    <div className="main-container">
      <div className="box-container">
        <div className="box1">
          <img src={profile.profilePicture || "/api/placeholder/128/128"} alt="Profile" />
          <h2>{profile.username || "Username not set"}</h2>
        </div>
        <div className="box2">
          {editing ? (
            <div>
              <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
              <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" />
              <input name="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="Profile Picture URL" />
              <button onClick={handleSave}>Save Changes</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>Email: {profile.email}</p>
              <p>Age: {profile.age}</p>
              <p>Member Since: {new Date().toLocaleDateString()}</p>
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
