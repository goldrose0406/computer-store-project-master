const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();
const { LEGACY_LAPTOP_CATEGORIES } = require('../utils/productCategories');

const dbPath = path.join(__dirname, '../computerstore.db');

// Create SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('📊 SQLite database connected');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Promisify database methods
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Create pool-like object for compatibility
const pool = {
  getConnection: async () => {
    return {
      execute: async (sql, params = []) => {
        let modifiedSql = sql;
        
        // Handle SQLite compatibility issues
        if (sql.includes('ENUM')) {
          modifiedSql = modifiedSql.replace(/ENUM\([^)]+\)/g, 'TEXT');
        }
        
        if (modifiedSql.includes('DECIMAL')) {
          modifiedSql = modifiedSql.replace(/DECIMAL\([^)]+\)/g, 'REAL');
        }
        
        if (modifiedSql.includes('INT AUTO_INCREMENT')) {
          modifiedSql = modifiedSql.replace(/INT AUTO_INCREMENT/g, 'INTEGER PRIMARY KEY AUTOINCREMENT');
        }
        
        if (modifiedSql.includes('TIMESTAMP DEFAULT CURRENT_TIMESTAMP')) {
          modifiedSql = modifiedSql.replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g, 'DATETIME DEFAULT CURRENT_TIMESTAMP');
        }
        
        if (modifiedSql.includes('ON UPDATE CURRENT_TIMESTAMP')) {
          modifiedSql = modifiedSql.replace(/ ON UPDATE CURRENT_TIMESTAMP/g, '');
        }

        // For SELECT queries
        if (sql.toUpperCase().startsWith('SELECT')) {
          const rows = await dbAll(modifiedSql, params);
          return [rows, []];
        }
        // For INSERT, UPDATE, DELETE
        else {
          const result = await dbRun(modifiedSql, params);
          return [result, []];
        }
      },
      release: () => {}
    };
  }
};

// Initialize database and tables
const initDatabase = async () => {
  try {
    // Create users table với role field
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role TEXT DEFAULT 'customer',
        isAdmin BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/exists');

    // Thêm role column nếu chưa có
    try {
      const tableInfo = await new Promise((resolve, reject) => {
        db.all('PRAGMA table_info(users)', (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      
      const hasRoleColumn = tableInfo.some(col => col.name === 'role');
      if (!hasRoleColumn) {
        await dbRun(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer'`);
        console.log('✅ Role column added to users table');
      }
    } catch (err) {
      // Bỏ qua nếu column đã tồn tại
    }

    // Create orders table
    await dbRun(`
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
    console.log('✅ Orders table created/exists');

    // Create products table
    await dbRun(`
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
        stock INTEGER DEFAULT 999,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Products table created/exists');

    // Thêm stock column nếu chưa có
    try {
      const tableInfo = await new Promise((resolve, reject) => {
        db.all('PRAGMA table_info(products)', (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      });
      
      const hasStockColumn = tableInfo.some(col => col.name === 'stock');
      if (!hasStockColumn) {
        await dbRun(`ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 999`);
        console.log('✅ Stock column added to products table');
      }
    } catch (err) {
      // Bỏ qua nếu column đã tồn tại
    }

    const legacyLaptopCategories = Array.from(LEGACY_LAPTOP_CATEGORIES).filter(
      (category) => category !== 'laptop'
    );

    if (legacyLaptopCategories.length > 0) {
      const placeholders = legacyLaptopCategories.map(() => '?').join(', ');
      const migrationResult = await dbRun(
        `UPDATE products SET category = 'laptop' WHERE category IN (${placeholders})`,
        legacyLaptopCategories
      );

      if (migrationResult.changes > 0) {
        console.log(`Normalized ${migrationResult.changes} legacy laptop products to category "laptop"`);
      }
    }

    // Create default accounts
    const bcryptjs = require('bcryptjs');

    // Admin account
    const adminEmail = 'admin@computerstore.com';
    const adminPassword = await bcryptjs.hash('Admin@123', 10);
    
    try {
      await dbRun(
        'INSERT INTO users (name, email, password, role, isAdmin) VALUES (?, ?, ?, ?, ?)',
        ['Admin', adminEmail, adminPassword, 'admin', 1]
      );
      console.log('✅ Admin account created (admin@computerstore.com / Admin@123)');
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        console.log('✅ Admin account already exists');
      } else {
        throw err;
      }
    }

    // Staff account
    const staffEmail = 'staff@computerstore.com';
    const staffPassword = await bcryptjs.hash('Staff@123', 10);
    
    try {
      await dbRun(
        'INSERT INTO users (name, email, password, role, isAdmin) VALUES (?, ?, ?, ?, ?)',
        ['Staff', staffEmail, staffPassword, 'staff', 0]
      );
      console.log('✅ Staff account created (staff@computerstore.com / Staff@123)');
    } catch (err) {
      if (!err.message.includes('UNIQUE')) {
        throw err;
      }
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
};

module.exports = { pool, initDatabase };
