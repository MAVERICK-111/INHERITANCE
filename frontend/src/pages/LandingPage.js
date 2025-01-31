import React, { useEffect, useRef, useState } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import logo from "./vjti_logo.png";
import logo1 from "./LOGO2.jpg";
import one from "./1 (1).png";
import two from "./1 (2).png";
import three from "./1 (3).png";
import four from "./1 (4).png";
import five from "./1 (5).png";
import six from "./1 (6).png";

// LoginButton Component
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          connection: "google-oauth2", // Forces Google login
        })
      }
    >
      Login
    </button>
  );
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

// Contact Us Modal Component
const ContactUsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="contact-modal">
      <div className="modal-content">
        <h2>Contact Us</h2>
        <p>YASH OGALE</p>
        <p>PIYUSH PATIL</p>
        <p>HARSH OGALE</p>
        <p>ATHARVA PURUSHE</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const domain = "dev-ucsp4ge1ss5vocyz.us.auth0.com"; // Replace with your Auth0 domain
  const clientId = "W1Rcqbhv7XDLggkVn8K6Po4aJUHTqVCz"; // Replace with your actual Auth0 client ID
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const imageScrollContainerRef = useRef(null);
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  // If the user is authenticated, redirect to homepage
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Homepage"); // Redirect to homepage if authenticated
    }
  }, [isAuthenticated, navigate]);

  // Handle mouse wheel scroll horizontally
  const handleWheel = (event) => {
    if (imageScrollContainerRef.current) {
      const scrollAmount = event.deltaY > 0 ? 100 : -100; // Scroll right if wheel is scrolled down, left if up
      imageScrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Check if scroll reached the end or the beginning
      const scrollLeft = imageScrollContainerRef.current.scrollLeft;
      const maxScrollLeft = imageScrollContainerRef.current.scrollWidth - imageScrollContainerRef.current.clientWidth;

      // Reset scroll position when reaching the end or beginning
      if (scrollLeft >= maxScrollLeft) {
        imageScrollContainerRef.current.scrollLeft = 0;
      } else if (scrollLeft <= 0) {
        imageScrollContainerRef.current.scrollLeft = maxScrollLeft;
      }
    }
  };

  // Handle Contact Us Modal toggle
  const handleContactUsClick = () => {
    setContactModalOpen(true);
  };

  const handleModalClose = () => {
    setContactModalOpen(false);
  };

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
          <h2>
            <a href="https://github.com/MAVERICK-111/INHERITANCE" target="_blank" rel="noopener noreferrer">
              ABOUT US
            </a> || 
            <a href="#" onClick={handleContactUsClick}>
              CONTACT US
            </a>
          </h2>
        </div>
          <div className="mainbox">
            <div className="logobox2345"><img src={logo1} alt="College Logo" className="scroll-image" /></div>
            <div className="loginbox">
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

          {/* Horizontal Scrollable Images */}
          <div
            className="image-scroll-container"
            ref={imageScrollContainerRef}
            onWheel={handleWheel}
          >
            {/* Duplicating images to create the loop effect */}
            <div className="scroll-images">
              <img src={one} alt="College Logo" className="scroll-image" />
              <img src={two} alt="College Logo" className="scroll-image" />
              <img src={three} alt="College Logo" className="scroll-image" />
              <img src={four} alt="College Logo" className="scroll-image" />
              <img src={five} alt="College Logo" className="scroll-image" />
              <img src={six} alt="College Logo" className="scroll-image" />
            </div>
            {/* Duplicating the same set to create the loop effect */}
            <div className="scroll-images">
              <img src={one} alt="College Logo" className="scroll-image" />
              <img src={two} alt="College Logo" className="scroll-image" />
              <img src={three} alt="College Logo" className="scroll-image" />
              <img src={four} alt="College Logo" className="scroll-image" />
              <img src={five} alt="College Logo" className="scroll-image" />
              <img src={six} alt="College Logo" className="scroll-image" />
            </div>
          </div>
        </div>

        {/* Contact Us Modal */}
        <ContactUsModal isOpen={isContactModalOpen} onClose={handleModalClose} />
      </div>
    </Auth0Provider>
  );
};

export default LandingPage;