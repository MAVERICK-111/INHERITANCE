import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Header from './components/Header';
import Landingpage from './pages/LandingPage';
import LoginPage from './pages/Login';
import Homepage from './pages/Homepage';
import Home from './pages/Home';
import AMA from './pages/AMA';
import Hobbies from './pages/Hobbies';
import Profile from './pages/Profile';
import Alumni from './pages/Alumni'; // Import Alumni page
//import Request from './pages/Request';
import Messages from './pages/Messages';
import Noticeboard from './pages/Noticeboard';
import HobbyChat from './components/HobbyChat';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';


const domain = "dev-ucsp4ge1ss5vocyz.us.auth0.com"; // Replace with your Auth0 domain
const clientId = "W1Rcqbhv7XDLggkVn8K6Po4aJUHTqVCz"; // Replace with your actual Auth0 client ID

function App() {
  const location = useLocation();
  const hideHeader = location.pathname === "/" || location.pathname === "/profile"; // Exclude header on Homepage and Landing Page

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/Homepage`,
      }}
    >
      <div>
        {!hideHeader && <Header />} 
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<LoginPage />} />  

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/AMA" element={<ProtectedRoute><AMA /></ProtectedRoute>} />
          <Route path="/Hobbies" element={<ProtectedRoute><Hobbies /></ProtectedRoute>} />
          <Route path="/Alumni" element={<ProtectedRoute><Alumni /></ProtectedRoute>} /> {/* Alumni Page */}
          {/*<Route path="/Request" element={<ProtectedRoute><Request /></ProtectedRoute>} />*/}
          <Route path="/Messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/Noticeboard" element={<ProtectedRoute><Noticeboard /></ProtectedRoute>} />
          <Route path="/hobby-chat" element={<ProtectedRoute><HobbyChat /></ProtectedRoute>} />
          
        </Routes>
      </div>
    </Auth0Provider>
  );
}

export default App;

