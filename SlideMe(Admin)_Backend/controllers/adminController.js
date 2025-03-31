import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// เชื่อมต่อฐานข้อมูล
const pool = mysql.createPool({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'jwt',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ตรวจสอบการเชื่อมต่อ
pool
  .getConnection()
  .then((connection) => {
    console.log('Database connected');
    connection.release();
  })
  .catch((err) => console.error('Database connection failed:', err));

// ฟังก์ชันการดึงข้อมูล Admin ทั้งหมด
export const getAdmins = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT id, first_name, last_name, phone, email FROM admins');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล', details: err.message });
  }
};

// ฟังก์ชันการดึงข้อมูล Admin โดย ID
export const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('SELECT id, first_name, last_name, phone, email FROM admins WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ error: 'ไม่พบ Admin' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล', details: err.message });
  }
};

// ฟังก์ชันการเพิ่ม Admin
export const createAdmin = async (req, res) => {
  const { first_name, last_name, phone, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO admins (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, phone, email, hashedPassword]
    );
    res.status(201).json({ message: 'เพิ่ม Admin สำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่ม Admin', details: err.message });
  }
};

// ฟังก์ชันการอัปเดต Admin
export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, email, password } = req.body;

  try {
    // ตรวจสอบว่า adminId มีค่าหรือไม่
    if (!id) {
      return res.status(400).json({ error: 'Admin ID ไม่ถูกต้อง' });
    }

    // ตรวจสอบว่า Admin ที่ต้องการอัปเดตมีอยู่ใน database หรือไม่
    const [adminCheck] = await pool.query('SELECT id FROM admins WHERE id = ?', [id]);
    if (adminCheck.length === 0) {
      return res.status(404).json({ error: 'ไม่พบ Admin ที่ต้องการอัปเดต' });
    }

    // hash password ถ้ามีการส่ง password มา
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // ใช้ transaction เพื่อให้การอัปเดตข้อมูลเป็น atomic operation
    await pool.query('START TRANSACTION');

    // สร้าง SQL query แบบ dynamic
    let sqlQuery = 'UPDATE admins SET first_name = ?, last_name = ?, phone = ?, email = ?';
    const queryParams = [first_name, last_name, phone, email];

    // เพิ่ม password ถ้ามี
    if (hashedPassword) {
      sqlQuery += ', password = ?';
      queryParams.push(hashedPassword);
    }

    sqlQuery += ' WHERE id = ?';
    queryParams.push(id);

    // อัปเดตข้อมูล Admin
    await pool.query(sqlQuery, queryParams);

    // commit transaction
    await pool.query('COMMIT');

    res.json({ message: 'อัปเดต Admin สำเร็จ' });
  } catch (err) {
    // rollback transaction ถ้ามี error
    await pool.query('ROLLBACK');

    console.error('Error updating admin:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดต Admin', details: err.message });
  }
};

// ฟังก์ชันการลบ Admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM admins WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'ไม่พบ Admin' });
    res.json({ message: 'ลบ Admin สำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบ Admin', details: err.message });
  }
};

export default pool;