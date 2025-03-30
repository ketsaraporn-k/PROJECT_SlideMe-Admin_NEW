import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./providerApproveDetail.css";
import { useNavigate } from "react-router-dom";

function ProviderApproveDetail() {
  const { id } = useParams(); // 📌 ดึง id จาก URL
  const [provider, setProvider] = useState(null);
  const navigate = useNavigate(); // 📌 ใช้สำหรับนำทางไปยังหน้าต่างๆ

  const [providerList, setProviderList] = useState([]); // ✅ เก็บรายการผู้ให้บริการที่รออนุมัติ

  const handleApprove = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/providerApprove/approve/${id}`
      );

      console.log("Response:", response.data); // ✅ ตรวจสอบข้อมูลที่ได้รับจาก API

      if (response.data?.message) {
        alert(response.data.message); // ✅ แสดงข้อความที่ส่งมาจาก backend
      } else {
        alert("✅ อนุมัติเรียบร้อย!");
      }

      window.dispatchEvent(new Event("updateProviderList"));

      navigate("/providerManagement"); // ✅ นำทางไปยังหน้าจัดการผู้ให้บริการ
    } catch (error) {
      console.error("❌ Error approving provider:", error);
      alert("❌ ไม่สามารถอนุมัติได้");
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/providerApprove/reject/${id}`
      );
      alert(response.data.message);

      // ✅ อัปเดตลิสต์ให้เป็นข้อมูลที่เหลือหลังจากปฏิเสธ
      setProviderList(response.data.remainingProviders);

      navigate("/providerApprove");
    } catch (error) {
      console.error("❌ Error rejecting provider:", error);
      alert("❌ ไม่สามารถปฏิเสธได้");
    }
  };

  useEffect(() => {
    console.log("Fetching provider data for ID:", id);
    axios
      .get(`http://localhost:3000/providerApprove/${id}`)
      .then((response) => {
        console.log("API Response:", response.data); // ✅ Debug API Response
        if (Array.isArray(response.data) && response.data.length > 0) {
          setProvider(response.data[0]); // ✅ ถ้า API ส่ง Array ให้ดึงตัวแรก
        } else if (typeof response.data === "object") {
          setProvider(response.data); // ✅ ถ้า API ส่ง Object ให้ใช้ได้เลย
        } else {
          console.error("No provider data found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching provider:", error);
      });
  }, [id]);

  // 📌 ถ้ายังโหลดข้อมูลอยู่
  if (!provider) return <p>Loading...</p>;

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
              value={provider.create_date_provider_approve || ""}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="providerApproveDetail-detail-item10">
        <div className="provider-docs">
          <label>รูปโปรไฟล์</label>
          <img
            src="/uploads/profile.jpg"
            alt="Profile"
            className="provider-image"
          />
          <label>เอกสารรถยนต์</label>
          <iframe
            src="/uploads/car_document.pdf"
            className="provider-pdf"
          ></iframe>
          <label>ใบขับขี่</label>
          <iframe
            src="/uploads/driver_license.pdf"
            className="provider-pdf"
          ></iframe>
          <label>บัตรประชาชน</label>
          <iframe src="/uploads/id_card.pdf" className="provider-pdf"></iframe>
          <label>ประกันภัย</label>
          <iframe
            src="/uploads/insurance.pdf"
            className="provider-pdf"
          ></iframe>
        </div>
      </div>

      <div>
        <button onClick={handleApprove} className="approve-btn">
          ✅ อนุมัติ
        </button>
        <button onClick={handleReject} className="reject-btn">
          ❌ ปฏิเสธ
        </button>
      </div>
    </div>
  );
}

export default ProviderApproveDetail;
