import { Router } from "express";
import { getAllBanners, createBanner, updateBanner, deleteBanner } from "../controllers/bannerinfoControllers.js";

const bannerinfoRouter = Router(); 

/**
 * @swagger
 * /banner:
 *   get:
 *     summary: Get a list of banners
 *     tags: 
 *       - bannerinfo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               date:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
// 📌 1️⃣ ดึงรายการแบนเนอร์ทั้งหมด
bannerinfoRouter.get("/banner", async (req, res) => {  
  try {
    const banners = await getAllBanners();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /banner:
 *   post:
 *     summary: Create a new banner
 *     tags: 
 *       - bannerinfo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               date:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Banner created successfully
 *       400:
 *         description: Title and ImageUrl are required
 *       500:
 *         description: Error
 */
// 📌 2️⃣ เพิ่มแบนเนอร์ใหม่
bannerinfoRouter.post("/banner", async (req, res) => {
    console.log("🔹 ข้อมูลที่ได้รับจาก React:", req.body);
  
    const { title, subtitle, description, imageUrl, date, isActive } = req.body;
  
    if (!title || !imageUrl) {
      return res.status(400).json({ message: "Title and ImageUrl are required" });
    }
  
    try {
      await createBanner(title, subtitle, description, imageUrl, date, isActive);
      res.status(201).json({ message: "Banner created successfully" });
    } catch (err) {
      console.error("🔴 Error inserting banner:", err);
      res.status(500).json({ error: err.message });
    }
  });
  

/**
 * @swagger
 * /banner/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: 
 *       - bannerinfo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               date:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       500:
 *         description: Error
 */
// 📌 3️⃣ อัปเดตแบนเนอร์
bannerinfoRouter.put("/banner/:id", async (req, res) => {  
  const { id } = req.params;
  const { title, subtitle, description, imageUrl, date, isActive } = req.body;

  try {
    await updateBanner(id, title, subtitle, description, imageUrl, date, isActive);
    res.status(200).json({ message: "Banner updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /banner/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: 
 *       - bannerinfo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     description: Delete a banner
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       500:
 *         description: Error
 */
// 📌 4️⃣ ลบแบนเนอร์
bannerinfoRouter.delete("/banner/:id", async (req, res) => {  
  const { id } = req.params;

  try {
    await deleteBanner(id);
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default bannerinfoRouter;
