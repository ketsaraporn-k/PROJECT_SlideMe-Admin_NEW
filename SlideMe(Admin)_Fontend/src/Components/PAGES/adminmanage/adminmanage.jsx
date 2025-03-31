import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./adminmanage.css";

const AdminManagement = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(2); // แสดง 2 รายการต่อหน้า

  useEffect(() => {
    fetchAdmins();
  }, [currentPage]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admins?page=${currentPage}&limit=${adminsPerPage}`
      );
      if (response.status !== 200) {
        throw new Error(`Failed to fetch admins: ${response.status}`);
      }
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      alert("Failed to load admin list. Please try again.");
    }
  };

  const handleEdit = (adminId) => {
    navigate(`/admin-edit/${adminId}`); // ✅ ลิงก์ไปหน้า Edit พร้อมส่ง adminId
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    try {
      let response;
      response = await axios.post("http://localhost:3000/api/admins", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Failed to save admin: ${response.status}`);
      }
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      fetchAdmins(); // อัพเดตข้อมูลในตาราง
    } catch (error) {
      console.error("Error saving admin:", error);
      alert("Failed to save admin. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/admins/${id}`
        );
        if (response.status !== 200) {
          throw new Error(`Failed to delete admin: ${response.status}`);
        }
        fetchAdmins(); // อัพเดตข้อมูลในตารางหลังการลบ
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Failed to delete admin. Please try again.");
      }
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-management-container">
      <h2 className="admin-management-title">Admin Management</h2>
      {/* ฟอร์มเพิ่ม Admin */}
      <form className="admin-management-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Admin</button>
      </form>
      <table className="admin-management-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="admin-management-table-row">
              <td>{admin.first_name}</td>
              <td>{admin.last_name}</td>
              <td>{admin.email}</td>
              <td>{admin.phone}</td>
              <td>
              <button onClick={() => handleEdit(admin.id)}>Edit</button>
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManagement;
