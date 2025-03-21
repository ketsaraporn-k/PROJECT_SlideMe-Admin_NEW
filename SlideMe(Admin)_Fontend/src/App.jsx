import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./App.css";

import Login from "./components/LOGIN/Login";

import LAYOUT from "./Components/LAYOUT/Layout/Layout";

/* import PAGES */
import Home from "./Components/PAGES/HOME/Home";
import BannerManagement from "./Components/PAGES/BANNER/BannerManagement";




function App() {
  const [tab, setTab] = useState("home");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  // ✅ ฟังก์ชันสำหรับล็อกอิน
  const handleLogin = () => {
    const fakeToken = "your-token"; 
    localStorage.setItem("token", fakeToken);
    setToken(fakeToken);
  };

  // ✅ ฟังก์ชันสำหรับ logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <HashRouter>
      {isLoggedIn && <LAYOUT tab={tab} setTab={setTab} setToken={handleLogout} />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />} />
        <Route path="/bannermanagement" element={isLoggedIn ? <BannerManagement /> : <Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
