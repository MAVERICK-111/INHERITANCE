// In App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Header from './components/Header';
import Landingpage from './pages/LandingPage';
import LoginPage from './pages/Login';
import Homepage from './pages/Homepage';
import Home from './pages/Home';
import AMA from './pages/AMA';
import Hobbies from './pages/Hobbies';
import Alumni from './pages/Alumni';
import Request from './pages/Request';
import Messages from './pages/Messages';
import Noticeboard from './pages/Noticeboard';
import HobbyManager from './components/HobbyManager';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

const domain = "dev-ucsp4ge1ss5vocyz.us.auth0.com"; // Replace with your Auth0 domain
const clientId = "W1Rcqbhv7XDLggkVn8K6Po4aJUHTqVCz"; // Replace with your actual Auth0 client ID

function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/Homepage`,
      }}
    >
      <div>
        <Header />
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<LoginPage />} />  {/* LoginPage should be public */}

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path="/AMA" element={<ProtectedRoute><AMA /></ProtectedRoute>} />
          <Route path="/Hobbies" element={<ProtectedRoute><Hobbies /></ProtectedRoute>} />
          <Route path="/Alumni" element={<ProtectedRoute><Alumni /></ProtectedRoute>} />
          <Route path="/Request" element={<ProtectedRoute><Request /></ProtectedRoute>} />
          <Route path="/Messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/Noticeboard" element={<ProtectedRoute><Noticeboard /></ProtectedRoute>} />
          <Route path="/hobby-manager" element={<ProtectedRoute><HobbyManager /></ProtectedRoute>} />
        </Routes>
      </div>
    </Auth0Provider>
  );
}

export default App;