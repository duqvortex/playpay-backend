const express = require('express');
const router = express.Router();

const {
  createFund,
  getFund
} = require('./controllers/fundsController');

router.post('/create', createFund);
router.get('/:userId', getFund);

module.exports = router;
