const { pool } = require('../config/db');

const productsController = {
  // Kiểm tra và lấy tồn kho sản phẩm (public)
  getStockCheck: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }

      const connection = await pool.getConnection();

      try {
        const [products] = await connection.execute(
          'SELECT id, name, stock FROM products WHERE id = ?',
          [id]
        );

        if (products.length === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }

        const product = products[0];
        const inStock = (product.stock === null || product.stock === undefined || product.stock > 0);

        return res.status(200).json({
          message: 'Stock check',
          productId: product.id,
          productName: product.name,
          stock: product.stock || 999,
          inStock: inStock,
          status: inStock ? 'available' : 'out-of-stock'
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Stock check error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Lấy tất cả sản phẩm (public)
  getAllProducts: async (req, res) => {
    try {
      const { category, brand, priceMin, priceMax, search, page = 1, limit = 20 } = req.query;
      
      // Pagination params
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 20);
      const offset = (pageNum - 1) * limitNum;
      
      let query = 'SELECT * FROM products WHERE 1=1';
      let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
      const params = [];

      if (category) {
        query += ' AND category = ?';
        countQuery += ' AND category = ?';
        params.push(category);
      }

      if (brand) {
        query += ' AND brand = ?';
        countQuery += ' AND brand = ?';
        params.push(brand);
      }

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        countQuery += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (priceMin) {
        query += ' AND price >= ?';
        countQuery += ' AND price >= ?';
        params.push(parseFloat(priceMin));
      }

      if (priceMax) {
        query += ' AND price <= ?';
        countQuery += ' AND price <= ?';
        params.push(parseFloat(priceMax));
      }

      const connection = await pool.getConnection();

      try {
        // Get total count
        const [countResult] = await connection.execute(countQuery, params);
        const total = countResult[0].total;
        
        // Add pagination
        query += ` LIMIT ? OFFSET ?`;
        params.push(limitNum, offset);

        const [products] = await connection.execute(query, params);

        return res.status(200).json({
          message: 'Products retrieved',
          count: products.length,
          products,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: total,
            totalPages: Math.ceil(total / limitNum)
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Get products error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Lấy sản phẩm theo ID (public)
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }

      const connection = await pool.getConnection();

      try {
        const [products] = await connection.execute(
          'SELECT * FROM products WHERE id = ?',
          [id]
        );

        if (products.length === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({
          message: 'Product details',
          product: products[0]
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Get product error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Tạo sản phẩm (admin only)
  createProduct: async (req, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { name, brand, category, price, originalPrice, description, specs, image } = req.body;

      // Validation
      if (!name || !brand || !category || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (isNaN(price) || price < 0) {
        return res.status(422).json({ message: 'Invalid price' });
      }

      if (originalPrice && (isNaN(originalPrice) || originalPrice < price)) {
        return res.status(422).json({ message: 'Original price must be greater than or equal to price' });
      }

      const connection = await pool.getConnection();

      try {
        const [result] = await connection.execute(
          `INSERT INTO products (name, brand, category, price, originalPrice, description, specs, image)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            name,
            brand,
            category,
            price,
            originalPrice || price,
            description || null,
            specs ? JSON.stringify(specs) : null,
            image || null
          ]
        );

        return res.status(201).json({
          message: 'Product created successfully',
          productId: result.insertId,
          product: {
            id: result.insertId,
            name,
            brand,
            category,
            price,
            originalPrice: originalPrice || price
          }
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Cập nhật sản phẩm (admin only)
  updateProduct: async (req, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { id } = req.params;
      const { name, brand, category, price, originalPrice, description, specs, image } = req.body;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }

      // Validate price if provided
      if (price && (isNaN(price) || price < 0)) {
        return res.status(422).json({ message: 'Invalid price' });
      }

      const connection = await pool.getConnection();

      try {
        // Check if product exists
        const [products] = await connection.execute(
          'SELECT id FROM products WHERE id = ?',
          [id]
        );

        if (products.length === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (name !== undefined) {
          updates.push('name = ?');
          values.push(name);
        }
        if (brand !== undefined) {
          updates.push('brand = ?');
          values.push(brand);
        }
        if (category !== undefined) {
          updates.push('category = ?');
          values.push(category);
        }
        if (price !== undefined) {
          updates.push('price = ?');
          values.push(price);
        }
        if (originalPrice !== undefined) {
          updates.push('originalPrice = ?');
          values.push(originalPrice);
        }
        if (description !== undefined) {
          updates.push('description = ?');
          values.push(description);
        }
        if (specs !== undefined) {
          updates.push('specs = ?');
          values.push(specs ? JSON.stringify(specs) : null);
        }
        if (image !== undefined) {
          updates.push('image = ?');
          values.push(image);
        }

        if (updates.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(id);

        await connection.execute(
          `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
          values
        );

        return res.status(200).json({
          message: 'Product updated successfully',
          productId: id
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Update product error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Xóa sản phẩm (admin only)
  deleteProduct: async (req, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { id } = req.params;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }

      const connection = await pool.getConnection();

      try {
        const [result] = await connection.execute(
          'DELETE FROM products WHERE id = ?',
          [id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({
          message: 'Product deleted successfully',
          productId: id
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Lấy danh sách brands (public)
  getBrands: async (req, res) => {
    try {
      const connection = await pool.getConnection();

      try {
        const [brands] = await connection.execute(
          'SELECT DISTINCT brand FROM products ORDER BY brand'
        );

        return res.status(200).json({
          message: 'Brands retrieved',
          brands: brands.map(b => b.brand)
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Get brands error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Lấy danh sách categories (public)
  getCategories: async (req, res) => {
    try {
      const connection = await pool.getConnection();

      try {
        const [categories] = await connection.execute(
          'SELECT DISTINCT category FROM products ORDER BY category'
        );

        return res.status(200).json({
          message: 'Categories retrieved',
          categories: categories.map(c => c.category)
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Get categories error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = productsController;
