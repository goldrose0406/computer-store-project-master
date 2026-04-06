/**
 * Quick script to check users in database
 * Usage: node check-users.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'computerstore.db');

console.log('📊 Checking users in database...\n');
console.log(`Database path: ${dbPath}\n`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }

  db.all('SELECT id, name, email, role, isAdmin, createdAt FROM users', (err, rows) => {
    if (err) {
      console.error('❌ Error querying users:', err.message);
      db.close();
      process.exit(1);
    }

    console.log('✅ All Users in Database:\n');
    console.log('═══════════════════════════════════════════════════════════════');
    
    if (rows && rows.length > 0) {
      rows.forEach((user, index) => {
        console.log(`\n User ${index + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  isAdmin: ${user.isAdmin}`);
        console.log(`  Created: ${user.createdAt}`);
      });
    } else {
      console.log('ℹ️  No users found');
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    db.close();
  });
});
