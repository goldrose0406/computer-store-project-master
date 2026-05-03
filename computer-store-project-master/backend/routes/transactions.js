const express = require('express');
const transactionsController = require('../controllers/transactionsController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, transactionsController.getTransactions);
router.get('/:id', verifyToken, transactionsController.getTransactionById);
router.post('/', verifyToken, transactionsController.createTransaction);
router.patch('/:id', verifyToken, transactionsController.updateTransaction);
router.delete('/:id', verifyToken, transactionsController.deleteTransaction);

module.exports = router;
