// src/components/Header.js
import React from 'react';
import './Header.css'; 
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';  // Import the useAuth0 hook

const LogoutButton = () => {
  const { logout } = useAuth0();  // Access the logout function from useAuth0
  
  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

function Header() {
  return (
    <header>
      <div className="Top_section">
        <div className="Logo">
          <Link to="/homepage">Logo</Link></div>
        <div className="Username">
          <Link to="/profile">Profile</Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

export default Header;
