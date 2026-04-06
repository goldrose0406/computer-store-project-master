/**
 * Migration 002: Add role column to users table
 * Thêm cột 'role' (admin, staff, customer) thay thế isAdmin
 */

const { pool } = require('../config/db');

const up = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Kiểm tra xem role column đã tồn tại chưa
      const tableInfo = await connection.execute(`PRAGMA table_info(users)`);
      const [columns] = tableInfo;
      
      const hasRoleColumn = columns.some(col => col.name === 'role');
      
      if (!hasRoleColumn) {
        // SQLite không hỗ trợ ALTER TABLE ADD COLUMN với CHECK constraint trực tiếp
        // Nên ta sử dụng raw SQL
        await connection.execute(`
          ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer'
        `);
        
        // Cập nhật role dựa vào isAdmin
        await connection.execute(`
          UPDATE users SET role = CASE 
            WHEN isAdmin = 1 THEN 'admin'
            ELSE 'customer'
          END
        `);
        
        console.log('✅ Migration 002: Role column added to users table');
      } else {
        console.log('✅ Migration 002: Role column already exists');
      }
      
      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 002 up error:', error.message);
    throw error;
  }
};

const down = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // SQLite không hỗ trợ DROP COLUMN trực tiếp, nhưng ta có thể bỏ qua
      console.log('⚠️ Migration 002: Downgrade không khả dụng trên SQLite');
      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 002 down error:', error.message);
    throw error;
  }
};

module.exports = { up, down };
