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
            <i
              class="bi bi-house-door-fill"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            Home
          </Link>
        </li>

        {/* ปุ่ม Dashboard */}
        <li>
          <Link
            to="/dashboard"
            className={`menu-item ${tab === "dashboard" ? "active" : ""}`}
            onClick={() => setTab("dashboard")}
          >
            <i
              className="fa fa-pie-chart"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            Dashboard
          </Link>
        </li>

        {/* ปุ่ม Banner Management */}
        <li>
          <Link
            to="/bannermanagement"
            className={`menu-item ${
              tab === "bannermanagement" ? "active" : ""
            }`}
            onClick={() => setTab("bannermanagement")}
          >
            <i
              class="bi bi-window-stack"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
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
            <i
              class="bi bi-card-checklist"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            Provider Approve
          </Link>
        </li>

        {/* ปุ่ม Provider Management */}
        <li>
          <Link
            to="/providermanagement"
            className={`menu-item ${
              tab === "providermanagement" ? "active" : ""
            }`}
            onClick={() => setTab("providermanagement")}
          >
            <i
              class="bi bi-person-vcard"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
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
            <i
              class="bi bi-file-person-fill"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            User Management
          </Link>
        </li>

        {/* ปุ่ม Admin Management */}
        <li>
          <Link
            to="/admin-management"
            className={`menu-item ${
              tab === "admin-management" ? "active" : ""
            }`}
            onClick={() => setTab("admin-management")}
          >
            <i
              class="bi bi-person-lines-fill"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            Admin Management
          </Link>
        </li>

        {/* ปุ่ม Order Management */}
        <li>
          <Link
            to="/order-management"
            className={`menu-item ${
              tab === "order-management" ? "active" : ""
            }`}
            onClick={() => setTab("order-management")}
          >
            <i
              class="bi bi-clipboard-data-fill"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            Order Management
          </Link>
        </li>

        {/* ปุ่ม Review Management */}
        <li>
          <Link
            to="/reviewmanagement"
            className={`menu-item ${
              tab === "reviewmanagement" ? "active" : ""
            }`}
            onClick={() => setTab("reviewmanagement")}
          >
            <i
              class="bi bi-bookmark-star-fill"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            Review Management
          </Link>
        </li>

        {/* ปุ่ม Vehicle Management */}
        <li>
          <Link
            to="/vehiclemanagement"
            className={`menu-item ${
              tab === "vehiclemanagement" ? "active" : ""
            }`}
            onClick={() => setTab("vehiclemanagement")}
          >
            <i
              class="bi bi-bus-front"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            Vehicle Management
          </Link>
        </li>

        {/* ปุ่ม Distance Management */}
        <li>
          <Link
            to="/distancemanagement"
            className={`menu-item ${
              tab === "distancemanagement" ? "active" : ""
            }`}
            onClick={() => setTab("distancemanagement")}
          >
            <i
              class="bi bi-map"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            Distance Management
          </Link>
        </li>

        {/* ปุ่ม Price Management */}
        <li>
          <Link
            to="/pricemanagement"
            className={`menu-item ${tab === "pricemanagement" ? "active" : ""}`}
            onClick={() => setTab("pricemanagement")}
          >
            <i
              class="bi bi-currency-dollar"
              style={{ marginRight: "10px", fontSize: "24px" }}
            ></i>
            Price Management
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
