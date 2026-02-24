// ClanFinance.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import axios from 'axios';

interface ClanPlan {
  id: string;
  name: string;
  creatorId: string;
  creatorName: string;
  balance: number;
}

const ClanFinance: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('Usuário');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [plans, setPlans] = useState<ClanPlan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Carregar avatar e nome igual Home
  const loadUser = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://faithful-renewal-production.up.railway.app/api/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserName(res.data.name || 'Usuário');
      setAvatarUrl(res.data.avatar || null);
    } catch (err) {
      console.error(err);
    }
  };

  // Carregar planos/clãs
  const loadPlans = async () => {
    try {
      const res = await axios.get(
        'https://faithful-renewal-production.up.railway.app/clans',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlans(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUser();
    loadPlans();
  }, []);

  // Criar novo plano
  const handleCreatePlan = async () => {
    if (!newPlanName) return alert('Digite um nome para o plano');
    try {
      const res = await axios.post(
        'https://faithful-renewal-production.up.railway.app/clans',
        { name: newPlanName, creatorId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlans([...plans, res.data]);
      setNewPlanName('');
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao criar plano');
    }
  };

  // Depositar
  const handleDeposit = async () => {
    if (!depositAmount || !selectedPlanId) return;
    try {
      const res = await axios.post(
        `https://faithful-renewal-production.up.railway.app/clans/${selectedPlanId}/deposit`,
        { userId, amount: Number(depositAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Atualizar saldo localmente
      setPlans(plans.map(p => p.id === selectedPlanId ? { ...p, balance: res.data.balance } : p));
      setDepositAmount('');
      setSelectedPlanId(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao depositar');
    }
  };

  // Sacar (apenas criador)
  const handleWithdraw = async (plan: ClanPlan) => {
    if (plan.creatorId !== userId) return alert('Apenas o criador pode sacar');
    try {
      const res = await axios.post(
        `https://faithful-renewal-production.up.railway.app/clans/${plan.id}/withdraw`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlans(plans.map(p => p.id === plan.id ? { ...p, balance: res.data.balance } : p));
    } catch (err) {
      console.error(err);
      alert('Erro ao sacar');
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.userHeader}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}></div>
          )}
          <h2 style={styles.userName}>{userName}</h2>
        </div>

        <Divider />

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <button style={styles.neonButton} onClick={() => setShowModal(true)}>
            + Criar Plano / Clã
          </button>
        </div>

        {/* Lista de planos */}
        {plans.length === 0 ? (
          <p>Nenhum plano criado ainda</p>
        ) : (
          <div style={styles.grid}>
            {plans.map(plan => (
              <div key={plan.id} style={styles.card}>
                <h3>{plan.name}</h3>
                <p>Criador: {plan.creatorName}</p>
                <p>Saldo: R$ {plan.balance.toFixed(2)}</p>
                <div style={{ marginTop: 10 }}>
                  <button
                    style={styles.smallButton}
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                    }}
                  >
                    Depositar
                  </button>
                  {plan.creatorId === userId && (
                    <button
                      style={{ ...styles.smallButton, marginLeft: 8, background: '#ef4444' }}
                      onClick={() => handleWithdraw(plan)}
                    >
                      Sacar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Criar Plano */}
        {showModal && (
          <div style={styles.modal}>
            <div style={styles.box}>
              <h3 style={styles.gradientTitle}>Criar Plano / Clã</h3>
              <input
                type="text"
                placeholder="Nome do plano"
                value={newPlanName}
                onChange={e => setNewPlanName(e.target.value)}
                style={styles.input}
              />
              <button onClick={handleCreatePlan} style={styles.neonButton}>
                Criar
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ ...styles.close, marginTop: 10 }}
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Modal Depositar */}
        {selectedPlanId && (
          <div style={styles.modal}>
            <div style={styles.box}>
              <h3 style={styles.gradientTitle}>Depositar no plano</h3>
              <input
                type="number"
                placeholder="Valor"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                style={styles.input}
              />
              <button onClick={handleDeposit} style={styles.neonButton}>
                Depositar
              </button>
              <button
                onClick={() => setSelectedPlanId(null)}
                style={{ ...styles.close, marginTop: 10 }}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// ==============================
// ESTILOS
// ==============================
const styles: any = {
  container: {
    background: 'linear-gradient(180deg, #020617, #0f172a)',
    padding: 24,
    borderRadius: 22,
    maxWidth: 700,
    margin: '0 auto',
    boxShadow:
      '0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,0,150,0.15)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: 'white',
    marginBottom: 50,
  },
  userHeader: { textAlign: 'center', marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ff7a18',
    boxShadow: '0 0 8px #ff7a18, 0 0 16px #ff7a18, 0 0 24px #ff7a18, 0 0 32px #ff7a18',
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    margin: '0 auto 8px',
    border: '2px solid #ff7a18',
    boxShadow: '0 0 8px #ff7a18, 0 0 16px #ff7a18, 0 0 24px #ff7a18, 0 0 32px #ff7a18',
  },
  userName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 },
  card: {
    padding: 20,
    borderRadius: 18,
    background: 'rgba(255,255,255,0.05)',
    boxShadow: '0 0 20px rgba(255,255,255,0.1)',
  },
  neonButton: {
    padding: '12px 26px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 0 12px rgba(34,197,94,0.6), 0 0 30px rgba(6,182,212,0.4)',
  },
  smallButton: {
    padding: '6px 12px',
    borderRadius: 8,
    border: 'none',
    background: '#22c55e',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  box: {
    background: 'linear-gradient(180deg, #020617, #0f172a)',
    padding: 30,
    borderRadius: 18,
    width: 320,
    textAlign: 'center',
    color: 'white',
    boxShadow:
      '0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255,0,150,0.2)',
  },
  gradientTitle: {
    fontSize: 20,
    marginBottom: 16,
    background: 'linear-gradient(90deg, #ff7a18, #ff2cdf)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 12,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    background: '#020617',
    color: 'white',
  },
  close: {
    marginTop: 12,
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: 10,
    borderRadius: 10,
    cursor: 'pointer',
    width: '100%',
  },
};

export default ClanFinance;