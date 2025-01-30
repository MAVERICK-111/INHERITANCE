import React from 'react';
import './Header.css'; 
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import logo from './logo.jpg';

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <Link to="/" onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </Link>
  );
};

function Header() {
  return (
    <header>
      <div className="Top_section">
        <div className="Logo">
          <Link to="/Homepage">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
        </div>
        <div className="Username">
          <Link to="/profile">Profile</Link>
          <Link to="/Homepage">Home</Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

export default Header;