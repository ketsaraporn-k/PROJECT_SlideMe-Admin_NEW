import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/userManagement/")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="user-management-container">
      <h2>User Management</h2>
      <table className="user-management-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name_User}</td>
              <td>{user.email_User}</td>
              <td>{user.phone_number_User}</td>
              <td>
                <button
                  className="details-btn"
                  onClick={() => navigate(`/userManagement/${user.id}`)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
