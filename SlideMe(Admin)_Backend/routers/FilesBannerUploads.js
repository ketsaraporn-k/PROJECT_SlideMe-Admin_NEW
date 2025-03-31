/* import { Router } from "express";
import fs from "node:fs";
import multer from "multer";

const storage = multer.diskStorage({
  //set destination
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);

    //chack cancel
    req.on("aborted", () => {
      console.log("file upload cancelled");

      fs.unlinkSync(`./public/${filename}`, (err) => {
        if (err) console.log(err);
        console.log(`Deleted: ./public/${filename}`);
      });
    });
  },
});

const upload = multer({ storage }); //middleware

const filesRouter = Router();

//CRUD/API
filesRouter.get("/list", (req, res) => {
  fs.readdir("./public", (err, files) => {
    if (err) {
      return res.status(500).json({ message: err.message }); //  ใส่ return เพื่อหยุดการทำงาน
    }

    let data = [];

    files.forEach((file) => {
      const obj = {
        name: file,
        url: `http://localhost:3000/${file}`,
      };
      data.push(obj);
    });
    res.status(200).json(data);
  });

  //res.json({ message: "OK" });
});

//POST [/files]/upload
filesRouter.post("/upload", upload.single("test"), (req, res) => {
  res.status(200).json({ message: "file uploaded success" });
});

// POST [/files]/delete
filesRouter.post("/delete", (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ message: "Filename is required" });
  }

  const filePath = `./public/${filename}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting file", error: err.message });
    }
    res.status(200).json({ message: "File deleted successfully" });
  });
});

export default filesRouter;
 */

import { Router } from "express";
import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });
const filesRouter = Router();

/**
 * @swagger
 * /files/list:
 *   get:
 *     summary: Get a list of files
 *     description: |
 *                   - API สำหรับดึงรายการไฟล์ที่ถูกอัปโหลดไว้ในเซิร์ฟเวอร์  
 *                   - ระบบจะอ่านไฟล์จากโฟลเดอร์ `/public`  
 *                   - ส่งคืนรายการไฟล์พร้อม URL สำหรับเข้าถึงไฟล์  
 *     tags: [filesbanneruploads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *     
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
// API ดึงรายการไฟล์ทั้งหมด
filesRouter.get("/list", (req, res) => {
  fs.readdir("./public", (err, files) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const data = files.map((file) => ({
      name: file,
      url: `http://localhost:3000/public/${file}`,
    }));

    res.status(200).json(data);
  });
});

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload a file
 *     description: |
 *                - API สำหรับอัปโหลดไฟล์ไปเก็บไว้ในโฟลเดอร์ `/public`  
 *                - รองรับการอัปโหลดแบบ `multipart/form-data`  
 *                - ระบบจะตั้งชื่อไฟล์ใหม่โดยเพิ่ม `timestamp` ด้านหน้า  
 *                - หลังอัปโหลดสำเร็จ ระบบจะส่งคืน URL ของไฟล์  
 *     tags: [filesbanneruploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               test:
 *                 type: string
 *                 format: binary
 *     
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 */
// API POST [/files]/upload
filesRouter.post("/upload", upload.single("test"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "File uploaded successfully",
    url: `http://localhost:3000/public/${req.file.filename}`,
  });
});

/**
 * @swagger
 * /files/delete:
 *   delete:
 *     summary: Delete a file
 *     description: |
 *       - API สำหรับลบไฟล์ที่อยู่ในโฟลเดอร์ `/public`  
 *       - ต้องส่ง `filename` ผ่าน request body  
 *       - หากไฟล์มีอยู่ ระบบจะลบและแจ้งสถานะสำเร็จ  
 *       - หากไม่พบไฟล์ หรือเกิดข้อผิดพลาด ระบบจะแสดงข้อความแจ้งเตือน  
 *     tags: [filesbanneruploads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *     
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       400:
 *         description: Filename is required
 *       500:
 *         description: Error deleting file
 */
// API ลบไฟล์
// POST [/files]/delete
filesRouter.delete("/delete", (req, res) => {
  const { filename } = req.body; // NOTE: DELETE requests usually don't send body
  if (!filename) {
    return res.status(400).json({ message: "Filename is required" });
  }

  const filePath = `./public/${filename}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting file", error: err.message });
    }
    res.status(200).json({ message: "File deleted successfully" });
  });
});


export default filesRouter;
