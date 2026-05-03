const { pool } = require('../config/db');

const ensureTransactionColumns = async (connection) => {
  try {
    await connection.execute("ALTER TABLE transactions ADD COLUMN source TEXT DEFAULT 'manual'");
  } catch (error) {
    if (!String(error.message || '').includes('duplicate column name')) {
      throw error;
    }
  }

  try {
    await connection.execute('ALTER TABLE transactions ADD COLUMN orderId INTEGER');
  } catch (error) {
    if (!String(error.message || '').includes('duplicate column name')) {
      throw error;
    }
  }
};

const syncDeliveredOrderTransactions = async () => {
  const connection = await pool.getConnection();

  try {
    await ensureTransactionColumns(connection);

    await connection.execute(`
      DELETE FROM transactions
      WHERE source = 'order'
        AND orderId NOT IN (SELECT id FROM orders WHERE status = 'delivered')
    `);

    const [deliveredOrders] = await connection.execute(`SELECT id, userId, customerName, totalPrice, createdAt
      FROM orders
      WHERE status = 'delivered'
    `);

    for (const order of deliveredOrders) {
      const [existing] = await connection.execute(
        "SELECT id FROM transactions WHERE source = 'order' AND orderId = ?",
        [order.id]
      );

      const title = `Doanh thu đơn hàng #${order.id}`;
      const description = `Tự động ghi nhận khi đơn hàng #${order.id} đã giao cho ${order.customerName || 'khách hàng'}`;
      const transactionDate = String(order.createdAt || new Date().toISOString()).slice(0, 10);
      const userId = order.userId || 1;

      if (existing.length > 0) {
        await connection.execute(
          `UPDATE transactions
           SET userId = ?, type = 'income', title = ?, amount = ?, category = 'Doanh thu đơn hàng',
               description = ?, transactionDate = ?, updatedAt = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [userId, title, Number(order.totalPrice || 0), description, transactionDate, existing[0].id]
        );
      } else {
        await connection.execute(
          `INSERT INTO transactions (userId, type, title, amount, category, description, transactionDate, source, orderId)
           VALUES (?, 'income', ?, ?, 'Doanh thu đơn hàng', ?, ?, 'order', ?)`,
          [userId, title, Number(order.totalPrice || 0), description, transactionDate, order.id]
        );
      }
    }
  } finally {
    connection.release();
  }
};

module.exports = {
  ensureTransactionColumns,
  syncDeliveredOrderTransactions
};
