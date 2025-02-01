import React, { useEffect, useRef, useState } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
//import logo from "./vjti_logo.png";
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
      <div className="modal1-content">
        <h2>Contact Us</h2>
        
        <a href="https://www.linkedin.com/in/yash-ogale-03a30b2aa/" target="_blank" rel="noopener noreferrer"><p>Yash Ogale</p></a>
        <a href="https://www.linkedin.com/in/piyush-patil-1a7b64303/" target="_blank" rel="noopener noreferrer"><p>Piyush Patil</p></a>
        <a href="https://www.linkedin.com/in/harshogale04/" target="_blank" rel="noopener noreferrer"><p>Harsh Ogale</p></a>
        <a><p>Atharva Purushe</p></a>


        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENTID;
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
      event.preventDefault(); // Prevent the default scrolling behavior

      const scrollAmount = event.deltaY > 0 ? 100 : -100; // Scroll right for deltaY > 0, left otherwise
      let scrollLeft = imageScrollContainerRef.current.scrollLeft;
      scrollLeft += scrollAmount;

      // Animate the scrolling effect for smoother transition
      const animateScroll = () => {
        imageScrollContainerRef.current.scrollLeft = scrollLeft;
        if (scrollLeft >= imageScrollContainerRef.current.scrollWidth) {
          imageScrollContainerRef.current.scrollLeft = 0; // Loop back to start
        } else if (scrollLeft <= 0) {
          imageScrollContainerRef.current.scrollLeft = imageScrollContainerRef.current.scrollWidth; // Loop back to end
        }
      };

      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(animateScroll);
    }
  };

  // Handle Contact Us Modal toggle
  const handleContactUsClick = () => {
    setContactModalOpen(true);
  };

  const handleModalClose = () => {
    setContactModalOpen(false);
  };

  // Images array for dynamic scrolling
  const images = [one, two, three, four, five, six];

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
              </a> | 
              <a href="#" onClick={handleContactUsClick}>
                CONTACT US
              </a>
            </h2>
          </div>
          <div className="mainbox">
            <div className="logobox2345"><img src={logo1} alt="College Logo" className="scroll-image" /></div>
            <div className="tagline"> <i>Connecting Students, Empowering Futures.</i></div>
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
            style={{ overflowX: "auto", display: "flex", scrollBehavior: "smooth" }}
          >
            {/* Dynamically create the scrollable images */}
            <div className="scroll-images">
              {images.map((image, index) => (
                <img key={index} src={image} alt={`College Logo ${index + 1}`} className="scroll-image" />
              ))}
            </div>
            {/* Duplicating the same set to create the loop effect */}
            <div className="scroll-images">
              {images.map((image, index) => (
                <img key={index + 6} src={image} alt={`College Logo ${index + 1}`} className="scroll-image" />
              ))}
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