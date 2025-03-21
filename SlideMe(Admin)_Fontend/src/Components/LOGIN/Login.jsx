import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // สถานะการแสดงรหัสผ่าน
  const navigate = useNavigate();

  const loginClick = () => {
    axios
      .post("http://localhost:3000/users/login", { username, password })
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token", token);
        onLogin();
        navigate("/home");
      })
      .catch(() => {
        alert("Login failed");
      });
  };

  const whoAmIClick = () => {
    axios.get('http://localhost:3000/users/verify',{ headers: { Authorization: `Bearer ${token}` }}).then((res) => {
      alert(res.data.role);
    }).catch( (err) => {
      setToken('');
    })
  }

  const ListofUsersClick = () => {
    axios
      .get("http://localhost:3000/users/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const userRole = res.data.role;
        if (userRole.toLowerCase() === "worker") {
          alert("Unauthorized");
          setUsers([]); // ไม่โหลด Users ถ้าเป็น Worker
          return;
        }
  
        axios
          .get("http://localhost:3000/users/list", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setUsers(res.data.users);
          })
          .catch((err) => {
            console.error(err);
            alert(
              `Error: ${err.response?.data?.message || "Unauthorized or session expired"}`
            );
          });
      })
      .catch((err) => {
        console.error(err);
        alert("Unauthorized");
        setUsers([]);
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src={"/logo-head.png"} alt="Logo" />
        </div>
        <p style={{ fontSize: "14px", color: "#949494" }}>
          กรุณากรอกอีเมลและรหัสผ่านของคุณเพื่อดำเนินการต่อ
        </p>

        <label className="account-name">Account Name</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

<label className="account-name">Password</label>
<div className="password-container">
  <button
    type="button"
    className="show-password-btn"
    onClick={() => setShowPassword(!showPassword)} // เปลี่ยนสถานะของการแสดงรหัสผ่าน
  >
    {showPassword ? "Hide" : "Show"}Password
  </button>
  <input
    type={showPassword ? "text" : "password"} // สลับระหว่างการแสดงหรือซ่อนรหัสผ่าน
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
</div>

        <button className="login" onClick={loginClick}>
          Login
        </button>

        <a href="#" className="forgot-password">
          Forgot Password?
        </a>
      </div>
    </div>
  );
}

export default Login;
