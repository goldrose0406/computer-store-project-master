const { pool } = require('../config/db');

const seedProducts = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Delete old data (SQLite compatible)
      await connection.execute('DELETE FROM products');

      const products = [
        {
          name: 'MacBook Pro 16"',
          brand: 'Macbook',
          category: 'laptop',
          price: 45000000,
          originalPrice: 50000000,
          description: 'MacBook Pro 16 inch với chip Apple M3 Pro, 16GB RAM, SSD 512GB',
          specs: JSON.stringify({
            cpu: 'Apple M3 Pro',
            ram: '16GB',
            storage: '512GB SSD',
            display: '16 inch Retina XDR',
            battery: '20+ giờ'
          }),
          image: '/images/products/macbook-pro-16.webp'
        },
        {
          name: 'Asus VivoBook 15',
          brand: 'Asus',
          category: 'laptop',
          price: 15000000,
          originalPrice: 18000000,
          description: 'Laptop siêu mỏng với AMD Ryzen 7, 8GB RAM, SSD 512GB',
          specs: JSON.stringify({
            cpu: 'AMD Ryzen 7 5700U',
            ram: '8GB DDR4',
            storage: '512GB SSD',
            display: '15.6 inch FHD',
            battery: '13 giờ'
          }),
          image: '/images/products/asusvio15.webp'
        },
        {
          name: 'Lenovo ThinkBook 14',
          brand: 'Lenovo',
          category: 'laptop',
          price: 12000000,
          originalPrice: 14000000,
          description: 'Laptop kinh doanh chuyên nghiệp với hiệu suất cao',
          specs: JSON.stringify({
            cpu: 'Intel Core i7 12th Gen',
            ram: '16GB DDR5',
            storage: '512GB SSD',
            display: '14 inch FHD',
            battery: '12 giờ'
          }),
          image: '/images/products/lenovo14.webp'
        },
        {
          name: 'Acer Aspire 5',
          brand: 'Acer',
          category: 'laptop',
          price: 13000000,
          originalPrice: 15000000,
          description: 'Laptop gaming với GPU NVIDIA và CPU mạnh mẽ',
          specs: JSON.stringify({
            cpu: 'Intel Core i5 12th Gen',
            ram: '8GB DDR4',
            storage: '512GB SSD',
            display: '15.6 inch IPS',
            battery: '10 giờ'
          }),
          image: '/images/products/acer5.webp'
        },
        {
          name: 'MSI GE66 Raider',
          brand: 'MSI',
          category: 'laptop',
          price: 28000000,
          originalPrice: 32000000,
          description: 'Laptop gaming hiệu suất cao với RTX 4070',
          specs: JSON.stringify({
            cpu: 'Intel Core i7 13th Gen',
            ram: '32GB DDR5',
            storage: '1TB SSD',
            display: '15.6 inch 360Hz',
            battery: '4-5 giờ'
          }),
          image: '/images/products/msi66.jpg'
        },
        {
          name: 'MacBook Air M2',
          brand: 'Macbook',
          category: 'laptop',
          price: 28000000,
          originalPrice: 30000000,
          description: 'MacBook Air mỏng nhẹ với chip M2, 8GB RAM, SSD 256GB',
          specs: JSON.stringify({
            cpu: 'Apple M2',
            ram: '8GB',
            storage: '256GB SSD',
            display: '13.6 inch Liquid Retina',
            battery: '18 giờ'
          }),
          image: '/images/products/macbook-air-m2.webp'
        }
      ];

      for (const product of products) {
        await connection.execute(
          `INSERT INTO products (name, brand, category, price, originalPrice, description, specs, image)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.name,
            product.brand,
            product.category,
            product.price,
            product.originalPrice,
            product.description,
            product.specs,
            product.image
          ]
        );
      }

      console.log('✅ Products seeded successfully');
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Seed products error:', error.message);
  }
};

module.exports = { seedProducts };
