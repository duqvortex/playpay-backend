import React, { useState } from 'react';

interface Fund {
  id: number;
  name: string;
  amount: number;
  aer: number;
  days: number;
  profit: string;
  total: string;
}

interface Props {
  fund: Fund;
}

const FundCard: React.FC<Props> = ({ fund }) => {
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');
  const currency = localStorage.getItem('currency') || 'BRL';

  // ==========================
  // DEPOSITAR
  // ==========================
  const deposit = async () => {
    const value = prompt('Quanto deseja depositar?');
    if (!value) return;

    const amount = Number(value);
    if (isNaN(amount) || amount <= 0) {
      alert('Valor inválido');
      return;
    }

    setLoading(true);

    try {
      await fetch('https://faithful-renewal-production.up.railway.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount,
          currency,
        }),
      });

      alert('Depósito realizado com sucesso!');
      window.location.reload();
    } catch (err) {
      alert('Erro ao depositar');
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // SACAR
  // ==========================
  const withdraw = async () => {
    const value = prompt('Quanto deseja sacar?');
    if (!value) return;

    const amount = Number(value);
    if (isNaN(amount) || amount <= 0) {
      alert('Valor inválido');
      return;
    }

    setLoading(true);

    try {
      await fetch('https://faithful-renewal-production.up.railway.app/funds/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount,
          currency,
        }),
      });

      alert('Saque realizado com sucesso!');
      window.location.reload();
    } catch (err) {
      alert('Erro ao sacar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 16,
        marginTop: 20,
        borderRadius: 12,
        background: '#1c1c1c',
      }}
    >
      <h3>{fund.name}</h3>

      <p>Investido: R$ {Number(fund.amount || 0).toFixed(2)}</p>
      <p>Total atual: R$ {fund.total || '0.00'}</p>

      <p style={{ color: '#00ff88' }}>
        Rendimento diário: {(((fund.aer || 0) / 365) * 100).toFixed(4)}%%
      </p>

      {fund.days > 0 && (
        <p style={{ color: '#00ffcc' }}>
          + R$ {fund.profit} em {fund.days} dia(s)
        </p>
      )}

      <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
        <button
          onClick={deposit}
          disabled={loading}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: 'none',
            background: '#22c55e',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Processando...' : 'Depositar'}
        </button>

        {fund.amount > 0 && (
<button
  onClick={withdraw}
  disabled={loading || fund.amount <= 0}
  style={{
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none',
    background: '#ff6a00',
    color: 'white',
    cursor: fund.amount <= 0 ? 'not-allowed' : 'pointer',
    opacity: fund.amount <= 0 ? 0.6 : 1,
  }}
>
  {loading ? 'Processando...' : 'Sacar'}
</button>

        )}
      </div>
    </div>
  );
};

export default FundCard;
