import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./providerApproveDetail.css";

function ProviderApproveDetail() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleApprove = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/providerApprove/approve/${id}`
      );
      alert(response.data?.message || "อนุมัติเรียบร้อย!");
      window.dispatchEvent(new Event("updateProviderList"));
      navigate("/providerManagement");
    } catch (error) {
      console.error("Error approving provider:", error);
      alert("ไม่สามารถอนุมัติได้");
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/providerApprove/reject/${id}`
      );
      alert(response.data.message);
      navigate("/providerApprove");
    } catch (error) {
      console.error("Error rejecting provider:", error);
      alert("ไม่สามารถปฏิเสธได้");
    }
  };

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/providerApprove/${id}`);
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        setProvider(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching provider:", error);
        setError("ไม่สามารถดึงข้อมูลผู้ให้บริการได้: " + error.message);
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!provider) return <p>ไม่พบข้อมูลผู้ให้บริการ</p>;

  const fileBasePath = `http://localhost:3000/uploads/providerApprove/${provider.email_provider_approve}`;
  console.log("fileBasePath:", fileBasePath);
  console.log("car_document:", provider.car_document);
  console.log("driver_license:", provider.driver_license);
  console.log("id_card:", provider.id_card);
  console.log("insurance:", provider.insurance);
  console.log("profile:", provider.profile);

  const handleFileError = (e) => {
    e.target.style.display = "none";
    const errorMessage = document.createElement("span");
    errorMessage.style.color = "red";
    errorMessage.textContent = " (ไม่พบไฟล์)";
    e.target.parentNode.appendChild(errorMessage);
  };

  return (
    <div className="providerApproveDetail">
      <h1>รายละเอียดผู้ให้บริการ</h1>
      <div className="providerApproveDetail-container">
        <div>
          <div className="providerApproveDetail-detail-item1">
            <label>ชื่อบริษัท</label>
            <input
              type="text"
              value={provider.name_provider_approve || ""}
              disabled
            />
          </div>
          <div className="providerApproveDetail-detail-item2">
            <label>ชื่อเจ้าของ</label>
            <input type="text" value={provider.owner_name || ""} disabled />
          </div>
          <div className="providerApproveDetail-detail-item3">
            <label>อีเมล</label>
            <input
              type="text"
              value={provider.email_provider_approve || ""}
              disabled
            />
          </div>
        </div>
        <div>
          <div className="providerApproveDetail-detail-item4">
            <label>เบอร์โทร</label>
            <input
              type="text"
              value={provider.phone_number_provider_approve || ""}
              disabled
            />
          </div>
          <div className="providerApproveDetail-detail-item5">
            <label>ที่อยู่</label>
            <textarea
              value={provider.address_provider_approve || ""}
              disabled
            />
          </div>
          <div className="providerApproveDetail-detail-item6">
            <label>Facebook</label>
            <input
              type="text"
              value={provider.facebook_link_provider_approve || ""}
              disabled
            />
          </div>
        </div>
        <div>
          <div className="providerApproveDetail-detail-item7">
            <label>Line</label>
            <input
              type="text"
              value={provider.line_link_provider_approve || ""}
              disabled
            />
          </div>
          <div className="providerApproveDetail-detail-item8">
            <label>สถานะ</label>
            <input
              type="text"
              value={provider.status_provider_approve || ""}
              disabled
            />
          </div>
          <div className="providerApproveDetail-detail-item9">
            <label>วันที่สมัคร</label>
            <input
              type="text"
              value={
                provider.create_date_provider_approve
                  ? new Date(provider.create_date_provider_approve).toLocaleDateString()
                  : ""
              }
              disabled
            />
          </div>
        </div>
      </div>

      <div className="providerApproveDetail-detail-item10">
        <h2>เอกสารประกอบ</h2>
        <div className="provider-docs">
          <div>
            <label>รูปโปรไฟล์</label>
            {provider.profile ? (
              <img
                src={`${fileBasePath}/${provider.profile}`}
                alt="Profile"
                className="provider-image"
                onError={handleFileError}
              />
            ) : (
              <span style={{ color: "red" }}>ไม่มีรูปโปรไฟล์</span>
            )}
          </div>

          <div>
            <label>เอกสารรถยนต์</label>
            {provider.car_document ? (
              <iframe
                src={`${fileBasePath}/${provider.car_document}`}
                className="provider-pdf"
                title="Car Document"
                onError={handleFileError}
              ></iframe>
            ) : (
              <span style={{ color: "red" }}>ไม่มีเอกสารรถยนต์</span>
            )}
          </div>

          <div>
            <label>ใบขับขี่</label>
            {provider.driver_license ? (
              <iframe
                src={`${fileBasePath}/${provider.driver_license}`}
                className="provider-pdf"
                title="Driver License"
                onError={handleFileError}
              ></iframe>
            ) : (
              <span style={{ color: "red" }}>ไม่มีใบขับขี่</span>
            )}
          </div>

          <div>
            <label>บัตรประชาชน</label>
            {provider.id_card ? (
              <iframe
                src={`${fileBasePath}/${provider.id_card}`}
                className="provider-pdf"
                title="ID Card"
                onError={handleFileError}
              ></iframe>
            ) : (
              <span style={{ color: "red" }}>ไม่มีบัตรประชาชน</span>
            )}
          </div>

          <div>
            <label>ประกันภัย</label>
            {provider.insurance ? (
              <iframe
                src={`${fileBasePath}/${provider.insurance}`}
                className="provider-pdf"
                title="Insurance"
                onError={handleFileError}
              ></iframe>
            ) : (
              <span style={{ color: "red" }}>ไม่มีประกันภัย</span>
            )}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handleApprove} className="approve-btn">
          อนุมัติ
        </button>
        <button onClick={handleReject} className="reject-btn">
          ปฏิเสธ
        </button>
      </div>
    </div>
  );
}

export default ProviderApproveDetail;