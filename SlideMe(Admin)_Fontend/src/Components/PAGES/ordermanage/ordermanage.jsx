import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ordermanage.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const ordersPerPage = 10;
  const navigate = useNavigate();

  // กำหนด API URL ตรงๆ
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ดึงข้อมูลคำสั่งซื้อใหม่เมื่อ currentPage, statusFilter, หรือ searchQuery เปลี่ยน
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiUrl}/api/orders`, {
          params: {
            page: currentPage,
            limit: ordersPerPage,
            ...(statusFilter ? { status: statusFilter } : {}),
            ...(searchQuery ? { search: searchQuery } : {}),
          },
        });
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
        setError(error.response?.data?.error || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, statusFilter, searchQuery]); // Depend on these variables to trigger fetch

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="order-management-container">
      <h1 className="order-management-title">Order Management</h1>

      <div className="order-management-filter">
        <input
          type="text"
          placeholder="Search Order Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="order-management-filter-search"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="order-management-filter-status">
          <option value="">All</option>
          <option value="Success">✅ Success</option>
          <option value="In progress">⏳ In progress</option>
          <option value="Unsuccessful">❌ Unsuccessful</option>
        </select>
      </div>

      {loading && <p className="order-management-loading">Loading orders...</p>}
      {error && <p className="order-management-error">{error}</p>}

      {!loading && !error && (
        <>
          <table className="order-management-table">
            <thead>
              <tr>
                <th className="order-management-table-header">Date</th>
                <th className="order-management-table-header">Order Number</th>
                <th className="order-management-table-header">User Name</th>
                <th className="order-management-table-header">Provider</th>
                <th className="order-management-table-header">Status</th>
                <th className="order-management-table-header">Detail</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="order-management-table-no-data">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id || Math.random()}>
                    <td className="order-management-table-data">{order?.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}</td>
                    <td className="order-management-table-data">{order.orderNumber}</td>
                    <td className="order-management-table-data">{order.customerName}</td>
                    <td className="order-management-table-data">{order.providerName}</td>
                    <td className="order-management-table-data">
                      <span className={`order-management-status-dot ${order.status.toLowerCase().replace(" ", "-")}`}></span>
                      {order.status}
                    </td>
                    <td className="order-management-table-data">
                      <button
                        className="order-management-detail-button"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="order-management-pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="order-management-pagination-button">
              Previous
            </button>
            <span className="order-management-pagination-info">
              {currentPage} / {totalPages}
            </span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage >= totalPages} className="order-management-pagination-button">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderManagement;