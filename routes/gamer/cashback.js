const router = require('express').Router();
const authMiddleware = require('../../middleware/auth');
const { redeemCashback } = require('../../services/cashbackService');

router.post('/cashback/redeem', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await redeemCashback(userId);

    res.json({ message: 'Cashback resgatado com sucesso' });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;