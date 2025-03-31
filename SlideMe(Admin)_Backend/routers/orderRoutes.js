import express from "express";
import { getOrders, getOrderDetail } from "../controllers/orderController.js";

const orderManagementRouter = express.Router();

// ✅ ดึงข้อมูล Order ทั้งหมด
orderManagementRouter.get("/", async (req, res) => {
  console.log("GET /api/orders called with query:", req.query);

  // กำหนดค่า default สำหรับ status ถ้าไม่มีกำหนดใน query
  const { page = 1, limit = 10, status = "", search } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10)); // ให้ page เป็นค่ามากกว่าหรือเท่ากับ 1
  const limitNum = Math.max(1, parseInt(limit, 10)); // ให้ limit เป็นค่ามากกว่าหรือเท่ากับ 1

  try {
    const result = await getOrders(pageNum, limitNum, status, search);
    console.log("Response:", result); // เพิ่ม Log ตรงนี้
    res.json(result);
  } catch (error) {
    console.error("Error in /api/orders:", error.stack);
    res.status(500).json({ error: error.message });
  }
});

// ✅ ดึงข้อมูล Order รายบุคคลโดยใช้ Order ID - แก้ไข
orderManagementRouter.get("/:orderId", async (req, res) => {
  console.log("GET /api/orders/:orderId called with ID:", req.params.orderId);
  try {
    const { orderId } = req.params;
    const result = await getOrderDetail(orderId);

    // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้รับจาก controller
    console.log("Order detail result:", result);

    if (result.success && result.order) {
      // ส่งข้อมูล order กลับให้ client ในรูปแบบเดิม
      res.json(result);
    } else {
      res.status(404).json({ message: result.message || "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order detail:", error);
    res.status(500).json({ error: error.message });
  }
});

export default orderManagementRouter;
