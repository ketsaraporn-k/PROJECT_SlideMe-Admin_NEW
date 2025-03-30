import express from "express";
import {
  getProviders,
  getProviderById,
  approveProvider,
  rejectProvider,
  deleteProvider,
} from "../controllers/providerController.js";

const providerManagementRouter = express.Router();

// ✅ ดึงข้อมูล Provider ทั้งหมด
providerManagementRouter.get("/providers", async (req, res) => {
  try {
    const result = await getProviders();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ ดึงข้อมูล Provider รายบุคคลโดยใช้ ID
providerManagementRouter.get("/providers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getProviderById(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Provider not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ อนุมัติ Provider
providerManagementRouter.post("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await approveProvider(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ ปฏิเสธ Provider
providerManagementRouter.post("/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await rejectProvider(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ ลบ Provider ออกจากฐานข้อมูล
providerManagementRouter.delete("/providers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProvider(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default providerManagementRouter;
