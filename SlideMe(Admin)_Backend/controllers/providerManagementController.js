import mysql from "mysql2/promise";

// ✅ สร้าง Connection Pool ในไฟล์นี้
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

// ✅ ดึงข้อมูลผู้ให้บริการทั้งหมด
export const getManagedProviders = async () => {
  const [rows] = await pool.query("SELECT * FROM provider_management");
  return rows;
};

// ✅ ดึงข้อมูลผู้ให้บริการตาม ID
export const getManagedProviderById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM provider_management WHERE id_provider_management = ?",
    [id]
  );
  return rows.length ? rows[0] : null; // ถ้าพบข้อมูล ให้คืนค่าแถวแรก
};

// ✅ อัปเดตข้อมูลผู้ให้บริการ (ยกเว้น ID)
export const updateManagedProvider = async (id, data) => {
  const {
    name_provider,
    owner_name_provider,
    email_provider,
    phone_number_provider,
    address_provider,
    facebook_link_provider,
    line_link_provider,
  } = data;

  const [result] = await pool.query(
    `UPDATE provider_management SET 
      name_provider = ?, 
      owner_name_provider = ?, 
      email_provider = ?, 
      phone_number_provider = ?, 
      address_provider = ?, 
      facebook_link_provider = ?, 
      line_link_provider = ?
    WHERE id_provider_management = ?`,
    [
      name_provider,
      owner_name_provider,
      email_provider,
      phone_number_provider,
      address_provider,
      facebook_link_provider,
      line_link_provider,
      id, // ❌ ห้ามแก้ไข ID
    ]
  );

  return result.affectedRows > 0; // คืนค่า true ถ้าอัปเดตสำเร็จ
};
