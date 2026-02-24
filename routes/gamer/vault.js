const router = require('express').Router();
const pool = require('../../db');
const authMiddleware = require('../../middleware/auth');

router.post('/vault/deposit', authMiddleware, async (req, res) => {
  const { vaultId, amount } = req.body;
  const userId = req.user.id;

  if (!vaultId || !amount || amount <= 0) {
    return res.status(404).json({ error: 'Dados inválidos' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Bloqueia saldo real
    const account = await client.query(
      'SELECT balance FROM accounts WHERE user_id = $1 FOR UPDATE',
      [userId]
    );

    if (Number(account.rows[0].balance) < Number(amount)) {
      throw new Error('Saldo insuficiente');
    }

    // Subtrai saldo real
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [amount, userId]
    );

    // Atualiza vault
    const vault = await client.query(
      'SELECT * FROM game_vaults WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [vaultId, userId]
    );

    const newAmount =
      Number(vault.rows[0].saved_amount) + Number(amount);

    const completed =
      newAmount >= Number(vault.rows[0].target_price);

    await client.query(
      `UPDATE game_vaults
       SET saved_amount = $1,
           is_completed = $2
       WHERE id = $3`,
      [newAmount, completed, vaultId]
    );

    // XP por poupar
    await client.query(
      'UPDATE gamer_wallet SET xp = xp + $1 WHERE user_id = $2',
      [Math.floor(amount / 5), userId]
    );

    // Histórico
    await client.query(
      `INSERT INTO gamer_history (user_id, type, amount, description)
       VALUES ($1, 'vault_deposit', $2, 'Depósito em cofre de jogo')`,
      [userId, amount]
    );

    await client.query('COMMIT');

    res.json({ message: 'Depósito realizado com sucesso' });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(404).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;