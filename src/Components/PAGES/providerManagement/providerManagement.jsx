import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./providerManagement.css";

function ProviderManagement() {
  const [providers, setProviders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/providerManagement/"
      );
      setProviders(response.data);
    } catch (error) {
      console.error("❌ Error fetching providers:", error);
    }
  };

  const totalPages = Math.ceil(providers.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = providers.slice(startIndex, endIndex);

  return (
    <div className="provider-management-container">
      <h1>Provider Management</h1>

      <table className="provider-management-table">
        <thead>
          <tr>
            <th>Provider ID</th>
            <th>Provider Name</th>
            <th>Provider Owner</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentProviders.length > 0 ? (
            currentProviders.map((provider) => (
              <tr key={provider.id_provider_management}>
                <td>{provider.id_provider_management}</td>
                <td>{provider.name_provider}</td>
                <td>{provider.owner_name_provider}</td>
                <td>{provider.email_provider}</td>
                <td>{provider.phone_number_provider}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(
                        `/providerDetail/${provider.id_provider_management}`
                      )
                    }
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                ❌ No Providers Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="provider-management-container-pagination">
        <button
          className="provider-management-container-pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="provider-management-container-pagination-page-number">
          Page {currentPage} / {totalPages}
        </span>
        <button
          className="provider-management-container-pagination-btn"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProviderManagement;
