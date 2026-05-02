const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcryptjs = require('bcryptjs');

const dbPath = path.join(__dirname, 'computerstore.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

db.all("SELECT id, name, email, password FROM users WHERE email = 'admin@computerstore.com'", async (err, rows) => {
  if (err) {
    console.error('Query error:', err);
    process.exit(1);
  }

  if (rows.length === 0) {
    console.log('❌ Admin account not found in database');
    db.close();
    process.exit(1);
  }

  const admin = rows[0];
  console.log('\n📋 Admin Account Found:');
  console.log('ID:', admin.id);
  console.log('Name:', admin.name);
  console.log('Email:', admin.email);
  console.log('Password Hash:', admin.password);
  
  // Test password
  console.log('\n🔐 Testing password "Admin@123":');
  try {
    const isValid = await bcryptjs.compare('Admin@123', admin.password);
    console.log('Password Valid:', isValid);
    
    if (!isValid) {
      console.log('\n⚠️  Password does not match! Creating new hash...');
      const newHash = await bcryptjs.hash('Admin@123', 10);
      console.log('New hash:', newHash);
      
      // Update the password in database
      db.run(
        "UPDATE users SET password = ? WHERE email = 'admin@computerstore.com'",
        [newHash],
        (err) => {
          if (err) {
            console.error('Update error:', err);
          } else {
            console.log('✅ Password updated successfully!');
          }
          db.close();
          process.exit(0);
        }
      );
    } else {
      console.log('✅ Password is correct!');
      db.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('Error:', error);
    db.close();
    process.exit(1);
  }
});
