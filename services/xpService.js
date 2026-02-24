const pool = require('../db');
const { updateLevel } = require('./levelService');

async function addXP(userId, amount) {
  await pool.query(
    'UPDATE gamer_wallet SET xp = xp + $1 WHERE user_id = $2',
    [amount, userId]
  );

  await updateLevel(userId);
}

module.exports = { addXP };