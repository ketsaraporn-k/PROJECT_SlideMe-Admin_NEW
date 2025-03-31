import { Router } from "express";
import { getAllBanners, createBanner, updateBanner, deleteBanner } from "../controllers/bannerinfoControllers.js";

const bannerinfoRouter = Router(); 

/**
 * @swagger
 * /banner:
 *   get:
 *     summary: Get a list of banners
 *     description: |
 *                   - ดึงรายการแบนเนอร์ทั้งหมดจากระบบ รวมถึงรายละเอียด เช่น ชื่อ หัวข้อย่อย คำอธิบาย รูปภาพ วันที่ และสถานะการใช้งาน (isActive) 
 *                   - ส่งคืนรายการแบนเนอร์ทั้งหมด
 * 
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
//  1 ดึงรายการแบนเนอร์ทั้งหมด
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
 *     description: |
 *                   - สร้างแบนเนอร์ใหม่
 *                   - ระบบจะตรวจสอบข้อมูลและสร้างแบนเนอร์ใหม่
 *                   - เพิ่มแบนเนอร์ใหม่เข้าสู่ระบบ โดยต้องระบุ title และ imageUrl เป็นค่าที่จำเป็น
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
//  2️ เพิ่มแบนเนอร์ใหม่
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
 *     description: |
 *                   - อัปเดตแบนเนอร์
 *                   - ระบบจะตรวจสอบข้อมูลและอัปเดตแบนเนอร์ใหม่
 *                   - ต้องระบุ id ของแบนเนอร์ที่ต้องการอัปเดต
 *                   - ส่งคืนสถานะการอัปเดตแบนเนอร์
 *                   - หากไม่พบแบนเนอร์ที่ต้องการอัปเดต ระบบจะแสดงข้อความแจ้งเตือน
 *                   - หากพบข้อผิดพลาดในการอัปเดต ระบบจะแสดงข้อความแจ้งเตือน
 *                   - หากอัปเดตแบนเนอร์สําเร็จ ระบบจะแสดงข้อความแจ้งเตือน
 *                   - อัปเดตข้อมูลของแบนเนอร์ที่ระบุโดย id สามารถแก้ไขชื่อ คำอธิบาย รูปภาพ วันที่ และสถานะ (isActive)
 * 
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
//  3️ อัปเดตแบนเนอร์
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
 *     description: |
 *                   - ลบแบนเนอร์
 *                   - ต้องระบุ id ของแบนเนอร์ที่ต้องการลบออกจากระบบ
 *                   - ส่งคืนสถานะการลบแบนเนอร์
 *                   - หากไม่พบแบนเนอร์ที่ต้องการลบ ระบบจะแสดงข้อความแจ้งเตือน
 *                   - หากพบข้อผิดพลาดในการลบ ระบบจะแสดงข้อความแจ้งเตือน
 *                   - หากลบแบนเนอร์สําเร็จ ระบบจะแสดงข้อความแจ้งเตือน
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
 * 
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       500:
 *         description: Error
 */
//  4️ ลบแบนเนอร์
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
