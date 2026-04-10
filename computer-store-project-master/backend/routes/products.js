const express = require('express');
const productsController = require('../controllers/productsController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { uploadProductImage } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', productsController.getAllProducts);
router.get('/brands', productsController.getBrands);
router.get('/categories', productsController.getCategories);
router.get('/stock-check/:id', productsController.getStockCheck);
router.get('/:id', productsController.getProductById);

// Admin only routes
router.post('/upload-image', verifyToken, verifyAdmin, uploadProductImage.single('image'), productsController.uploadProductImage);
router.post('/', verifyToken, verifyAdmin, productsController.createProduct);
router.patch('/:id', verifyToken, verifyAdmin, productsController.updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, productsController.deleteProduct);

module.exports = router;
