const express = require('express');
const axios = require('axios');
const router = express.Router();

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_URL = 'https://api.asaas.com/v3';

// Criar cliente
router.post('/create-customer', async (req, res) => {
  try {
    const { name, cpf, email } = req.body;

    const response = await axios.post(
      `${ASAAS_URL}/customers`,
      {
        name,
        cpfCnpj: cpf,
        email
      },
      {
        headers: {
          access_token: ASAAS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// Criar cobrança PIX
router.post('/create-pix', async (req, res) => {
  try {
    const { customerId, value } = req.body;

    const response = await axios.post(
      `${ASAAS_URL}/payments`,
      {
        customer: customerId,
        billingType: 'PIX',
        value: value,
        dueDate: new Date().toISOString().split('T')[0]
      },
      {
        headers: {
          access_token: ASAAS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: 'Erro ao gerar PIX',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;
