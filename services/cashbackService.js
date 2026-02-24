const pool = require('../db');

async function redeemCashback(userId) {
  const wallet = await pool.query(
    'SELECT cashback FROM gamer_wallet WHERE user_id = $1',
    [userId]
  );

  const value = wallet.rows[0].cashback;

  if (value <= 0) {
    throw new Error('Sem cashback disponível');
  }

  await pool.query(
    'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
    [value, userId]
  );

  await pool.query(
    'UPDATE gamer_wallet SET cashback = 0 WHERE user_id = $1',
    [userId]
  );
}

module.exports = { redeemCashback };