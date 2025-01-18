import React from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./login.css";

// LoginButton Component
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

// LogoutButton Component
const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

// Profile Component
const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <div>
        <h2>Welcome, {user.name}</h2>
        <p>Email: {user.email}</p>
      </div>
    )
  );
};

// LoginPage Component
const LoginPage = () => {
  const domain = "dev-ucsp4ge1ss5vocyz.us.auth0.com"; // Replace with your actual Auth0 domain
  const clientId = "W1Rcqbhv7XDLggkVn8K6Po4aJUHTqVCz"; // Replace with your actual Auth0 client ID
  const navigate = useNavigate(); // Navigate to another page after login

  const { isAuthenticated } = useAuth0();

  // If the user is authenticated, redirect to home page
  if (isAuthenticated) {
    navigate("/Homepage"); // Replace "/home" with your desired route
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <div className="container">
        <h1>Login with Auth0</h1>
        <LoginButton />
        <LogoutButton />
        <Profile />
      </div>
    </Auth0Provider>
  );
};

export default LoginPage;