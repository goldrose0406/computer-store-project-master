/**
 * Migration Runner
 * Chạy tất cả migrations theo thứ tự
 * Sử dụng: node config/runMigrations.js
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

const migrationsDir = path.join(__dirname, '../migrations');

const runMigrations = async () => {
  try {
    console.log('📦 Running migrations...\n');

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js')).sort();

    if (files.length === 0) {
      console.log('ℹ️  No migrations found');
      return;
    }

    for (const file of files) {
      console.log(`🔄 Executing: ${file}`);
      const migration = require(path.join(migrationsDir, file));
      
      try {
        await migration.up();
        console.log(`✅ ${file} completed\n`);
      } catch (error) {
        console.error(`❌ ${file} failed:`);
        console.error(error.message);
        console.log('\n');
      }
    }

    console.log('🎉 All migrations completed!');
  } catch (error) {
    console.error('❌ Migration runner error:', error.message);
    process.exit(1);
  }
};

// Chạy migrations
runMigrations();
