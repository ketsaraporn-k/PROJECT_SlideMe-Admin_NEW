import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./adminedit.css";

const EditAdmin = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/admins/${adminId}`)
      .then((response) => {
        setAdmin({ ...response.data, password: "", confirm_password: "" });
      })
      .catch((error) => console.error("Error fetching admin data:", error));
  }, [adminId]);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin.password && admin.password !== admin.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.put(`http://localhost:3000/api/admins/${adminId}`, { // แก้ไขตรงนี้
        first_name: admin.first_name,
        last_name: admin.last_name,
        phone: admin.phone,
        email: admin.email,
        password: admin.password || undefined,
      });
      navigate("/admin-management");
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  return (
    <div className="edit-admin-container">
      <h2 className="edit-admin-title">Edit Admin Management</h2>
      <form className="edit-admin-form" onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={admin.first_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={admin.last_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={admin.phone}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={admin.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={admin.password}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirm_password"
            value={admin.confirm_password}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="edit-admin-save-btn">
          บันทึก
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin-management")}
          className="edit-admin-cancel-btn"
        >
          ยกเลิก
        </button>
      </form>
    </div>
  );
};

export default EditAdmin;