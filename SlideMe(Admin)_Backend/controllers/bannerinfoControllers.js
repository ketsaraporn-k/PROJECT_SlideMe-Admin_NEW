import mysql from "mysql2/promise";

// เชื่อมต่อฐานข้อมูล
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'jwt'
});

//  1️ ดึงรายการแบนเนอร์ทั้งหมด
export const getAllBanners = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM banners");
    return rows;
  } catch (err) {
    throw new Error(err.message);
  }
};

//  2️ เพิ่มแบนเนอร์ใหม่
export const createBanner = async (title, subtitle, description, imageUrl, date, isActive) => {
  try {
    await db.execute(
      "INSERT INTO banners (title, subtitle, description, imageUrl, date, isActive) VALUES (?, ?, ?, ?, ?, ?)",
      [title, subtitle, description, imageUrl, date, isActive]
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

//  3️ อัปเดตแบนเนอร์
export const updateBanner = async (id, title, subtitle, description, imageUrl, date, isActive) => {
  try {
    await db.execute(
      "UPDATE banners SET title=?, subtitle=?, description=?, imageUrl=?, date=?, isActive=? WHERE id=?",
      [title, subtitle, description, imageUrl, date, isActive, id]
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

//  4️ ลบแบนเนอร์
export const deleteBanner = async (id) => {
  try {
    await db.execute("DELETE FROM banners WHERE id=?", [id]);
  } catch (err) {
    throw new Error(err.message);
  }
};
