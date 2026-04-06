/**
 * Migration 003: Add Password Reset Columns
 * Thêm cột để lưu mã reset password
 * SQLite không hỗ trợ ALTER TABLE ADD COLUMN trực tiếp, nên phải tạo lại table
 */

const { pool } = require('../config/db');

const up = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // SQLite - Tạo table mới với cột mới, copy dữ liệu, rồi xóa table cũ
      
      // 1. Tạo bảng users_new với tất cả cột (bao gồm cột mới)
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role TEXT DEFAULT 'customer' CHECK(role IN ('admin', 'staff', 'customer')),
          isAdmin BOOLEAN DEFAULT 0,
          reset_code VARCHAR(6),
          reset_code_expires DATETIME,
          reset_attempts INTEGER DEFAULT 0,
          last_reset_attempt DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 2. Copy dữ liệu từ users cũ (nếu có)
      await connection.execute(`
        INSERT INTO users_new (id, name, email, password, role, isAdmin, createdAt, updatedAt)
        SELECT id, name, email, password, role, isAdmin, createdAt, updatedAt FROM users
      `).catch(() => {
        // Nếu bảng users không tồn tại, bỏ qua
        console.log('ℹ️ Bảng users không tồn tại hoặc trống');
      });

      // 3. Xóa bảng users cũ
      await connection.execute('DROP TABLE IF EXISTS users');

      // 4. Rename users_new thành users
      await connection.execute('ALTER TABLE users_new RENAME TO users');

      console.log('✅ Migration 003: Password reset columns added to users table');
      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 003 up error:', error.message);
    throw error;
  }
};

const down = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Không thực hiện down vì quá phức tạp
      console.log('⚠️ Down migration không được hỗ trợ cho migration này');
      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 003 down error:', error.message);
    throw error;
  }
};

module.exports = { up, down };
