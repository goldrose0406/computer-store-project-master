const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

const backupDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Export sản phẩm (including base64 images)
    const [products] = await connection.execute('SELECT * FROM products');
    const [users] = await connection.execute('SELECT id, name, email, role, isAdmin, createdAt FROM users');
    const [orders] = await connection.execute('SELECT * FROM orders');
    
    const backup = {
      exportDate: new Date().toISOString(),
      version: '2.0', // Updated to version 2.0 for base64 support
      products: products,
      users: users,
      orders: orders
    };
    
    const backupPath = path.join(__dirname, '../backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
    connection.release();
    console.log('✅ Backup created:', backupPath);
    console.log(`   Products: ${products.length} (with base64 images)`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Orders: ${orders.length}`);
    return true;
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    return false;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  backupDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { backupDatabase };
