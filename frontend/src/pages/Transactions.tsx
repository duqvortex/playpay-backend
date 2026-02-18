import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// components
import Card from '../components/Card/Card';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

interface CardData {
  number: string;
  cvv: string;
  expiry: string;
  name: string;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
}

const Transactions: React.FC = () => {
  const [card, setCard] = useState<CardData | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const query = location.state?.query || '';

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setLoading(false);
      return;
    }

    // saldo
    fetch(`http://localhost:3000/api/user/${userId}`)
      .then(res => res.json())
      .then(data => setBalance(data.balance || 0))
      .catch(() => setBalance(0));

    // cartão
    fetch(`http://localhost:3000/api/card/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Cartão não encontrado');
        return res.json();
      })
      .then(data => {
        setCard(data);
        setLoading(false);
      })
      .catch(() => {
        fetch('http://localhost:3000/api/generate-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
          .then(res => res.json())
          .then(data => {
            setCard(data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });

    // transações
    fetch(`http://localhost:3000/api/transactions/${userId}`)
      .then(res => res.json())
      .then(data => {
        // garante que seja sempre um array
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      })
      .catch(() => {
        // fallback local
        setTransactions([
          { id: 1, description: 'Steam Purchase', amount: -50, date: '2026-01-10' },
          { id: 2, description: 'Game Reward', amount: 120, date: '2026-01-12' },
          { id: 3, description: 'Netflix', amount: -39, date: '2026-01-15' },
        ]);
      });
  }, []);

  // 🔎 filtro em tempo real
  const filteredTransactions = useMemo(() => {
    if (!query) return transactions;

    return transactions.filter(t =>
      t.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [transactions, query]);

  // ==========================
  // RESPAWN
  // ==========================
  const canRespawn = balance <= 0;

  const handleRespawn = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:3000/api/respawn/${userId}`, {
        method: 'POST'
      });

      const data = await res.json();
      setBalance(data.balance || 0);
    } catch (err) {
      console.error('Erro no respawn');
    }
  };

  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Transactions</h1>

<div style={{ textAlign: 'center', marginTop: 20 }}>
  <h3>Balance</h3>
  <p style={{ fontSize: 22, fontWeight: 'bold' }}>
    R$ {balance.toFixed(2)}
  </p>
</div>


      {/* CONTAINER DE RESPAWN */}
      {canRespawn && (
        <div
          style={{
            background: '#0c0f14',
            padding: 20,
            borderRadius: 14,
            margin: '20px',
            textAlign: 'center',
          }}
        >
          <p style={{ marginBottom: 10 }}>
            You are out of money. Respawn to continue.
          </p>

          <button
            onClick={handleRespawn}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#4ade80',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Respawn
          </button>
        </div>
      )}

      <Divider />

      {/* RESULTADOS DA BUSCA */}
      <div style={{ padding: '0 20px' }}>
        {query && (
          <p style={{ opacity: 0.6, marginBottom: 10 }}>
            Results for: "{query}"
          </p>
        )}

        {filteredTransactions.map(t => (
          <div
            key={t.id}
            style={{
              background: '#0c0f14',
              padding: 14,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <p>{t.description}</p>
            <strong>{t.amount}</strong>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <p>No results found</p>
        )}
      </div>

      <Divider />
    </Layout>
  );
};

export default Transactions;
