// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import AMA from "./pages/AMA";
import Hobbies from "./pages/Hobbies";
import Alumni from "./pages/Alumni";
import Leaderboard from "./pages/Leaderboard";
import Request from "./pages/Request";
import Messages from "./pages/Messages";
import Noticeboard from "./pages/Noticeboard";
import HobbyManager from "./components/HobbyManager"; // Import HobbyManager

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Default Landing Page */}
          <Route path="/home" element={<Home />} /> {/* Home Page */}
          <Route path="/AMA" element={<AMA />} /> {/* AMA Page */}
          <Route path="/Hobbies" element={<Hobbies />} /> {/* Hobbies Page */}
          <Route path="/Alumni" element={<Alumni />} /> {/* Alumni Page */}
          <Route path="/Leaderboard" element={<Leaderboard />} /> {/* Leaderboard Page */}
          <Route path="/Request" element={<Request />} /> {/* Request Page */}
          <Route path="/Messages" element={<Messages />} /> {/* Messages Page */}
          <Route path="/Noticeboard" element={<Noticeboard />} /> {/* Noticeboard Page */}
          <Route path="/hobby-manager" element={<HobbyManager />} /> {/* Hobby Manager Page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
