import React, { useEffect } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";

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

const LandingPage = () => {
  const domain = "dev-ucsp4ge1ss5vocyz.us.auth0.com"; // Replace with your Auth0 domain
  const clientId = "W1Rcqbhv7XDLggkVn8K6Po4aJUHTqVCz"; // Replace with your actual Auth0 client ID
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  // If the user is authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Homepage"); // Redirect to homepage if authenticated
    }
  }, [isAuthenticated, navigate]);

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/Homepage`,
      }}
    >
      <div className="landingpage">
        <div className="top">
          <div className="landingheader">
            <h2>About Us | Contact Us | Report Issue</h2>
          </div>

          <div className="mainbox">
            <div className="logobox">
              LOGO
            </div>
            <div className="loginbox">
              {/* Link to login page */}
              {!isAuthenticated ? (
                <LoginButton />
              ) : (
                <div>
                  <LogoutButton />
                  <Profile />
                </div>
              )}
            </div>
          </div>
          <div className="bottom">

          </div>
        </div>

        

        
      </div>
    </Auth0Provider>
  );
};

export default LandingPage;