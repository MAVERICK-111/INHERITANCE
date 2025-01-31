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
    const res = await fetch(
      `http://localhost:5000/api/users/updateUser/${user.sub}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      }
    );
    const data = await res.json();
    setProfile(data);
    setEditing(false);
  };

  if (!isAuthenticated) return <p>Please log in</p>;
  if (profile === null) return <p>Loading...</p>;

  return (
    <div className="main-container">
      <div className="box-container">
        <div className="box1" style={{ 
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "white",
          position: "relative",
          height: "100%",
          flex: "1",
        }}>
          <img
            src={profile.profilePicture || "/api/placeholder/128/128"}
            alt="Profile"
            style={{
              width: "100%", // Make the image take up 100% of the width of the container
              height: "auto", // Automatically adjust height to maintain aspect ratio
              maxWidth: "250px", // Set a maximum width to keep it contained within the box
              maxHeight: "250px", // Set a maximum height to prevent it from becoming too large
              borderRadius: "15px",
              objectFit: "cover", // Ensure the image doesn't stretch or distort
              marginBottom: "15px"
            }}
          />
          <h2 style={{ 
            color: "#333",
            fontSize: "1.2rem",
            fontWeight: "500",
            marginTop: "5px",
            marginBottom: "10px"
          }}>
            {profile.username || "Username not set"}
          </h2>
        </div>

        <div className="box2" style={{ 
          borderRadius: "20px",
          padding: "30px",
          backgroundColor: "white",
          flex: "1",
          height: "100%",
        }}>
          {editing ? (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    marginBottom: "15px",
                  }}
                />
                <input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    marginBottom: "15px",
                  }}
                />
                <input
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder="Profile Picture URL"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleSave}
                  style={{
                    flex: "1",
                    padding: "8px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    flex: "1",
                    padding: "8px",
                    backgroundColor: "#f0f0f0",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <p style={{ color: "#666", marginBottom: "5px", fontSize: "0.9rem" }}>Email</p>
                  <p style={{ color: "#333" }}>{profile.email}</p>
                </div>
                <div>
                  <p style={{ color: "#666", marginBottom: "5px", fontSize: "0.9rem" }}>Age</p>
                  <p style={{ color: "#333" }}>{profile.age}</p>
                </div>
                <div>
                  <p style={{ color: "#666", marginBottom: "5px", fontSize: "0.9rem" }}>Member Since</p>
                  <p style={{ color: "#333" }}>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "20px"
                }}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
