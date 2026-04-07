const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcryptjs = require('bcryptjs');
const dbPath = path.join(__dirname, 'computerstore.db');

async function addUser() {
  const db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
      console.error('❌ Lỗi kết nối:', err.message);
      process.exit(1);
    }
    
    try {
      const name = 'Ayda';
      const email = 'aydaaydo590@gmail.com';
      const password = 'password123'; // Mật khẩu mặc định - PHẢI ĐỔI SAU
      const role = 'customer';
      const isAdmin = 0;

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 10);

      console.log('📝 Thêm tài khoản:');
      console.log(`  - Email: ${email}`);
      console.log(`  - Tên: ${name}`);
      console.log(`  - Role: ${role}`);
      console.log(`  - Password: ${password} (PHẢI ĐỔI SAU LẦN ĐĂNG NHẬP ĐẦU)\n`);

      // Check if email already exists
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          console.error('❌ Lỗi kiểm tra:', err.message);
          db.close();
          process.exit(1);
        }

        if (row) {
          console.log('⚠️  Email này đã tồn tại trong database');
          db.close();
          process.exit(0);
        }

        // Insert new user
        db.run(
          'INSERT INTO users (name, email, password, role, isAdmin) VALUES (?, ?, ?, ?, ?)',
          [name, email, hashedPassword, role, isAdmin],
          function(err) {
            if (err) {
              console.error('❌ Lỗi thêm user:', err.message);
              db.close();
              process.exit(1);
            }

            console.log('✅ Tài khoản được tạo thành công!');
            console.log(`   ID: ${this.lastID}`);
            console.log(`   Email: ${email}`);
            console.log(`   Password: ${password}`);
            
            db.close();
            process.exit(0);
          }
        );
      });
    } catch (error) {
      console.error('❌ Lỗi:', error.message);
      db.close();
      process.exit(1);
    }
  });
}

addUser();
