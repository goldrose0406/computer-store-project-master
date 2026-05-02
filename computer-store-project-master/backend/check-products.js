const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'computerstore.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  
  console.log('🔍 Kiểm tra sản phẩm vừa tạo:\n');
  
  db.all(`SELECT id, name, brand, category, price, image FROM products WHERE name LIKE 'Test%' ORDER BY id DESC LIMIT 5`, [], (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
    } else if (rows && rows.length > 0) {
      console.log('✅ Tìm thấy sản phẩm test:');
      rows.forEach((row, idx) => {
        console.log(`${idx + 1}. ID: ${row.id}, Tên: ${row.name}, Thương hiệu: ${row.brand}, Giá: ${row.price}`);
      });
    } else {
      console.log('❌ Không tìm thấy sản phẩm test');
    }
    
    console.log('\n📊 Tổng số sản phẩm trong database:');
    db.get(`SELECT COUNT(*) as total FROM products`, [], (err, row) => {
      if (err) {
        console.error('Error:', err.message);
      } else {
        console.log(`${row.total} sản phẩm`);
      }
      db.close();
    });
  });
});
