import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./providerApprove.css";

function ProviderApprove() {
  const [providers, setProviders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 20;
  const navigate = useNavigate();

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/providerApprove/");
      setProviders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setError("ไม่สามารถดึงข้อมูลผู้ให้บริการได้: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();

    // ฟัง event เพื่อรีเฟรชรายการ
    window.addEventListener("updateProviderList", fetchProviders);
    return () => {
      window.removeEventListener("updateProviderList", fetchProviders);
    };
  }, []);

  const filteredProviders = providers.filter((provider) =>
    filterStatus ? provider.status_provider_approve === filterStatus : true
  );

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = filteredProviders.slice(startIndex, endIndex);

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="provider-approve-container">
      <h1 className="provider-approve-title">Provider Approvals</h1>

      <div className="filter-container">
        <label>กรองสถานะ: </label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">ทั้งหมด</option>
          <option value="approved">อนุมัติแล้ว</option>
          <option value="pending">รออนุมัติ</option>
          <option value="rejected">ถูกปฏิเสธ</option>
        </select>
      </div>

      {filteredProviders.length === 0 ? (
        <p>ไม่มีผู้ให้บริการที่ตรงกับเงื่อนไข</p>
      ) : (
        <>
          <table className="provider-approve-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ชื่อบริษัท</th>
                <th>ชื่อเจ้าของ</th>
                <th>อีเมล</th>
                <th>เบอร์โทร</th>
                <th>สถานะ</th>
                <th>ตรวจสอบ</th>
              </tr>
            </thead>
            <tbody>
              {currentProviders.map((provider) => (
                <tr key={provider.id_provider_approve}>
                  <td>{provider.id_provider_approve}</td>
                  <td>{provider.name_provider_approve}</td>
                  <td>{provider.owner_name}</td>
                  <td>{provider.email_provider_approve}</td>
                  <td>{provider.phone_number_provider_approve}</td>
                  <td>{provider.status_provider_approve}</td>
                  <td>
                    <button
                      className="provider-approve-check-btn"
                      onClick={() =>
                        navigate(`/providerApproveDetail/${provider.id_provider_approve}`)
                      }
                    >
                      ตรวจสอบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProviderApprove;