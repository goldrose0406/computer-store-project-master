const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'computerstore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tạo database và table nếu chưa tồn tại
const initDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    // Tạo database
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'computerstore'}`
    );
    console.log('✅ Database created/exists');

    // Kết nối đến database vừa tạo
    await connection.changeUser({ database: process.env.DB_NAME || 'computerstore' });

    // Tạo users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/exists');

    // Tạo orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        customerName VARCHAR(100) NOT NULL,
        customerEmail VARCHAR(100) NOT NULL,
        customerPhone VARCHAR(20),
        customerAddress VARCHAR(255),
        products JSON NOT NULL,
        totalPrice DECIMAL(12, 2) NOT NULL,
        totalItems INT NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Orders table created/exists');

    // Tạo admin account mặc định
    const adminEmail = 'admin@computerstore.com';
    const adminPassword = await require('bcryptjs').hash('Admin@123', 10);
    
    try {
      await connection.execute(
        'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
        ['Admin', adminEmail, adminPassword, true]
      );
      console.log('✅ Admin account created');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('✅ Admin account already exists');
      } else {
        throw err;
      }
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  } finally {
    await connection.end();
  }
};

module.exports = { pool, initDatabase };
