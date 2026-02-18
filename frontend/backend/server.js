const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// "banco de dados" temporário
let users = [
  {
    id: '1',
    name: 'Usuário',
    balance: 0
  }
];

// pegar saldo
app.get('/api/user/:userId', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  res.json(user);
});

// depósito
app.post('/api/deposit', (req, res) => {
  const { userId, amount } = req.body;

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  user.balance += amount;

  res.json({
    message: 'Depósito feito',
    balance: user.balance
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
