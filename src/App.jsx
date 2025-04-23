import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./App.css";

import Login from "./components/LOGIN/Login";

import LAYOUT from "./Components/LAYOUT/Layout/Layout";

/* import PAGES */
import Home from "./Components/PAGES/HOME/Home";
import BannerManagement from "./Components/PAGES/BANNER/BannerManagement";
import ProviderApprove from "./Components/PAGES/providerApprove/providerApprove";
import ProviderApproveDetail from "./Components/PAGES/providerApprove/providerApproveDetail/providerApproveDetail";
import ProviderManagement from "./Components/PAGES/providerManagement/providerManagement";
import ProviderDetail from "./Components/PAGES/providerManagement/providerDetail/providerDetail";
import UserManagement from "./Components/PAGES/userManagement/userManagement";
import UserManagementDetail from "./Components/PAGES/userManagement/userManagementDetail/userManagementDetail";
import OrderDetail from "./Components/PAGES/orderdetail/orderdetail";
import OrderManagement from "./Components/PAGES/ordermanage/ordermanage";
import AdminManagement from "./Components/PAGES/adminmanage/adminmanage";
import AdminEdit from "./Components/PAGES/adminedit/adminedit";
import ReviewManagement from "./Components/PAGES/review/review";
import CheckReview from "./Components/PAGES/reviewdetail/reviewdetail";
import VehicleManagement from "./Components/PAGES/vehical/vehicleManagement";
import Dashboard from "./Components/PAGES/Dashboard/Dashboard";
import Distance from "./Components/PAGES/Distance/Distance";
import Price from "./Components/PAGES/Price/Price";


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
    <BrowserRouter>
      {isLoggedIn && (
        <LAYOUT tab={tab} setTab={setTab} setToken={handleLogout} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/bannermanagement"
          element={isLoggedIn ? <BannerManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/providerapprove"
          element={isLoggedIn ? <ProviderApprove /> : <Navigate to="/" />}
        />
        <Route
          path="/providerapprovedetail/:id"
          element={isLoggedIn ? <ProviderApproveDetail /> : <Navigate to="/" />}
        />
        <Route
          path="/providermanagement"
          element={isLoggedIn ? <ProviderManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/providerdetail/:id"
          element={isLoggedIn ? <ProviderDetail /> : <Navigate to="/" />}
        />
        <Route
          path="/usermanagement"
          element={isLoggedIn ? <UserManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/userManagement/:id"
          element={isLoggedIn ? <UserManagementDetail /> : <Navigate to="/" />}
        />
        <Route
          path="/order-management"
          element={isLoggedIn ? <OrderManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/orders/:orderId" // เปลี่ยนจาก /orderdetail/:orderId
          element={isLoggedIn ? <OrderDetail /> : <Navigate to="/" />}
        />
        <Route
          path="/admin-management"
          element={isLoggedIn ? <AdminManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/admin-edit/:adminId"
          element={isLoggedIn ? <AdminEdit /> : <Navigate to="/" />}
        />
        <Route
          path="/reviewmanagement"
          element={isLoggedIn ? <ReviewManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/reviewdetail/:id"
          element={isLoggedIn ? <CheckReview /> : <Navigate to="/" />}
        />
        <Route
          path="/vehiclemanagement"
          element={isLoggedIn ? <VehicleManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/distancemanagement"
          element={isLoggedIn ? <Distance /> : <Navigate to="/" />}
        />
        <Route
          path="/pricemanagement"
          element={isLoggedIn ? <Price /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
