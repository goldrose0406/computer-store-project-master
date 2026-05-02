const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'computerstore.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  
  console.log('🔍 Kiểm tra sản phẩm MacBook Pro M3 Max Test:\n');
  
  db.all(`SELECT id, name, brand, category, price FROM products WHERE name LIKE '%MacBook Pro M3%' ORDER BY id DESC LIMIT 5`, [], (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
    } else if (rows && rows.length > 0) {
      console.log('✅ Tìm thấy sản phẩm MacBook Pro:');
      rows.forEach((row, idx) => {
        console.log(`${idx + 1}. ID: ${row.id}, Tên: ${row.name}, Brand: ${row.brand}, Category: ${row.category}, Giá: ${row.price}`);
      });
    } else {
      console.log('❌ Không tìm thấy sản phẩm MacBook Pro M3 Max Test');
      
      console.log('\n🔍 Lấy 5 sản phẩm mới nhất:');
      db.all(`SELECT id, name, brand, price FROM products ORDER BY id DESC LIMIT 5`, [], (err, rows) => {
        if (err) {
          console.error('Error:', err.message);
        } else {
          rows.forEach((row, idx) => {
            console.log(`${idx + 1}. ID: ${row.id}, Tên: ${row.name}, Brand: ${row.brand}, Giá: ${row.price}`);
          });
        }
        db.close();
      });
      return;
    }
    db.close();
  });
});
