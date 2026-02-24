const pool = require('../db');
const { addXP } = require('./xpService');

async function depositToVault(userId, vaultId, amount) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const account = await client.query(
      'SELECT balance FROM accounts WHERE user_id = $1 FOR UPDATE',
      [userId]
    );

    if (Number(account.rows[0].balance) < Number(amount)) {
      throw new Error('Saldo insuficiente');
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [amount, userId]
    );

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

    await addXP(userId, Math.floor(amount / 5));

    await client.query(
      `INSERT INTO gamer_history (user_id, type, amount, description)
       VALUES ($1, 'vault_deposit', $2, 'Depósito em cofre')`,
      [userId, amount]
    );

    await client.query('COMMIT');

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { depositToVault };