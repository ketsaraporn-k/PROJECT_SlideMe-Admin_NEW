import { useEffect, useState } from "react";
import axios from "axios";
import "./vehicleManagement.css";

function VehicleManagement() {
  const [formData, setFormData] = useState({
    name: "",
    detail: "",
    image: null,
    status: false,
  });
  const [vehicleList, setVehicleList] = useState([]);
  const [editModal, setEditModal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/vehicle/vehicle-type");
      console.log('Fetched vehicle types:', res.data);
      if (Array.isArray(res.data)) {
        setVehicleList(res.data);
      } else {
        setError("ข้อมูลประเภทยานพาหนะไม่ถูกต้อง: ไม่ใช่อาร์เรย์");
        setVehicleList([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("ไม่สามารถโหลดข้อมูลได้:", err);
      setError("ไม่สามารถโหลดข้อมูลได้: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("vehicleDetail", formData.detail);
    data.append("status", formData.status ? "active" : "inactive");
    if (formData.image) data.append("image", formData.image);

    try {
      await axios.post("http://localhost:3000/api/vehicle/vehicle-type", data);
      fetchVehicles();
      setFormData({ name: "", detail: "", image: null, status: false });
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการบันทึก:", err);
      setError("เกิดข้อผิดพลาดในการบันทึก: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) {
      try {
        await axios.delete(`http://localhost:3000/api/vehicle/vehicle-type/${id}`);
        fetchVehicles();
      } catch (err) {
        console.error("ลบไม่สำเร็จ:", err);
        setError("ลบไม่สำเร็จ: " + err.message);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditModal((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/vehicle/vehicle-type/${editModal.id}`,
        {
          name: editModal.name,
          vehicleDetail: editModal.vehicleDetail,
          status: editModal.status === "active" ? "active" : "inactive",
        }
      );
      setEditModal(null);
      fetchVehicles();
    } catch (err) {
      console.error("แก้ไขไม่สำเร็จ:", err);
      setError("แก้ไขไม่สำเร็จ: " + err.message);
    }
  };

  if (loading) return <div className="vehicle-loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="vehicle-error">{error}</div>;

  return (
    <div className="vehicle-container">
      <h2 className="vehicle-title">การจัดการประเภทยานพาหนะ</h2>

      {/* Form */}
      <form className="vehicle-form" onSubmit={handleSubmit}>
        <label>ชื่อประเภทรถ</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="ชื่อ"
          required
        />

        <label>รายละเอียด</label>
        <textarea
          name="detail"
          value={formData.detail}
          onChange={handleChange}
          placeholder="รายละเอียด"
          required
        />

        <label>รูปภาพ</label>
        <input type="file" name="image" onChange={handleChange} accept="image/*" />

        <label>สถานะ</label>
        <label className="switch">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
          />
          <span className="slider round"></span>
        </label>

        <div className="button-group">
          <button type="submit" className="save-btn">
            บันทึก
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setFormData({ name: "", detail: "", image: null, status: false })}
          >
            ยกเลิก
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="vehicle-table">
        <h3 className="vehicle-table-title">ข้อมูลประเภทรถสไลด์</h3>
        {vehicleList.length === 0 ? (
          <div className="vehicle-empty">ไม่มีข้อมูลประเภทยานพาหนะ</div>
        ) : (
          <table className="vehicle-table">
            <thead>
              <tr className="vehicle-header">
                <th className="vehicle-index">ลำดับ</th>
                <th className="vehicle-name">ชื่อ</th>
                <th className="vehicle-image">รูปภาพ</th>
                <th className="vehicle-status">สถานะ</th>
                <th className="vehicle-action">แก้ไข</th>
                <th className="vehicle-action">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {vehicleList.map((item, index) => (
                <tr key={item.id} className="vehicle-row">
                  <td className="vehicle-index">{index + 1}</td>
                  <td className="vehicle-name">{item.name}</td>
                  <td className="vehicle-image">
                    {item.image_path ? (
                      <img
                        src={`http://localhost:3000/${item.image_path}`}
                        alt="รถ"
                        style={{ width: "50px" }}
                        onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
                      />
                    ) : (
                      "ไม่มีรูป"
                    )}
                  </td>
                  <td className="vehicle-status">{item.status}</td>
                  <td className="vehicle-action">
                    <button onClick={() => setEditModal(item)}>✏️</button>
                  </td>
                  <td className="vehicle-action">
                    <button onClick={() => handleDelete(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Edit */}
      {editModal && (
        <div className="edit-modal">
          <div className="modal-content">
            <h3>แก้ไขข้อมูลประเภทรถ</h3>
            <label>ชื่อ</label>
            <input
              type="text"
              name="name"
              value={editModal.name}
              onChange={handleEditChange}
              required
            />

            <label>รายละเอียด</label>
            <textarea
              name="vehicleDetail"
              value={editModal.vehicleDetail}
              onChange={handleEditChange}
              required
            />

            <label>สถานะ</label>
            <label className="switch">
              <input
                type="checkbox"
                name="status"
                checked={editModal.status === "active"}
                onChange={(e) =>
                  setEditModal((prev) => ({
                    ...prev,
                    status: e.target.checked ? "active" : "inactive",
                  }))
                }
              />
              <span className="slider round"></span>
            </label>

            <div className="modal-buttons">
              <button onClick={handleUpdate} className="save-btn">
                บันทึก
              </button>
              <button onClick={() => setEditModal(null)} className="cancel-btn">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleManagement;