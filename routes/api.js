require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const { v4: uuidv4 } = require('uuid');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const payment = new Payment(client);

const router = express.Router();
const pool = require('../db');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}


// ===========================
// ROTA DE DEPÓSITO VIA PIX
// ===========================
// ===========================
// DEPÓSITO VIA PIX
// ===========================
router.post('/deposit', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const userId = req.userId;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Valor inválido" });
  }

  try {
    const userResult = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const pagamento = await payment.create({
      body: {
        transaction_amount: Number(amount),
        description: "Depósito PlayPay",
        payment_method_id: "pix",
        external_reference: String(userId),
        payer: {
          email: userResult.rows[0].email
        }
      }
    });

    const qrData = pagamento.point_of_interaction.transaction_data;

    res.json({
      payment_id: pagamento.id,
      qr_code: qrData.qr_code,
      qr_base64: qrData.qr_code_base64
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar depósito" });
  }
});


// ===========================
// REGISTER
// ===========================
router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    cpf,
    address,
    cep,
    birth_date,
    phone
  } = req.body;

  try {

    // 🔎 VALIDAÇÃO COMPLETA
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !cpf ||
      !address ||
      !cep ||
      !birth_date ||
      !phone
    ) {
      return res.status(404).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (password !== confirmPassword) {
      return res.status(404).json({ message: 'As senhas não coincidem' });
    }

    if (password.length < 6) {
      return res.status(404).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
    }

// 🔎 Verifica EMAIL
const existingEmail = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

if (existingEmail.rows.length > 0) {
  return res.status(404).json({ message: 'Email já cadastrado' });
}

// 🔎 Verifica CPF
const existingCpf = await pool.query(
  'SELECT * FROM users WHERE cpf = $1',
  [cpf]
);

if (existingCpf.rows.length > 0) {
  return res.status(404).json({ message: 'CPF já cadastrado' });
}

    // 🔐 CRIPTOGRAFAR SENHA
    const hashedPassword = await bcrypt.hash(password, 10);

    const formattedDate = new Date(birth_date)
  .toISOString()
  .split('T')[0];

// ✅ Criar usuário completo
const newUser = await pool.query(
  `INSERT INTO users 
  (name, email, password, cpf, address, cep, birth_date, phone) 
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  RETURNING *`,
  [
    name,
    email,
    hashedPassword,
    cpf,
    address,
    cep,
    formattedDate, // ← aqui usamos a data formatada
    phone
  ]
);

    const user = newUser.rows[0];

    // Criar conta vinculada
    await pool.query(
      'INSERT INTO accounts (user_id, balance) VALUES ($1, $2)',
      [user.id, 0]
    );

    return res.status(201).json({
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});


// ===========================
// LOGIN
// ===========================
router.post('/login', async (req, res) => {
  try {
    const { cpf, password } = req.body;

    // 🔎 Validação básica
    if (!cpf || !password) {
      return res.status(404).json({ 
        message: 'CPF e senha são obrigatórios' 
      });
    }

    // 🔎 Buscar usuário pelo CPF
    const result = await pool.query(
      'SELECT * FROM users WHERE cpf = $1',
      [cpf]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuário não encontrado' 
      });
    }

    const user = result.rows[0];

    // 🔐 Comparar senha com hash
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(404).json({ 
        message: 'Senha incorreta' 
      });
    }

    // 💰 Buscar conta do usuário
    const accountResult = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [user.id]
    );

    const account = accountResult.rows[0];

    // 🔑 Gerar token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ✅ Retornar dados
    return res.json({
      token,
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      balance: account?.balance || 0
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ 
      message: 'Erro interno do servidor' 
    });
  }
});



// ===========================
// ENVIAR DINHEIRO
// ===========================
router.post('/transfer', authMiddleware, async (req, res) => {
  const { toCpf, amount } = req.body;
  const fromId = req.userId;

  if (!toCpf || !amount) {
    return res.status(404).json({ message: "CPF destino e valor são obrigatórios" });
  }

  const parsedAmount = Number(amount);

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(404).json({ message: "Valor inválido" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 🔎 Buscar remetente
    const senderResult = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [fromId]
    );

    if (senderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Usuário remetente não encontrado" });
    }

    // 🔎 Buscar destinatário pelo CPF
    const receiverResult = await client.query(
      'SELECT * FROM users WHERE cpf = $1',
      [toCpf]
    );

    if (receiverResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Destinatário não encontrado" });
    }

    const receiver = receiverResult.rows[0];

    if (receiver.id === fromId) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Você não pode transferir para si mesmo" });
    }

    // 🔎 Buscar conta do remetente
    const senderAccount = await client.query(
      'SELECT balance FROM accounts WHERE user_id = $1 FOR UPDATE',
      [fromId]
    );

    const currentBalance = Number(senderAccount.rows[0].balance);

    if (currentBalance < parsedAmount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Saldo insuficiente" });
    }

    // 💸 Debitar remetente
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [parsedAmount, fromId]
    );

    // 💰 Creditar destinatário
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
      [parsedAmount, receiver.id]
    );

    // 📝 Registrar transação
    const transaction = await client.query(
      `INSERT INTO transactions 
      (id, from_user, to_user, amount, type) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [uuidv4(), fromId, receiver.id, parsedAmount, 'transfer']
    );

    await client.query('COMMIT');

    res.json({
      message: "Transferência realizada com sucesso!",
      transaction: transaction.rows[0]
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Erro na transferência:", err);
    res.status(500).json({ message: "Erro no servidor" });
  } finally {
    client.release();
  }
});
// ===========================
// SOLICITAR CRÉDITO
// ===========================
router.post('/request-credit', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const userId = req.userId;

  try {
    const tx = await pool.query(
      `INSERT INTO transactions 
      (id, from_user, amount, type, status) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [uuidv4(), userId, amount, 'credit_request', 'pending']
    );

    res.json({
      message: "Solicitação enviada para análise",
      request: tx.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// ===========================
// ADICIONAR DINHEIRO
// ===========================
router.post('/add', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2 RETURNING balance',
      [amount, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await pool.query(
      'INSERT INTO transactions (id, from_user, amount, type) VALUES ($1, $2, $3, $4)',
      [uuidv4(), userId, amount, 'deposit']
    );

    res.json({
      message: "Dinheiro adicionado!",
      balance: result.rows[0].balance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
// ===========================
// SOLICITAR CRÉDITO (ENVIA PARA ANÁLISE)
// ===========================
router.post('/credit-request', authMiddleware, async (req, res) => {
  const { amount, installments, startDate } = req.body;
  const userId = req.userId;

  console.log("DEBUG BODY:", req.body);
  console.log("DEBUG USER:", userId);

  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  if (!amount || !installments || !startDate) {
    return res.status(404).json({ message: 'Dados incompletos' });
  }

  const parsedAmount = Number(amount);
  const parsedInstallments = Number(installments);

  if (isNaN(parsedAmount) || isNaN(parsedInstallments)) {
    return res.status(404).json({ message: 'Valores inválidos' });
  }


  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // 🔒 inicia transação

    // ===============================
    // 2️⃣ BUSCAR USUÁRIO
    // ===============================
    const userResult = await client.query(
      `SELECT credit_score, credit_limit, credit_used
       FROM users
       WHERE id = $1
       FOR UPDATE`, // 🔒 trava linha para evitar concorrência
      [userId]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = userResult.rows[0];

    // ===============================
    // 3️⃣ VALIDAR LIMITE DISPONÍVEL
    // ===============================
    const available = user.credit_limit - user.credit_used;

    if (amount > available) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: 'Limite insuficiente'
      });
    }

    // ===============================
    // 4️⃣ REGRA DE SCORE
    // ===============================
    let status;
    let interest;

    if (user.credit_score >= 750) {
      status = 'approved';
      interest = 0.015;
    } else if (user.credit_score >= 600) {
      status = 'approved';
      interest = 0.02;
    } else if (user.credit_score >= 404) {
      status = 'review';
      interest = 0.03;
    } else {
      status = 'rejected';
      interest = null;
    }

    // Ajuste opcional de risco por parcelas
    if (status !== 'rejected' && installments > 12) {
      interest += 0.005;
    }

    // ===============================
    // 5️⃣ CRIAR SOLICITAÇÃO
    // ===============================
    const creditResult = await client.query(
      `INSERT INTO credits 
       (user_id, amount, installments, interest, start_date, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, amount, installments, interest, startDate, status]
    );

    // ===============================
    // 6️⃣ ATUALIZAR LIMITE SE APROVADO
    // ===============================
    if (status === 'approved') {
      await client.query(
        `UPDATE users
         SET credit_used = credit_used + $1
         WHERE id = $2`,
        [amount, userId]
      );
    }

    await client.query('COMMIT'); // ✅ confirma tudo

    return res.json({
      message:
        status === 'approved'
          ? 'Crédito aprovado com sucesso'
          : status === 'review'
          ? 'Crédito enviado para revisão'
          : 'Crédito recusado',
      credit: creditResult.rows[0]
    });

  } catch (err) {
    await client.query('ROLLBACK'); // ❌ desfaz tudo se der erro
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  } finally {
    client.release(); // 🔓 libera conexão
  }
});


// ===========================
// LISTAR PARCELAS DO USUÁRIO
// ===========================
router.get('/installments/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT installments.*
      FROM installments
      JOIN credits ON credits.id = installments.credit_id
      WHERE credits.user_id = $1
      ORDER BY installments.number
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar parcelas' });
  }
});


// ===========================
// SACAR DINHEIRO
// ===========================
router.post('/withdraw', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const userId = req.userId;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Valor inválido" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const account = await client.query(
      'SELECT balance FROM accounts WHERE user_id = $1 FOR UPDATE',
      [userId]
    );

    if (account.rows.length === 0) {
      throw new Error("Conta não encontrada");
    }

    if (Number(account.rows[0].balance) < Number(amount)) {
      throw new Error("Saldo insuficiente");
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [amount, userId]
    );

    await client.query(
      `INSERT INTO transactions (id, from_user, amount, type, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [uuidv4(), userId, amount, 'withdraw', 'completed']
    );

    await client.query('COMMIT');

    res.json({ message: "Saque realizado com sucesso" });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
});

// ===========================
// SAQUE VIA PIX
// ===========================
router.post('/withdraw-pix', authMiddleware, async (req, res) => {
  const { amount, pixKey } = req.body;
  const userId = req.userId;

  if (!amount || amount <= 0 || !pixKey) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const account = await client.query(
      'SELECT balance FROM accounts WHERE user_id = $1 FOR UPDATE',
      [userId]
    );

    if (account.rows.length === 0) {
      throw new Error("Conta não encontrada");
    }

    if (Number(account.rows[0].balance) < Number(amount)) {
      throw new Error("Saldo insuficiente");
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [amount, userId]
    );

    const transaction = await client.query(
      `INSERT INTO transactions 
       (id, from_user, amount, type, pix_key, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [uuidv4(), userId, amount, 'withdraw_pix', pixKey, 'pending']
    );

    await client.query('COMMIT');

    res.json({
      message: "Saque PIX solicitado",
      transaction: transaction.rows[0]
    });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
});

// ===========================
// BUSCAR USUÁRIO + SALDO
// ===========================
router.get('/user/:id', authMiddleware, async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar,
        COALESCE(a.balance, 0) AS balance
      FROM users u
      LEFT JOIN accounts a ON a.user_id = u.id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Erro na rota /user/:id →", err);
    res.status(500).json({ message: "Erro interno" });
  }
});



// ===========================
// RECUPERAR SALDO E HISTÓRICO
// ===========================
router.get('/user/:id', async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT name, balance FROM public.users WHERE id = $1',
      [req.params.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({
      name: userResult.rows[0].name,
      balance: userResult.rows[0].balance
    });

  } catch (err) {
    console.error("Erro real:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});



// ===========================
// GERAR CARTÃO VIRTUAL
// ===========================
router.post('/generate-card', async (req, res) => {
  const { userId } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    function generateCardNumber() {
      let number = '';
      for (let i = 0; i < 16; i++) {
        number += Math.floor(Math.random() * 10);
      }
      return number.match(/.{1,4}/g).join(' ');
    }

    const newCard = {
      number: generateCardNumber(),
      name: userResult.rows[0].name.toUpperCase(),
      expiry: '12/30',
      cvv: Math.floor(100 + Math.random() * 900)
    };

    res.json(newCard);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// ===========================
// ADMIN - LISTAR SAQUES PIX
// ===========================
router.get('/admin/withdrawals', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id, t.amount, t.pix_key, t.status, u.name, u.email
       FROM transactions t
       JOIN users u ON u.id = t.from_user
       WHERE t.type = 'withdraw_pix'
       ORDER BY t.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// ===========================
// ADMIN - APROVAR SAQUE PIX
// ===========================
router.post('/admin/approve', async (req, res) => {
  const { transactionId } = req.body;

  try {
    const txResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [transactionId]
    );

    const tx = txResult.rows[0];

    if (!tx) {
      return res.status(404).json({ message: "Transação não encontrada" });
    }

    if (tx.status !== 'pending') {
      return res.status(404).json({ message: "Transação já processada" });
    }

    // Enviar PIX (simulado)
    const pixResult = await sendPixPayment(tx.pix_key, tx.amount);

    if (!pixResult.success) {
      return res.status(500).json({ message: "Erro ao enviar PIX" });
    }

    await pool.query(
      'UPDATE transactions SET status = $1 WHERE id = $2',
      ['completed', transactionId]
    );

    res.json({ message: "PIX enviado com sucesso" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});


// ===========================
// ADMIN - REJEITAR SAQUE PIX
// ===========================
router.post('/admin/reject', async (req, res) => {
  const { transactionId } = req.body;

  try {
    // Buscar transação
    const txResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [transactionId]
    );

    const tx = txResult.rows[0];

    if (!tx) {
      return res.status(404).json({ message: "Transação não encontrada" });
    }

    // Devolver saldo
    await pool.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
      [tx.amount, tx.from_user]
    );

    // Atualizar status
    await pool.query(
      'UPDATE transactions SET status = $1 WHERE id = $2',
      ['rejected', transactionId]
    );

    res.json({ message: "Saque rejeitado e saldo devolvido" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// ===========================
// ADMIN - APROVAR CRÉDITO
// ===========================
router.post('/admin/approve-credit', async (req, res) => {
  const { transactionId } = req.body;

  try {
    const txResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [transactionId]
    );

    const tx = txResult.rows[0];

    if (!tx) {
      return res.status(404).json({ message: "Transação não encontrada" });
    }

    if (tx.status !== 'pending') {
      return res.status(404).json({ message: "Já processada" });
    }

    // adicionar saldo
    await pool.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
      [tx.amount, tx.from_user]
    );

    // atualizar status
    await pool.query(
      'UPDATE transactions SET status = $1 WHERE id = $2',
      ['approved', transactionId]
    );

    res.json({ message: "Crédito aprovado" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
// ===========================
// ADMIN - LISTAR CRÉDITOS PENDENTES
// ===========================
router.get('/admin/credit-requests', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.name, u.email
       FROM credits c
       JOIN users u ON u.id = c.user_id
       WHERE c.status = 'pending'
       ORDER BY c.id DESC`
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});



// ===========================
// ADMIN - LISTAR USUÁRIOS
// ===========================
router.get('/admin/users', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        email,
        balance,
        credit_score,
        credit_limit,
        credit_used,
        (credit_limit - credit_used) AS available_limit
      FROM users
      ORDER BY credit_score DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});


// ===========================
// COBRANÇA AUTOMÁTICA
// ===========================
async function processMonthlyDebits() {
  try {
    const today = new Date();

    const dueInstallments = await pool.query(
      `
      SELECT i.*, c.user_id
      FROM installments i
      JOIN credits c ON c.id = i.credit_id
      WHERE i.due_date <= $1
      AND i.status IS NULL
      `,
      [today]
    );

    for (const inst of dueInstallments.rows) {
      const user = await pool.query(
        'SELECT balance FROM accounts WHERE user_id = $1',
        [inst.user_id]
      );

      const balance = Number(user.rows[0].balance);

      if (balance >= inst.amount) {
        // libera limite rotativo
await pool.query(
  'UPDATE users SET credit_used = credit_used - $1 WHERE id = $2',
  [inst.amount, inst.user_id]
);

        // debita

        await pool.query(
          'UPDATE installments SET status = $1 WHERE id = $2',
          ['paid', inst.id]
        );

        await pool.query(
          `INSERT INTO payments (installment_id, user_id, amount, status)
           VALUES ($1, $2, $3, $4)`,
          [inst.id, inst.user_id, inst.amount, 'on_time']
        );

      } else {
        // atraso
        await pool.query(
          'UPDATE installments SET status = $1 WHERE id = $2',
          ['late', inst.id]
        );

        await pool.query(
          `INSERT INTO payments (installment_id, user_id, amount, status)
           VALUES ($1, $2, $3, $4)`,
          [inst.id, inst.user_id, inst.amount, 'late']
        );
      }

      // atualiza score
      await updateUserScore(inst.user_id);
    }

  } catch (err) {
    console.error('Erro no débito automático:', err);
  }
}


// ===========================
// WEBHOOK MERCADO PAGO
// ===========================
router.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook recebido:", req.body);

    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const resultado = await payment.get({ id: paymentId });

    if (resultado.status !== "approved") {
      return res.sendStatus(200);
    }

    const userId = resultado.external_reference;
    const amount = resultado.transaction_amount;

    // Evitar duplicação
    const existing = await pool.query(
      'SELECT * FROM transactions WHERE payment_id = $1',
      [paymentId]
    );

    if (existing.rows.length > 0) {
      console.log("Pagamento já processado");
      return res.sendStatus(200);
    }

    const clientDb = await pool.connect();

    try {
      await clientDb.query("BEGIN");

      // adicionar saldo
      await clientDb.query(
        'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
        [amount, userId]
      );

      // registrar transação
      await clientDb.query(
        `INSERT INTO transactions
        (id, from_user, amount, type, payment_id, status)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          uuidv4(),
          userId,
          amount,
          'deposit',
          paymentId,
          'completed'
        ]
      );

      await clientDb.query("COMMIT");
      console.log("Saldo atualizado com sucesso");

    } catch (err) {
      await clientDb.query("ROLLBACK");
      throw err;
    } finally {
      clientDb.release();
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("Erro no webhook:", err);
    res.sendStatus(500);
  }
});

// ==========================
// 🛒 MARKETPLACE
// ==========================

// Listar produtos
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Comprar produto
router.post('/buy/:productId', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { productId } = req.params;

  try {
  const user = await pool.query(
  'SELECT balance FROM accounts WHERE user_id = $1',
  [userId]
);

    const product = await pool.query(
      'SELECT price FROM products WHERE id = $1',
      [productId]
    );

    if (!user.rows.length || !product.rows.length) {
      return res.status(404).json({ error: 'Usuário ou produto não encontrado' });
    }

    if (Number(user.rows[0].balance) < Number(product.rows[0].price)) {
      return res.status(404).json({ error: 'Saldo insuficiente' });
    }

    // desconta saldo
    await pool.query(
      'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
      [product.rows[0].price, userId]
    );

    // registra compra
    await pool.query(
      'INSERT INTO purchases (user_id, product_id) VALUES ($1, $2)',
      [userId, productId]
    );

    res.json({ message: 'Compra realizada com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});


// ===========================
// EXPORTS
// ===========================
module.exports = router;
module.exports.processMonthlyDebits = processMonthlyDebits;
