import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./BannerManagement.css";

let currentRequestSource = null;

function BannerManagement() {
  const fileRef = useRef();
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [formFields, setFormFields] = useState({
    title: "",
    subtitle: "",
    description: "",
  });
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cleanup URL.createObjectURL
  useEffect(() => {
    return () => {
      if (preview && !preview.startsWith("http")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ฟังก์ชันดึงข้อมูลแบนเนอร์
  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:3000/bannerinfo/banner");
      setBanners(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("ไม่สามารถดึงรายการแบนเนอร์ได้: " + err.message);
      setLoading(false);
    }
  };

  // โหลดรายการแบนเนอร์เมื่อโหลดหน้า
  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview("");
    setSelectedDate("");
    setIsActive(false);
    setFormFields({ title: "", subtitle: "", description: "" });
    alert("ฟอร์มถูกล้างข้อมูลเรียบร้อย!");
  };

  const handleSaveClick = async () => {
    if (!preview) {
      return alert("กรุณาอัปโหลดรูปภาพก่อนบันทึก");
    }

    const bannerData = {
      title: formFields.title,
      subtitle: formFields.subtitle,
      description: formFields.description,
      date: selectedDate,
      isActive: isActive ? 1 : 0,
      imageUrl: preview,
    };

    try {
      const res = await axios.post("http://localhost:3000/bannerinfo/banner", bannerData);
      console.log("บันทึกข้อมูลแบนเนอร์:", res.data);
      alert("บันทึกข้อมูลสำเร็จ!");
      // อัปเดตรายการแบนเนอร์หลังบันทึก
      await fetchBanners();
      // ไม่เรียก handleCancel เพื่อให้ข้อมูลยังอยู่ในฟอร์ม
      // หากต้องการให้ผู้ใช้เลือกว่าจะล้างฟอร์มหรือไม่ สามารถเพิ่ม confirm ได้
      // const shouldClear = window.confirm("ต้องการล้างฟอร์มหรือไม่?");
      // if (shouldClear) handleCancel();
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + err.message);
    }
  };

  const toggleStatus = () => {
    setIsActive(!isActive);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadClick = async () => {
    if (!selectedFile) {
      return alert("กรุณาเลือกไฟล์ก่อนอัปโหลด");
    }

    const formData = new FormData();
    formData.append("test", selectedFile);

    currentRequestSource = axios.CancelToken.source();
    try {
      const res = await axios.post("http://localhost:3000/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
          }
        },
        cancelToken: currentRequestSource.token,
      });
      alert("อัปโหลดไฟล์สำเร็จ!");
      setPreview(res.data.url);
      setSelectedFile(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("File upload failed:", err);
        alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์: " + err.message);
      }
    } finally {
      fileRef.current.value = null;
      setProgress(0);
    }
  };

  const cancelClick = () => {
    if (currentRequestSource !== null) {
      currentRequestSource.cancel("Upload cancelled by user");
    }
  };

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <div className="banner-management-container">
        <div className="banner-container">
          <h2>Banner Management</h2>
          <div
            className="banner-card"
            style={{
              backgroundImage: preview ? `url(${preview})` : "none",
              backgroundColor: !preview ? "green" : "transparent",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="banner-content">
              <h3>{selectedDate || "เลือกวันที่"}</h3>
              <h1>{formFields.title || "หัวข้อหลัก"}</h1>
              <p>{formFields.subtitle || "หัวข้อย่อย"}</p>
              <button className="btn-get-started">Get Started</button>
            </div>
          </div>

          <div className="upload-container">
            <h1>Upload</h1>
            <div>
              <input type="file" ref={fileRef} onChange={handleFileChange} accept="image/*" />
              <div>
                <button className="upload-button" onClick={uploadClick}>
                  ↑
                </button>
                 
                <button onClick={cancelClick}>×</button>
              </div>
              <progress value={progress} max={100} style={{ width: "100%" }}></progress>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>หัวข้อ</label>
              <input
                type="text"
                name="title"
                value={formFields.title}
                onChange={handleFieldChange}
                placeholder="Enter"
              />
            </div>
            <div className="form-group">
              <label>หัวข้อย่อย</label>
              <input
                type="text"
                name="subtitle"
                value={formFields.subtitle}
                onChange={handleFieldChange}
                placeholder="Enter"
              />
            </div>
            <div className="form-group">
              <label>รายละเอียด</label>
              <textarea
                name="description"
                value={formFields.description}
                onChange={handleFieldChange}
                placeholder="Enter"
              ></textarea>
            </div>
            <div className="form-group">
              <label>วันที่</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>สถานะ</label>
              <label className="toggle">
                <input type="checkbox" checked={isActive} onChange={toggleStatus} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-actions">
              <button className="save-button" onClick={handleSaveClick}>
                บันทึก
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                ยกเลิก
              </button>
            </div>
          </div>

          {/* แสดงรายการแบนเนอร์ */}
          <div className="banner-list">
            <h3>รายการแบนเนอร์</h3>
            {banners.length === 0 ? (
              <p>ไม่มีแบนเนอร์</p>
            ) : (
              <ul>
                {banners.map((banner) => (
                  <li key={banner.id}>
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      style={{ width: "100px", height: "auto" }}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                    />
                    <span>{banner.title}</span> -{" "}
                    <span>{banner.isActive ? "Active" : "Inactive"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerManagement;