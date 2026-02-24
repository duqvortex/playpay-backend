require('dotenv').config();
const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const authMiddleware = require('./middleware/auth');

const fundRoutes = require('./routes/funds');
const apiRoutes = require('./routes/api');
const pixRoutes = require('./routes/pix');
const gamerWalletRoutes = require('./routes/gamer/wallet');
const gamerVaultRoutes = require('./routes/gamer/vault');
const gamerXpRoutes = require('./routes/gamer/xp');

const app = express();


console.log("Arquivo executado");
console.log(process.env.DATABASE_URL);

/* ================================
   CONFIGURAÇÕES BÁSICAS
================================ */

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/gamer', require('./routes/gamer/wallet'));
app.use('/gamer', require('./routes/gamer/vault'));
app.use('/gamer', require('./routes/gamer/xp'));
app.use('/gamer', require('./routes/gamer/ranking'));
app.use('/gamer', require('./routes/gamer/cashback'));
app.use('/gamer', require('./routes/gamer/ranking'));
app.use('/gamer', require('./routes/gamer/cashback'));
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
  try {
    const { name, cpf, password } = req.body;

    if (!cpf || !password) {
      return res.status(404).json({ message: 'CPF e senha são obrigatórios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pool.query(
      'INSERT INTO users (name, cpf, password) VALUES ($1, $2, $3) RETURNING id',
      [name, cpf, hashedPassword]
    );

    // cria conta automaticamente
    await pool.query(
      'INSERT INTO accounts (user_id, balance) VALUES ($1, 0)',
      [user.rows[0].id]
    );

    res.json({ message: 'Usuário criado com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

/* ================================
   LOGIN
================================ */

app.post('/login', async (req, res) => {
  try {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
      return res.status(404).json({
        error: "CPF e senha são obrigatórios"
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE cpf = $1",
      [cpf]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Usuário não encontrado"
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(404).json({
        error: "Senha incorreta"
      });
    }

    res.json({ message: "Login realizado com sucesso" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

/* ================================
   CONSULTAR SALDO
================================ */

app.get('/balance', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT balance FROM accounts WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.json({ balance: 0 });
    }

    res.json({ balance: result.rows[0].balance });

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar saldo' });
  }
});

/* ================================
   TRANSFERÊNCIA INTERNA
================================ */

app.post('/transfer', authMiddleware, async (req, res) => {
  const { toUser, amount } = req.body;
  const fromUser = req.user.id; // vem do token

  if (!toUser || !amount) {
    return res.status(404).json({ error: 'Dados inválidos' });
  }

  if (amount <= 0) {
    return res.status(404).json({ error: 'Valor inválido' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const from = await client.query(
      'SELECT * FROM accounts WHERE user_id = $1 FOR UPDATE',
      [fromUser]
    );

    const to = await client.query(
      'SELECT * FROM accounts WHERE user_id = $1 FOR UPDATE',
      [toUser]
    );

    if (from.rows.length === 0 || to.rows.length === 0) {
      throw new Error('Conta não encontrada');
    }

    if (Number(from.rows[0].balance) < Number(amount)) {
      throw new Error('Saldo insuficiente');
    }

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
      [amount, fromUser]
    );

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
      [amount, toUser]
    );

    await client.query('COMMIT');

    res.json({ message: 'Transferência realizada com sucesso' });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(404).json({ error: err.message });
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
   CRIAR TABELAS
================================ */

async function createTables() {
  try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        cpf TEXT UNIQUE,
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS gamer_wallet (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) UNIQUE,
        gamer_balance NUMERIC DEFAULT 0,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        cashback NUMERIC DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_vaults (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        game_name TEXT,
        target_price NUMERIC,
        saved_amount NUMERIC DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS gamer_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type TEXT,
        amount NUMERIC,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Tabelas verificadas/criadas');

  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  }
}
/* ================================
   INICIAR SERVIDOR
================================ */

const PORT = process.env.PORT || 3000;

createTables().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 PlayPay backend rodando na porta ${PORT}`);
  });
});