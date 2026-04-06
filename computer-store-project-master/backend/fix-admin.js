/**
 * Direct database fix - Set admin account to have isAdmin = 1
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'computerstore.db');

console.log('🔧 Setting admin account to isAdmin = 1...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }

  // Update admin account
  db.run(
    'UPDATE users SET isAdmin = 1, role = ? WHERE email = ?',
    ['admin', 'admin@computerstore.com'],
    function(err) {
      if (err) {
        console.error('❌ Error updating admin:', err.message);
        db.close();
        process.exit(1);
      }

      console.log('✅ Updated Admin account!');
      console.log(`   Changes applied: ${this.changes} row(s)\n`);

      // Show all users
      db.all('SELECT id, name, email, role, isAdmin FROM users', (err, rows) => {
        if (err) {
          console.error('❌ Error querying users:', err.message);
          db.close();
          process.exit(1);
        }

        console.log('📋 All Users:\n');
        if (rows && rows.length > 0) {
          rows.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email})`);
            console.log(`   Role: ${user.role} | isAdmin: ${user.isAdmin}\n`);
          });
        }

        db.close();
        console.log('✅ Done!');
      });
    }
  );
});
