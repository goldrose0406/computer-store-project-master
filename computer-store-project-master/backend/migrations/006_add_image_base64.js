/**
 * Migration 006: Add Base64 Image Storage
 * Thêm cột image_base64 để lưu ảnh dưới dạng base64 trong database
 */

const { pool } = require('../config/db');

const up = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Add image_base64 column to products table
      await connection.execute(`
        ALTER TABLE products ADD COLUMN image_base64 LONGTEXT
      `);
      console.log('✅ Migration 006: image_base64 column added to products table');

      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    // Ignore if column already exists
    if (error.message.includes('Duplicate column')) {
      console.log('ℹ️  Migration 006: image_base64 column already exists');
      return true;
    }
    console.error('❌ Migration 006 up error:', error.message);
    throw error;
  }
};

const down = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.execute(`
        ALTER TABLE products DROP COLUMN image_base64
      `);
      console.log('✅ Migration 006: image_base64 column removed');
      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 006 down error:', error.message);
    throw error;
  }
};

module.exports = { up, down };
