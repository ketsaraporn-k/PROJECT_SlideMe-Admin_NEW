import mysql from "mysql2/promise";

//  สร้าง Connection Pool ในไฟล์นี้
const pool = mysql.createPool({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "jwt",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const query = async (sql, params) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
};

//  ดึงข้อมูลผู้ใช้ทั้งหมด
export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name_User, email_User, phone_number_User FROM usersManagement"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  ดึงข้อมูลผู้ใช้ตาม ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await pool.query(
      "SELECT id, name_User, email_User, phone_number_User FROM usersManagement WHERE id = ?",
      [id]
    );
    if (users.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  เพิ่มผู้ใช้ (POST)
export const createUser = async (req, res) => {
  const { name_User, email_User, password_User, phone_number_User } = req.body;
  try {
    await pool.query(
      "INSERT INTO usersManagement (name_User, email_User, password_User, phone_number_User) VALUES (?, ?, ?, ?)",
      [name_User, email_User, password_User, phone_number_User]
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  อัพเดทข้อมูลผู้ใช้ (PUT)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name_User, email_User, phone_number_User } = req.body;
  try {
    await pool.query(
      "UPDATE usersManagement SET name_User = ?, email_User = ?, phone_number_User = ? WHERE id = ?",
      [name_User, email_User, phone_number_User, id]
    );
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  ลบผู้ใช้ (DELETE)
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM usersManagement WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
