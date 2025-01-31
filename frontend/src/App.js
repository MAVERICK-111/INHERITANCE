import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Header from './components/Header';
import Landingpage from './pages/LandingPage';
import Homepage from './pages/Homepage';
import AMA from './pages/AMA';
import Hobbies from './pages/Hobbies';
import Profile from './pages/Profile';
import Alumni from './pages/Alumni'; // Import Alumni page
//import Request from './pages/Request';
import Messages from './pages/Messages';
import Noticeboard from './pages/Noticeboard';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import ViewProfile from "./pages/ViewProfile";

//import { AuthButtons } from './components/AuthButtons';

const domain = "dev-ucsp4ge1ss5vocyz.us.auth0.com";
const clientId = "W1Rcqbhv7XDLggkVn8K6Po4aJUHTqVCz";

function App() {
  const location = useLocation();
  const hideHeader = location.pathname === "/"; // Exclude Landing Page

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

          {/* Protected Routes */}
          <Route path="/Homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/viewprofile/:userId" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
          <Route path="/AMA" element={<ProtectedRoute><AMA /></ProtectedRoute>} />
          <Route path="/Hobbies" element={<ProtectedRoute><Hobbies /></ProtectedRoute>} />
          <Route path="/Alumni" element={<ProtectedRoute><Alumni /></ProtectedRoute>} /> {/* Alumni Page */}
          {/*<Route path="/Request" element={<ProtectedRoute><Request /></ProtectedRoute>} />*/}
          <Route path="/Messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/Noticeboard" element={<ProtectedRoute><Noticeboard /></ProtectedRoute>} />
          
        </Routes>
      </div>
    </Auth0Provider>
  );
}

export default App;