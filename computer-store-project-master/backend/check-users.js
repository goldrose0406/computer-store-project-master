const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'computerstore.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Lỗi kết nối:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Kết nối database thành công\n');
  
  // Check all users
  db.all('SELECT id, name, email, role, isAdmin, createdAt FROM users ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      console.error('❌ Lỗi truy vấn:', err.message);
      db.close();
      process.exit(1);
    }
    
    console.log('📊 DANH SÁCH TẤT CẢ TÀI KHOẢN:');
    console.log('============================================================================');
    if (rows && rows.length > 0) {
      console.log(`Tổng cộng: ${rows.length} tài khoản\n`);
      rows.forEach((user, idx) => {
        console.log(`${idx + 1}. ID: ${user.id}, Email: ${user.email}, Tên: ${user.name}`);
        console.log(`   Role: ${user.role}, isAdmin: ${user.isAdmin}, Ngày tạo: ${user.createdAt}`);
      });
    } else {
      console.log('❌ Không có tài khoản nào trong database');
    }
    console.log('============================================================================');
    
    // Check specific email
    console.log(`\n🔍 Tìm kiếm email: aydaaydo590@gmail.com`);
    db.get('SELECT * FROM users WHERE email = ?', ['aydaaydo590@gmail.com'], (err, row) => {
      if (err) {
        console.error('❌ Lỗi:', err.message);
      } else if (row) {
        console.log('✅ Tìm thấy:');
        console.log(JSON.stringify(row, null, 2));
      } else {
        console.log('❌ Email này không tồn tại trong database');
      }
      
      db.close();
      process.exit(0);
    });
  });
});
