import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const UserList = ({ onSelectUser }) => {
  const { user, isAuthenticated } = useAuth0();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`http://localhost:5000/api/users/getAllUsers/${user.sub}`)
        .then((res) => setUsers(res.data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated) return <p>Please log in</p>;

  return (
    <div>
      <h2>Select a user to chat with:</h2>
      <ul>
        {users.map((u) => (
          <li key={u.auth0Id} onClick={() => onSelectUser(u)} style={{ cursor: "pointer" }}>
            {u.username || u.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;