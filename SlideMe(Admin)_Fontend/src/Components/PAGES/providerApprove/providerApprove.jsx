import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./providerApprove.css";

function ProviderApprove() {
  const [providers, setProviders] = useState([]);
  const [filterStatus, setFilterStatus] = useState(""); // 🔹 สำหรับกรองสถานะ
  const [currentPage, setCurrentPage] = useState(1); // 🔹 หน้าปัจจุบัน
  const itemsPerPage = 20; // 🔹 จำนวนรายการต่อหน้า
  const navigate = useNavigate();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/providerApprove/"
      );
      setProviders(response.data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  // 🔹 กรองข้อมูลตามสถานะ
  const filteredProviders = providers.filter((provider) =>
    filterStatus ? provider.status_provider_approve === filterStatus : true
  );

  // 🔹 คำนวณหน้าทั้งหมด
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

  // 🔹 คำนวณข้อมูลที่ต้องแสดงในหน้านี้
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = filteredProviders.slice(startIndex, endIndex);

  return (
    <div className="provider-approve-container">
      <h1 className="provider-approve-title">Provider Approvals</h1>

      {/* 🔹 Dropdown กรองสถานะ */}
      <div className="filter-container">
        <label>กรองสถานะ: </label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1); // รีเซ็ตไปหน้าที่ 1 เมื่อเปลี่ยนค่า
          }}
        >
          <option value="">ทั้งหมด</option>
          <option value="approved">อนุมัติแล้ว</option>
          <option value="pending">รออนุมัติ</option>
          <option value="rejected">ถูกปฏิเสธ</option>
        </select>
      </div>

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
                    navigate(
                      `/providerApproveDetail/${provider.id_provider_approve}`
                    )
                  }
                >
                  ตรวจสอบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 ปุ่ม Pagination */}
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

export default ProviderApprove;
