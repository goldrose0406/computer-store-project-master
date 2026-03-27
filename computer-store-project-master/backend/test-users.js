const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'computerstore.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT id, email, isAdmin, createdAt FROM users', (err, rows) => {
  if (err) {
    console.error('❌ Lỗi:', err.message);
  } else {
    console.log('\n📋 DANH SÁCH TÀI KHOẢN ĐÃ ĐĂNG KÍ:\n');
    if (rows.length === 0) {
      console.log('⚠️  Chưa có tài khoản nào');
    } else {
      console.table(rows);
      console.log(`\n✅ Tổng cộng: ${rows.length} tài khoản`);
    }
  }
  db.close();
});
