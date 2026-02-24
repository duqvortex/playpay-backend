const router = require('express').Router();
const pool = require('../../db');

router.get('/ranking', async (req, res) => {
  const result = await pool.query(`
    SELECT u.name, g.xp, g.level
    FROM gamer_wallet g
    JOIN users u ON u.id = g.user_id
    ORDER BY g.xp DESC
    LIMIT 50
  `);

  res.json(result.rows);
});

module.exports = router;