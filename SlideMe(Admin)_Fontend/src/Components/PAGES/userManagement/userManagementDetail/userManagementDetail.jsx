import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./userManagementDetail.css";

function UserManagementDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/userManagement/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
        setUser(null);
      });
  }, [id]);

  const handleEdit = () => {
    setEditable(true);
  };

  const handleSave = () => {
    if (!user) return;

    const { id, ...updatedData } = user;

    fetch(`http://localhost:3000/userManagement/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then(() => {
        setEditable(false);
      })
      .catch((err) => console.error("Error saving user details:", err));
  };

  const handleChange = (e) => {
    if (!user) return;
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate("/userManagement");
  };

  if (user === null) return <p>Loading...</p>;
  if (user === "error") return <p>Error fetching user details.</p>;

  return (
    <div className="user-detail-container">
      <h2>User Management Detail</h2>
      <div className="form-container">
        <div className="form-item">
          <label htmlFor="id">
            <strong>ID:</strong>
          </label>
          <input type="text" id="id" name="id" value={user.id || ""} disabled />
        </div>
        <div className="form-item">
          <label htmlFor="name_User">
            <strong>Name:</strong>
          </label>
          <input
            type="text"
            id="name_User"
            name="name_User"
            value={user.name_User || ""}
            disabled={!editable}
            onChange={handleChange}
          />
        </div>
        <div className="form-item">
          <label htmlFor="email_User">
            <strong>Email:</strong>
          </label>
          <input
            type="email"
            id="email_User"
            name="email_User"
            value={user.email_User || ""}
            disabled={!editable}
            onChange={handleChange}
          />
        </div>
        <div className="form-item">
          <label htmlFor="phone_number_User">
            <strong>Phone:</strong>
          </label>
          <input
            type="text"
            id="phone_number_User"
            name="phone_number_User"
            value={user.phone_number_User || ""}
            disabled={!editable}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="button-container">
        {editable ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={handleEdit}>Edit</button>
        )}
        <button onClick={handleBack}>Back to User Management</button>
      </div>
    </div>
  );
}

export default UserManagementDetail;
