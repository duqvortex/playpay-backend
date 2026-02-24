import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Transactions.css';

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

    fetch(`https://faithful-renewal-production.up.railway.app/api/user/${userId}`)
      .then(res => res.json())
      .then(data => setBalance(data.balance || 0))
      .catch(() => setBalance(0));

    fetch(`https://faithful-renewal-production.up.railway.app/api/card/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Cartão não encontrado');
        return res.json();
      })
      .then(data => {
        setCard(data);
        setLoading(false);
      })
      .catch(() => {
        fetch('https://faithful-renewal-production.up.railway.app/api/generate-card', {
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

    fetch(`https://faithful-renewal-production.up.railway.app/api/transactions/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      })
      .catch(() => {
        setTransactions([
          { id: 1, description: 'Steam Purchase', amount: -50, date: '2026-01-10' },
          { id: 2, description: 'Game Reward', amount: 120, date: '2026-01-12' },
          { id: 3, description: 'Netflix', amount: -39, date: '2026-01-15' },
        ]);
      });
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!query) return transactions;

    return transactions.filter(t =>
      t.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [transactions, query]);

  const canRespawn = balance <= 0;

  const handleRespawn = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const res = await fetch(`https://faithful-renewal-production.up.railway.app/api/respawn/${userId}`, {
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

      <h1 className='playpay-title no-select'>Transactions</h1>

      <div className="playpay-balance-box">
        <h3>Balance</h3>
        <p className="playpay-balance-amount">
          R$ {balance.toFixed(2)}
        </p>
      </div>

      {canRespawn && (
        <div className="playpay-respawn-box">
          <p>You are out of money. Respawn to continue.</p>

          <button
            onClick={handleRespawn}
            className="playpay-respawn-btn"
          >
            Respawn
          </button>
        </div>
      )}

      <Divider />

      <div className="playpay-transactions-container">
        {query && (
          <p className="playpay-search-label">
            Results for: "{query}"
          </p>
        )}

        {filteredTransactions.map(t => (
          <div key={t.id} className="playpay-transaction-card">
            <p>{t.description}</p>
            <strong
              className={
                t.amount >= 0
                  ? 'amount-positive'
                  : 'amount-negative'
              }
            >
              {t.amount}
            </strong>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <p className="playpay-empty">No results found</p>
        )}
      </div>

      <Divider />
    </Layout>
  );
};

export default Transactions;