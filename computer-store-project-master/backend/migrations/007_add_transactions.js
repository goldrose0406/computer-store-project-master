const { pool } = require('../config/db');

const up = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        title VARCHAR(255) NOT NULL,
        amount REAL NOT NULL CHECK(amount > 0),
        category VARCHAR(100) NOT NULL,
        description TEXT,
        transactionDate DATE NOT NULL DEFAULT CURRENT_DATE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Migration 007: Transactions table created');
    return true;
  } finally {
    connection.release();
  }
};

const down = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.execute('DROP TABLE IF EXISTS transactions');
    console.log('✅ Migration 007: Transactions table dropped');
    return true;
  } finally {
    connection.release();
  }
};

module.exports = { up, down };
