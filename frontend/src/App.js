import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import Homepage from "./pages/Homepage";
import Home from "./pages/Home";
import AMA from "./pages/AMA";
import Hobbies from "./pages/Hobbies";
import Alumni from "./pages/Alumni";
import Request from "./pages/Request";
import Messages from "./pages/Messages";
import Noticeboard from "./pages/Noticeboard";
import HobbyManager from "./components/HobbyManager"; // Import HobbyManager
import Profile from "./pages/Profile";

import "./App.css";

function AppContent() {
  const location = useLocation();

  // Define routes where Header should not appear
  const hideHeaderRoutes = ["/", "/login", "/profile", "/AMA"];

  return (
    <div>
      {/* Conditionally render the Header */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/AMA" element={<AMA />} />
        <Route path="/Hobbies" element={<Hobbies />} />
        <Route path="/Alumni" element={<Alumni />} />
        <Route path="/Request" element={<Request />} />
        <Route path="/Messages" element={<Messages />} />
        <Route path="/Noticeboard" element={<Noticeboard />} />
        <Route path="/hobby-manager" element={<HobbyManager />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

