const express = require('express');
const router = express.Router();
const pool = require('../../db');
const authMiddleware = require('../../middleware/auth');

/* Criar carteira gamer automaticamente */
router.post('/init', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO gamer_wallet (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [req.user.id]
    );

    res.json({ message: 'Carteira gamer pronta' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar carteira gamer' });
  }
});

/* Consultar carteira gamer */
router.get('/wallet', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gamer_wallet WHERE user_id = $1',
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar carteira gamer' });
  }
});

/* Transferir saldo principal → gamer */
router.post('/deposit', authMiddleware, async (req, res) => {
  const { amount } = req.body;

  if (amount <= 0) {
    return res.status(404).json({ error: 'Valor inválido' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const account = await client.query(
      'SELECT balance FROM accounts WHERE user_id = $1 FOR UPDATE',
      [req.user.id]
    );

    if (Number(account.rows[0].balance) < Number(amount)) {
      throw new Error('Saldo insuficiente');
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [amount, req.user.id]
    );

    await client.query(
      'UPDATE gamer_wallet SET gamer_balance = gamer_balance + $1, xp = xp + 10 WHERE user_id = $2',
      [amount, req.user.id]
    );

    await client.query('COMMIT');

    res.json({ message: 'Depositado na carteira gamer' });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(404).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;