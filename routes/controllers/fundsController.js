// routes/controllers/fundsController.js

let funds = {}; // simulação em memória

// POST /funds/create
exports.createFund = (req, res) => {
  const { userId, amount } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: 'userId é obrigatório'
    });
  }

  if (!funds[userId]) {
    funds[userId] = {
      invested: 0,
      total: 0,
      dailyYield: 0.02 // 2% ao dia (exemplo)
    };
  }

  funds[userId].invested += Number(amount || 0);
  funds[userId].total = funds[userId].invested;

  res.json({
    message: 'Fundo criado/atualizado',
    fund: funds[userId]
  });
};

// GET /funds/:userId
exports.getFund = (req, res) => {
  const { userId } = req.params;

  const fund = funds[userId];

  if (!fund) {
    return res.json({
      invested: 0,
      total: 0,
      dailyYield: 0
    });
  }

  res.json(fund);
};
