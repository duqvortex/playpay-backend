const express = require('express');
const router = express.Router();
const pool = require('../../db');
const authMiddleware = require('../../middleware/auth');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT xp, level, cashback FROM gamer_wallet WHERE user_id = $1',
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perfil gamer' });
  }
});

module.exports = router;