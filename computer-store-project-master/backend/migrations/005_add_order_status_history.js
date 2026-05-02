/**
 * Migration 005: Add Order Status History
 * Tạo bảng order_status_history để lưu lịch sử trạng thái đơn hàng
 */

const { pool } = require('../config/db');

const up = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Create order_status_history table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS order_status_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId INTEGER NOT NULL,
          oldStatus TEXT,
          newStatus TEXT NOT NULL,
          changedBy INTEGER,
          notes TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (changedBy) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      console.log('✅ Migration 005: Order status history table created');

      // Add index for better performance
      await connection.execute(`
        CREATE INDEX IF NOT EXISTS idx_order_status_history_orderId ON order_status_history(orderId)
      `);
      console.log('✅ Migration 005: Index created for order status history');

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 005 failed:', error);
    throw error;
  }
};

const down = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.execute('DROP TABLE IF EXISTS order_status_history');
      console.log('✅ Migration 005 rolled back: Order status history table dropped');
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 005 rollback failed:', error);
    throw error;
  }
};

module.exports = { up, down };