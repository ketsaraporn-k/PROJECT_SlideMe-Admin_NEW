import mysql from "mysql2/promise";

// ✅ สร้าง Connection Pool
const pool = mysql.createPool({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "jwt",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const query = async (sql, params = []) => {
  console.log("Executing SQL:", sql, "with params:", params);
  const [results] = await pool.query(sql, params);
  return results;
};

// ✅ ดึงข้อมูล Order ทั้งหมด
export const getOrders = async (
  page = "1",
  limit = "10",
  status = "",
  search = ""
) => {
  console.log("Fetching orders with:", { page, limit, status, search });

  const pageNum = Math.max(1, parseInt(page, 10)); // รับรองว่า pageNum เป็นค่ามากกว่าหรือเท่ากับ 1
  const limitNum = Math.max(1, parseInt(limit, 10)); // รับรองว่า limitNum เป็นค่ามากกว่าหรือเท่ากับ 1

  let sql = `SELECT * FROM orders WHERE 1=1`;
  let countSql = `SELECT COUNT(*) AS total FROM orders WHERE 1=1`;
  const params = [];
  const countParams = [];

  if (status) {
    sql += ` AND status = ?`;
    countSql += ` AND status = ?`;
    params.push(status);
    countParams.push(status);
  }

  if (search) {
    sql += ` AND orderNumber LIKE ?`;
    countSql += ` AND orderNumber LIKE ?`;
    params.push(`%${search}%`);
    countParams.push(`%${search}%`);
  }

  const offset = (pageNum - 1) * limitNum;
  sql += ` ORDER BY created_at DESC LIMIT ?, ?`; // ✅ ใช้ created_at แทน order_date
  params.push(offset, limitNum); // ✅ offset และ limitNum ต้องเป็น INT

  const [orders, totalCount] = await Promise.all([
    query(sql, params),
    query(countSql, countParams),
  ]);

  const totalPages = Math.ceil(totalCount[0].total / limitNum);

  return { orders, totalPages };
};

// ✅ ดึงข้อมูล Order รายบุคคล
export const getOrderDetail = async (orderId) => {
  console.log("Fetching order detail for ID:", orderId);

  const order = await query(
    `SELECT 
      o.id AS orderId, 
      o.orderNumber, 
      o.created_at, 
      o.customerName, 
      o.providerName, 
      o.status,
      od.phoneNumber, 
      od.route, 
      od.paymentMethod, 
      od.vehicleType, 
      od.providerNumber, 
      od.serviceFee, 
      od.review, 
      od.startLat, 
      od.startLng, 
      od.endLat, 
      od.endLng
     FROM orders o
     LEFT JOIN order_details od ON o.id = od.order_id
     WHERE od.order_id = ?`,
    [orderId]
  );

  if (order.length === 0) {
    return { success: false, message: "❌ Order not found." };
  }

  return { success: true, order: order[0] };
};

// ✅ อัปเดตสถานะ Order
export const updateOrderStatus = async (orderId, status) => {
  const orderData = await getOrderDetail(orderId);
  if (!orderData.success) {
    return orderData;
  }

  await query(`UPDATE orders SET status = ? WHERE id = ?`, [status, orderId]);

  return {
    success: true,
    message: "✅ อัปเดตสถานะเรียบร้อย!",
    order: await getOrderDetail(orderId),
  };
};

// ✅ ลบ Order
export const deleteOrder = async (orderId) => {
  const orderData = await getOrderDetail(orderId);
  if (!orderData.success) {
    return orderData;
  }

  await query(`DELETE FROM orders WHERE id = ?`, [orderId]);

  return {
    success: true,
    message: "✅ ลบคำสั่งซื้อเรียบร้อย!",
  };
};
