import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./login.css"; 

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === "user" && password === "pass") {
      setMessage("Login successful!");
      setTimeout(() => {
        navigate("/"); // Navigate to the LandingPage or Home after 1s
      }, 1000);
    } else {
      setMessage("Invalid username or password!");
    }
  };

  return (
    <div className="container">
      <h2>Welcome</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="username"
            name="username"
            maxLength="20"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p id="message" style={{ color: message === "Login successful!" ? "green" : "red" }}>
          {message}
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
