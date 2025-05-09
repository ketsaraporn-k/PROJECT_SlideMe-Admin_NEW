import express from "express";
import { getOrders, getOrderDetail } from "../controllers/orderController.js";

const orderManagementRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 */


/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Success, In Progress, Unsuccessful]
 *         description: Filter orders by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by order number or username
 *     responses:
 *       200:
 *         description: A list of orders
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get order details by Order ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
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
