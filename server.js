if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');

const fundRoutes = require('./routes/funds');
const apiRoutes = require('./routes/api');
const pixRoutes = require('./routes/pix');

const app = express();
const pool = require('./db');

/* ================================
   CONFIGURAÇÕES BÁSICAS
================================ */

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   TESTE DO BANCO
================================ */

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Banco conectado com sucesso',
      time: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao conectar no banco'
    });
  }
});

/* ================================
   CRIAR USUÁRIO
================================ */

app.post('/create-user', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *',
      [name, email, password]
    );

    const account = await pool.query(
      'INSERT INTO accounts (user_id, balance) VALUES ($1, 0) RETURNING *',
      [user.rows[0].id]
    );

    res.json({
      message: 'Usuário criado',
      user: user.rows[0],
      account: account.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário', details: err.message });
  }
});


/* ================================
   CONSULTAR SALDO
================================ */

app.get('/balance/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT balance FROM accounts WHERE user_id = $1',
      [userId]
    );

    // Se não existir conta, retorna saldo 0
    if (result.rows.length === 0) {
      return res.json({ balance: 0 });
    }

    res.json({ balance: result.rows[0].balance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar saldo' });
  }
});


/* ================================
   TRANSFERÊNCIA INTERNA
================================ */

app.post('/transfer', async (req, res) => {
  const { fromUser, toUser, amount } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const from = await client.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [fromUser]
    );

    const to = await client.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [toUser]
    );

    if (from.rows[0].balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [amount, fromUser]
    );

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
      [amount, toUser]
    );

    await client.query('COMMIT');

    res.json({ message: 'Transferência realizada' });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* ================================
   OUTRAS ROTAS
================================ */

app.use('/api', apiRoutes);
app.use('/api', pixRoutes);
app.use('/funds', fundRoutes);

/* ================================
   ROTA TESTE
================================ */

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PlayPay API funcionando 🚀'
  });
});

/* ================================
   404
================================ */

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

/* ================================
   ERRO GLOBAL
================================ */

app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

/* ================================
   INICIAR SERVIDOR
================================ */

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        balance NUMERIC DEFAULT 0
      );
    `);

    console.log('Tabelas verificadas/criadas');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  }
}

const PORT = process.env.PORT || 3000;

createTables().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 PlayPay backend rodando na porta ${PORT}`);
  });
});

