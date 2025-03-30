import express from "express";
import {
  getProviders,
  getProviderById,
  approveProvider,
  rejectProvider,
  addProvider,
} from "../controllers/providerApproveController.js";

const providerApproveRouter = express.Router();

providerApproveRouter.get("/", async (req, res) => {
  try {
    const providers = await getProviders();
    console.log(providers);
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

providerApproveRouter.get("/:id", async (req, res) => {
  try {
    const provider = await getProviderById(req.params.id);
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

providerApproveRouter.post("/approve/:id", async (req, res) => {
  try {
    const result = await approveProvider(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

providerApproveRouter.post("/reject/:id", async (req, res) => {
  try {
    const result = await rejectProvider(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

providerApproveRouter.post("/add", async (req, res) => {
  try {
    const {
      name_provider_approve,
      owner_name,
      email_provider_approve,
      password_provider_approve,
      phone_number_provider_approve,
    } = req.body;

    if (
      !name_provider_approve?.trim() ||
      !owner_name?.trim() ||
      !email_provider_approve?.trim() ||
      !password_provider_approve?.trim() ||
      !phone_number_provider_approve?.trim()
    ) {
      return res.status(400).json({
        error:
          " ข้อมูลไม่ครบถ้วน! ต้องมีชื่อ, เจ้าของ, อีเมล, เบอร์โทร และรหัสผ่าน",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_provider_approve)) {
      return res.status(400).json({ error: " อีเมลไม่ถูกต้อง!" });
    }

    const existingProvider = await getProviderById(email_provider_approve);
    if (existingProvider.length > 0) {
      return res.status(409).json({ error: " อีเมลนี้ถูกใช้ไปแล้ว!" });
    }

    const result = await addProvider(req.body);

    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default providerApproveRouter;
