import express from "express";
import {
  getManagedProviders,
  getManagedProviderById,
  updateManagedProvider, // ✅ เพิ่มฟังก์ชันอัปเดต
} from "../controllers/providerManagementController.js";

const router = express.Router();

// ✅ ดึงข้อมูลผู้ให้บริการทั้งหมด
router.get("/", async (req, res) => {
  try {
    const providers = await getManagedProviders();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ ดึงข้อมูลผู้ให้บริการตาม ID
router.get("/:id", async (req, res) => {
  try {
    const provider = await getManagedProviderById(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: "ไม่พบผู้ให้บริการ" });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ อัปเดตข้อมูลผู้ให้บริการ (ยกเว้น ID)
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateManagedProvider(req.params.id, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ error: "อัปเดตไม่สำเร็จ หรือ ไม่พบผู้ให้บริการ" });
    }
    res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
