import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./providerDetail.css";

function ProviderDetail() {
  const { id } = useParams(); // Get 'id' from URL
  const [provider, setProvider] = useState({});
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/providerManagement/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProvider(data); // Ensure data is not null
        }
      })
      .catch((err) => {
        console.error("Error fetching provider details:", err);
        setProvider("error");
      });
  }, [id]);

  const handleEdit = () => {
    setEditable(true);
  };

  const handleSave = () => {
    if (!provider) return;

    const { id_provider_management, ...updatedData } = provider; // Remove ID before sending

    fetch(`http://localhost:3000/providerManagement/${id}`, {
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
      .catch((err) => console.error("Error saving provider details:", err));
  };

  const handleChange = (e) => {
    if (!provider) return;
    setProvider({
      ...provider,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate("/providerManagement");
  };

  if (!provider) return <p>Loading...</p>;
  if (provider === "error") return <p>Error fetching provider details.</p>;

  return (
    <div className="provider-detail-container">
      <h2>Provider Approval Detail</h2>
      <div className="form-container">
        <div className="form-item">
          <label htmlFor="id_provider_management">
            <strong>ID:</strong>
          </label>
          <input
            type="text"
            id="id_provider_management"
            name="id_provider_management"
            value={provider.id_provider_management || ""}
            disabled
          />
        </div>
        <div className="form-item">
          <label htmlFor="name_provider">
            <strong>Name:</strong>
          </label>
          <input
            type="text"
            id="name_provider"
            name="name_provider"
            value={provider.name_provider || ""}
            disabled={!editable}
            onChange={handleChange}
          />
        </div>
        <div className="form-item">
          <label htmlFor="owner_name_provider">
            <strong>Owner:</strong>
          </label>
          <input
            type="text"
            id="owner_name_provider"
            name="owner_name_provider"
            value={provider.owner_name_provider || ""}
            disabled={!editable}
            onChange={handleChange}
          />
        </div>
        <div className="form-item">
          <label htmlFor="email_provider">
            <strong>Email:</strong>
          </label>
          <input
            type="email"
            id="email_provider"
            name="email_provider"
            value={provider.email_provider || ""}
            disabled={!editable}
            onChange={handleChange}
          />
        </div>
        <div className="form-item">
          <label htmlFor="phone_number_provider">
            <strong>Phone:</strong>
          </label>
          <input
            type="text"
            id="phone_number_provider"
            name="phone_number_provider"
            value={provider.phone_number_provider || ""}
            disabled={!editable}
            onChange={handleChange}
          />
        </div>
        <div className="form-item">
          <label htmlFor="address_provider">
            <strong>Address:</strong>
          </label>
          <input
            type="text"
            id="address_provider"
            name="address_provider"
            value={provider.address_provider || ""}
            disabled={!editable}
            onChange={handleChange}
          />
        </div>
        <div className="form-item">
          <label htmlFor="facebook_link_provider">
            <strong>Facebook:</strong>
          </label>
          <input
            type="text"
            id="facebook_link_provider"
            name="facebook_link_provider"
            value={provider.facebook_link_provider || ""}
            disabled={!editable}
            onChange={handleChange}
          />
        </div>
        <div className="form-item">
          <label htmlFor="line_link_provider">
            <strong>Line:</strong>
          </label>
          <input
            type="text"
            id="line_link_provider"
            name="line_link_provider"
            value={provider.line_link_provider || ""}
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
        <button onClick={handleBack}>Back to Provider Management</button>
      </div>
    </div>
  );
}

export default ProviderDetail;
