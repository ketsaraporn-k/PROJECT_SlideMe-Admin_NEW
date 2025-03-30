import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

//  สร้าง Connection Pool
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  ดึงข้อมูล Provider ทั้งหมดจาก provider_approve
export const getProviders = async () => {
  return await query(
    `SELECT * FROM provider_approve ORDER BY id_provider_approve ASC`
  );
};

//  ดึงข้อมูล Provider รายบุคคล
export const getProviderById = async (id) => {
  return await query(
    `SELECT * FROM provider_approve WHERE id_provider_approve = ?`,
    [id]
  );
};

//  อนุมัติ Provider และอัปเดตรายการ
export const approveProvider = async (id) => {
  const providerData = await query(
    "SELECT * FROM provider_approve WHERE id_provider_approve = ?",
    [id]
  );

  if (providerData.length === 0) {
    throw new Error(" Provider not found.");
  }

  const provider = providerData[0];

  await query(
    "INSERT INTO provider_management (name_provider, owner_name_provider, address_provider, email_provider, phone_number_provider, facebook_link_provider, line_link_provider, status_provider, create_date_provider) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      provider.name_provider_approve,
      provider.owner_name,
      provider.address_provider_approve,
      provider.email_provider_approve,
      provider.phone_number_provider_approve,
      provider.facebook_link_provider_approve,
      provider.line_link_provider_approve,
      "active",
      provider.create_date_provider_approve,
    ]
  );

  await query("DELETE FROM provider_approve WHERE id_provider_approve = ?", [
    id,
  ]);

  return {
    message: " อนุมัติเรียบร้อย!",
    remainingProviders: await getProviders(),
  };
};

//  ปฏิเสธ Provider และอัปเดตรายการ
export const rejectProvider = async (id) => {
  const providerData = await query(
    "SELECT * FROM provider_approve WHERE id_provider_approve = ?",
    [id]
  );

  if (providerData.length === 0) {
    throw new Error(" Provider not found.");
  }

  await query(
    "UPDATE provider_approve SET status_provider_approve = 'rejected' WHERE id_provider_approve = ?",
    [id]
  );

  return {
    message: " ปฏิเสธผู้ให้บริการเรียบร้อย!",
    remainingProviders: await getProviders(),
  };
};

export const addProvider = async (providerData) => {
  const {
    name_provider_approve,
    owner_name,
    address_provider_approve,
    facebook_link_provider_approve,
    line_link_provider_approve,
    email_provider_approve,
    password_provider_approve,
    phone_number_provider_approve,
  } = providerData;

  if (
    !name_provider_approve ||
    !owner_name ||
    !email_provider_approve ||
    !password_provider_approve
  ) {
    throw new Error(
      " ข้อมูลไม่ครบถ้วน! ต้องมีชื่อ, เจ้าของ, อีเมล และรหัสผ่าน"
    );
  }

  const result = await query(
    `INSERT INTO provider_approve 
      (name_provider_approve, owner_name, address_provider_approve, 
       facebook_link_provider_approve, line_link_provider_approve, 
       email_provider_approve, password_provider_approve, 
       status_provider_approve, create_date_provider_approve, 
       phone_number_provider_approve, folder_path) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,

    [
      name_provider_approve,
      owner_name,
      address_provider_approve || null,
      facebook_link_provider_approve || null,
      line_link_provider_approve || null,
      email_provider_approve,
      password_provider_approve,
      "pending",
      phone_number_provider_approve,
      `/files/${email_provider_approve}`,
    ]
  );

  const providerId = result.insertId;

  console.log(` กำลังสร้างโฟลเดอร์สำหรับ: ${email_provider_approve}`);

  await createProviderFolder(email_provider_approve);

  return { message: " เพิ่ม Provider สำเร็จ!", providerId };
};

export const createProviderFolder = async (email) => {
  const folderPath = path.join(__dirname, `files/${email}`);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(` Created folder: ${folderPath}`);
  }
};
