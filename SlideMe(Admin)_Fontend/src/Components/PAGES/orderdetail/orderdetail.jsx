import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "./orderdetail.css";

// ตั้งค่า Icon สำหรับตำแหน่งเริ่มต้นและสิ้นสุด
const startIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const endIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null); // เพิ่ม ref สำหรับเก็บ instance ของ map

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:3000/api/orders/${orderId}`
        );

        console.log("API Response:", response.data);

        // ตรวจสอบโครงสร้างข้อมูลที่ได้รับจาก API
        if (response.data && response.data.success && response.data.order) {
          // กรณีที่ API ส่งค่ามาในรูปแบบ { success: true, order: {...} }
          setOrder(response.data.order);
        } else if (response.data) {
          // กรณีที่ API ส่งค่า response.data มาโดยตรง
          setOrder(response.data);
        } else {
          setError("Invalid response from server");
        }
      } catch (error) {
        console.error("API Error:", error);
        setError(
          "Failed to fetch order: " +
            (error.response?.data?.error || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    console.log("Order data for map:", order);

    // ทำความสะอาด map ก่อนหากมีอยู่แล้ว
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // ตรวจสอบว่ามีข้อมูลครบถ้วนและ DOM element พร้อมหรือไม่
    if (
      !order ||
      !order.startLat ||
      !order.startLng ||
      !order.endLat ||
      !order.endLng ||
      !mapRef.current
    ) {
      console.log(
        "Skipping map creation - missing data or container not ready"
      );
      return;
    }

    try {
      // แปลงค่าพิกัดจาก string เป็น number
      const startLat = parseFloat(order.startLat);
      const startLng = parseFloat(order.startLng);
      const endLat = parseFloat(order.endLat);
      const endLng = parseFloat(order.endLng);

      console.log("Creating map with coordinates:", {
        start: [startLat, startLng],
        end: [endLat, endLng],
      });

      // สร้าง map และเก็บ reference ไว้
      mapInstanceRef.current = L.map(mapRef.current).setView([startLat, startLng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapInstanceRef.current
      );

      L.marker([startLat, startLng], { icon: startIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`Start: ${startLat}, ${startLng}`);

      L.marker([endLat, endLng], { icon: endIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`End: ${endLat}, ${endLng}`);

      L.Routing.control({
        waypoints: [L.latLng(startLat, startLng), L.latLng(endLat, endLng)],
        routeWhileDragging: true,
      }).addTo(mapInstanceRef.current);

      // คืนค่า cleanup function
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error displaying map:", error);
      setError("Failed to load map: " + error.message);
    }
  }, [order]); // รีเฟรชแผนที่เมื่อ order เปลี่ยนแปลง

  const handleBack = () => navigate("/order-management");

  if (loading) return <p className="order-detail-loading">Loading order details...</p>;
  if (error) return <p className="order-detail-error">{error}</p>;
  if (!order) return <p className="order-detail-no-data">No order found</p>;

  return (
    <div className="order-detail-container">
      <div className="order-detail-header-container">
        <button className="order-detail-back-button" onClick={handleBack}>
          ← Back
        </button>
      </div>
      <h2 className="order-detail-title">Order Detail</h2>

      {order.startLat && order.startLng && order.endLat && order.endLng ? (
        <div
          ref={mapRef}
          className="order-detail-map-container"
          style={{ width: "100%", height: "300px", marginBottom: "20px" }}
        ></div>
      ) : (
        <p className="order-detail-map-unavailable">Map unavailable: Missing location data</p>
      )}

      <div className="order-detail-form-grid">
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Order Number</label>
          <span className="order-detail-form-value">{order.orderNumber}</span>
        </div>
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Date</label>
          <span className="order-detail-form-value">{new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Status</label>
          <span className="order-detail-form-value">{order.status}</span>
        </div>
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Customer</label>
          <span className="order-detail-form-value">
            {order.customerName}{" "}
            {order.phoneNumber ? `(${order.phoneNumber})` : "N/A"}
          </span>
        </div>
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Route</label>
          <span className="order-detail-form-value">{order.route || "N/A"}</span>
        </div>
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Provider</label>
          <span className="order-detail-form-value">
            {order.providerName}{" "}
            {order.providerNumber ? `(${order.providerNumber})` : "N/A"}
          </span>
        </div>
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Vehicle Type</label>
          <span className="order-detail-form-value">{order.vehicleType || "N/A"}</span>
        </div>
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Payment Method</label>
          <span className="order-detail-form-value">{order.paymentMethod || "N/A"}</span>
        </div>
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Service Fee</label>
          <span className="order-detail-form-value">{order.serviceFee ? `$${order.serviceFee}` : "N/A"}</span>
        </div>
        <div className="order-detail-form-group">
          <label className="order-detail-form-label">Review</label>
          <span className="order-detail-form-value">{order.review || "No review"}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;