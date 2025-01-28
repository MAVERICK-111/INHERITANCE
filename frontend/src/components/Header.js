// src/components/Header.js
import React from 'react';
import './Header.css'; 
import { Link } from "react-router-dom";



function Header() {
 
  return (
    <header>
      <div className="Top_section">
        <div className="Logo">
          <Link to="/homepage">Logo</Link></div>
        <div className="Username">
          <Link to="/profile">Profile</Link>
        </div>
        
      </div>
    </header>
  );
}

export default Header;
