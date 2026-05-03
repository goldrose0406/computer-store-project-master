const { pool } = require('../config/db');

const addColumnIfMissing = async (connection, columnName, sql) => {
  try {
    await connection.execute(sql);
  } catch (error) {
    if (!String(error.message || '').includes('duplicate column name')) {
      throw error;
    }
  }
};

const up = async () => {
  const connection = await pool.getConnection();

  try {
    await addColumnIfMissing(
      connection,
      'source',
      "ALTER TABLE transactions ADD COLUMN source TEXT DEFAULT 'manual'"
    );
    await addColumnIfMissing(
      connection,
      'orderId',
      'ALTER TABLE transactions ADD COLUMN orderId INTEGER'
    );

    console.log('✅ Migration 008: Transaction order source columns added');
    return true;
  } finally {
    connection.release();
  }
};

const down = async () => {
  console.log('Migration 008 down skipped: SQLite cannot safely drop columns in this project wrapper');
  return true;
};

module.exports = { up, down };
