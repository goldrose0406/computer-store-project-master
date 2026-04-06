/**
 * Migration 001: Initial Schema
 * Tạo bảng users, orders, products
 */

const { pool } = require('../config/db');

const up = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Create users table with role field
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role TEXT DEFAULT 'customer' CHECK(role IN ('admin', 'staff', 'customer')),
          isAdmin BOOLEAN DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Migration 001: Users table created');

      // Create orders table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          customerName VARCHAR(100) NOT NULL,
          customerEmail VARCHAR(100) NOT NULL,
          customerPhone VARCHAR(20),
          customerAddress VARCHAR(255),
          products TEXT NOT NULL,
          totalPrice REAL NOT NULL,
          totalItems INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          notes TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      console.log('✅ Migration 001: Orders table created');

      // Create products table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(255) NOT NULL,
          brand VARCHAR(100) NOT NULL,
          category VARCHAR(100) NOT NULL,
          price REAL NOT NULL,
          originalPrice REAL,
          description TEXT,
          specs TEXT,
          image VARCHAR(500),
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Migration 001: Products table created');

      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 001 up error:', error.message);
    throw error;
  }
};

const down = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.execute('DROP TABLE IF EXISTS orders');
      await connection.execute('DROP TABLE IF EXISTS products');
      await connection.execute('DROP TABLE IF EXISTS users');
      console.log('✅ Migration 001: Tables dropped');
      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 001 down error:', error.message);
    throw error;
  }
};

module.exports = { up, down };
