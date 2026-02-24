const pool = require('../db');

async function updateLevel(userId) {
  const result = await pool.query(
    'SELECT xp FROM gamer_wallet WHERE user_id = $1',
    [userId]
  );

  const xp = result.rows[0].xp;
  const level = Math.floor(xp / 100) + 1;

  await pool.query(
    'UPDATE gamer_wallet SET level = $1 WHERE user_id = $2',
    [level, userId]
  );
}

module.exports = { updateLevel };