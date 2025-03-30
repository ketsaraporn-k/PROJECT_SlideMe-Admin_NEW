import "./Navber.css";
import { Link } from "react-router-dom";

function Navber({ tab, setTab, setToken }) {
  return (
    <div className="navber-container">
      <div className="sidebar-logo">
        <img src={"/logo.png"} alt="Logo" />
      </div>

      {/* ปุ่ม Home ใช้สไตล์ .menu-item และ .active */}
      <ul className="sidebar-menu">
        {/* ปุ่ม Home */}
        <li>
          <Link
            to="/home"
            className={`menu-item ${tab === "home" ? "active" : ""}`}
            onClick={() => setTab("home")}
          >
            Home
          </Link>
        </li>

        {/* ปุ่ม Banner Management */}
        <li>
          <Link
            to="/bannermanagement"
            className={`menu-item ${tab === "bannermanagement" ? "active" : ""}`}
            onClick={() => setTab("bannermanagement")}
          >
            Banner Management
          </Link>
        </li>

        {/* ปุ่ม Provider Approve */}
        <li>
          <Link
            to="/providerapprove"
            className={`menu-item ${tab === "providerapprove" ? "active" : ""}`}
            onClick={() => setTab("providerapprove")}
          >
            Provider Approve
          </Link>
        </li>
        
        {/* ปุ่ม Provider Management */}
        <li>
          <Link
            to="/providermanagement"
            className={`menu-item ${tab === "providermanagement" ? "active" : ""}`}
            onClick={() => setTab("providermanagement")}
          >
            Provider Management
          </Link>
        </li>
          
          {/* ปุ่ม User Management */}
          <li>
          <Link
            to="/usermanagement"
            className={`menu-item ${tab === "usermanagement" ? "active" : ""}`}
            onClick={() => setTab("usermanagement")}
          >
            User Management
          </Link>
        </li>


      </ul>

      {/* ปุ่ม Logout */}
      <button
        className="btn btn-danger"
        onClick={() => {
          setToken(null);
          localStorage.removeItem("token");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Navber;
