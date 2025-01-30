import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", age: "", profilePicture: "" });

  // Fetch the profile when the component mounts
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Sending auth0Id to backend:", user.sub); // Debugging log
      // Fetch the profile data when the user is authenticated
      fetch(`http://localhost:5000/api/users/getUser/${user.sub}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data); // Set profile to the fetched data (or dummy data if no profile exists)
          setFormData({
            username: data.username || "",
            age: data.age || "",
            profilePicture: data.profilePicture || ""
          });
        })
        .catch((error) => {
          console.error(error);
          setProfile(null);
        });
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
    setProfile(data); // Update profile with new data
    setEditing(false); // Exit edit mode
  };

  if (!isAuthenticated) return <p>Please log in</p>;

  // Show loading message until profile data is available
  if (profile === null) return <p>Loading...</p>;

  return (
    <div>
      {editing ? (
        <div>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
          />
          <input
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            placeholder="Profile Picture URL"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <img
            src={profile.profilePicture || "default-avatar.png"}
            alt="Profile"
            width="100"
          />
          <p>Email: {profile.email}</p>
          <p>Username: {profile.username}</p>
          <p>Age: {profile.age}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
