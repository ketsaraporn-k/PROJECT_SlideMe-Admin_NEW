import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userManagementController.js";

const router = express.Router();

// ✅ ดึงข้อมูลผู้ใช้ทั้งหมด
router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers(req, res);
    res.json(users);
  } catch (error) {
    next(error); // ส่งข้อผิดพลาดไปที่ middleware error handler
  }
});

// ✅ ดึงข้อมูลผู้ใช้ตาม ID
router.get("/:id", async (req, res, next) => {
  try {
    const user = await getUserById(req, res);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error); // ส่งข้อผิดพลาดไปที่ middleware error handler
  }
});

// ✅ เพิ่มผู้ใช้ใหม่
router.post("/", async (req, res, next) => {
  try {
    await createUser(req, res);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error); // ส่งข้อผิดพลาดไปที่ middleware error handler
  }
});

// ✅ อัพเดทข้อมูลผู้ใช้
router.put("/:id", async (req, res, next) => {
  try {
    await updateUser(req, res);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    next(error); // ส่งข้อผิดพลาดไปที่ middleware error handler
  }
});

// ✅ ลบผู้ใช้
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteUser(req, res);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error); // ส่งข้อผิดพลาดไปที่ middleware error handler
  }
});

export default router;
