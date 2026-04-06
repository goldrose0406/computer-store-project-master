/**
 * Migration 004: Add Stock Field
 * Thêm stock column vào products table
 */

const { pool } = require('../config/db');

const up = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Check if stock column already exists
      const tableInfo = await new Promise((resolve, reject) => {
        const sqlite3 = require('sqlite3');
        const db = new sqlite3.Database(require('path').join(__dirname, '../computerstore.db'), (err) => {
          if (err) reject(err);
          else {
            db.all('PRAGMA table_info(products)', (err, rows) => {
              db.close();
              if (err) reject(err);
              else resolve(rows || []);
            });
          }
        });
      });

      const hasStockColumn = tableInfo.some(col => col.name === 'stock');
      
      if (!hasStockColumn) {
        await connection.execute(`ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 999`);
        console.log('✅ Migration 004: Stock column added to products table');
      } else {
        console.log('✅ Migration 004: Stock column already exists');
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Migration 004 error:', error.message);
  }
};

module.exports = { up };
