import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "./chatwindow.css";

const UserList = ({ onSelectUser }) => {
  const { user, isAuthenticated } = useAuth0();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`http://localhost:5000/api/users/getAllUsers/${user.sub}`)
        .then((res) => setUsers(res.data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [user, isAuthenticated]);

  const filteredUsers = users.filter((u) => {
    const userNameOrEmail = u.username || u.email;
    return userNameOrEmail.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!isAuthenticated) return <p>Please log in</p>;

  return (
    <div className="user-list">
      <h2>Select a user to chat with:</h2>
      {/* Search bar for filtering threads */}
      <div className='user-search-bar'>
            <input 
              type="text" 
              placeholder="Connect With..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
      </div>
      <ul>
        {filteredUsers.map((u) => (
          <li key={u.auth0Id} onClick={() => onSelectUser(u)} style={{ cursor: "pointer" }}>
            {u.username || u.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;