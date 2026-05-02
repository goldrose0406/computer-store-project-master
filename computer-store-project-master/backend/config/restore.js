const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

const restoreDatabase = async () => {
  try {
    const backupPath = path.join(__dirname, '../backup.json');
    
    if (!fs.existsSync(backupPath)) {
      console.log('ℹ️  Không tìm thấy backup.json - Sẽ tạo database mới');
      return true;
    }
    
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    const connection = await pool.getConnection();
    
    console.log('📥 Đang khôi phục dữ liệu...');
    
    let restoredProducts = 0;
    let restoredUsers = 0;
    let productsWithImages = 0;
    
    // Restore sản phẩm (including base64 images)
    if (backup.products && backup.products.length > 0) {
      for (const product of backup.products) {
        try {
          // Check if image_base64 column exists (for version 2.0+ backups)
          if (product.image_base64) {
            await connection.execute(
              `INSERT OR IGNORE INTO products (id, name, brand, category, price, originalPrice, description, specs, image, image_base64, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                product.id, product.name, product.brand, product.category,
                product.price, product.originalPrice, product.description,
                product.specs, product.image, product.image_base64, product.createdAt, product.updatedAt
              ]
            );
            if (product.image_base64) productsWithImages++;
          } else {
            // Backward compatibility for older backups without image_base64
            await connection.execute(
              `INSERT OR IGNORE INTO products (id, name, brand, category, price, originalPrice, description, specs, image, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                product.id, product.name, product.brand, product.category,
                product.price, product.originalPrice, product.description,
                product.specs, product.image, product.createdAt, product.updatedAt
              ]
            );
          }
          restoredProducts++;
        } catch (e) {
          // Bỏ qua lỗi duplicate
        }
      }
      console.log(`✅ Khôi phục ${restoredProducts} sản phẩm`);
      if (productsWithImages > 0) {
        console.log(`   🖼️  ${productsWithImages} sản phẩm có ảnh base64`);
      }
    }
    
    // Restore users (chỉ non-admin, vì admin đã được tạo)
    if (backup.users && backup.users.length > 0) {
      for (const user of backup.users) {
        try {
          // Skip admin vì đã được tạo trong initDatabase
          if (user.email !== 'admin@computerstore.com' && user.email !== 'staff@computerstore.com') {
            await connection.execute(
              `INSERT OR IGNORE INTO users (id, name, email, role, isAdmin, createdAt)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [user.id, user.name, user.email, user.role, user.isAdmin, user.createdAt]
            );
            restoredUsers++;
          }
        } catch (e) {
          // Bỏ qua lỗi duplicate
        }
      }
      if (restoredUsers > 0) {
        console.log(`✅ Khôi phục ${restoredUsers} users`);
      }
    }
    
    connection.release();
    console.log('✅ Khôi phục dữ liệu thành công!');
    return true;
  } catch (error) {
    console.error('❌ Restore failed:', error.message);
    return false;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  restoreDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { restoreDatabase };
