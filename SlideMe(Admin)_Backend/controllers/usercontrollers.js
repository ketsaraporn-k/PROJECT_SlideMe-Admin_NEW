import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs'

const config = {
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'jwt'
}


const query = async (sql, params) => {
    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(sql, params);
    return rows;
}

const emtyOrRows = (rows) => {
    if (rows === undefined || rows.length === 0) return [] 
    return rows
    
}

//add new user
export const addNewUser = async({ username, password, role_id }) => {
    const sql = 'INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)';
    const params = [username, password, role_id];
    try {
        const result = await query(sql, params);
        const message = "User created failed";
        if (result.affectedRows > 0) return 'success'
        else return 'error'
    } 
    catch (error) {
        throw(error)
    }


    
}

export const getUserByUsername = async ({ username}) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const params = [username];
    try {
       const x =  emtyOrRows (await query(sql, params));
       console.log(x)
        return x
    } 
    catch (error) {
        throw(error)
    }
}


export const getUserWithRoleById = async ({ id }) => {
    const sql = 'SELECT users.id AS id, roles.name AS role FROM users  RIGHT JOIN roles ON users.role_id = roles.id WHERE users.id = ?'
                const params = [id];
                try{
                    const x = emtyOrRows (await query(sql, params))
                    console.log(x)
                    return x
                }catch (error) {
                    throw(error)
                }
}




export const getAllUsers = async ({ role }) => {
    let sql = '';
    let params = [];

    console.log("Current Role:", role); // chack role ที่รับเข้ามา

    if (role === 'Admin') {
        // Admin เห็น users ทั้งหมด
        sql = `
            SELECT users.id AS id, roles.name AS role, users.username AS username 
            FROM users 
            LEFT JOIN roles ON users.role_id = roles.id
            ORDER BY roles.name ASC;
        `;
    } else if (role === 'Manager') {
        // Manager เห็นเฉพาะ Manager และ Worker
        sql = `
            SELECT users.id AS id, roles.name AS role, users.username AS username 
            FROM users 
            LEFT JOIN roles ON users.role_id = roles.id
            WHERE roles.id > 1
            ORDER BY roles.name ASC;
        `;
    }
    

    try {
        const result = await query(sql, params);
        console.log("Query Result:", result); // chackค่าที่ได้จาก Query
        return result;
    } catch (error) {
        //console.error("Database Query Error:", error); 
        throw error;
    }
};
       