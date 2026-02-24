import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import axios from 'axios';

const EventsDrops: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('Usuário');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Carregar avatar e nome
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

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Layout>
      <style>{`
        @keyframes pulseNeon {
          0% { box-shadow: 0 0 8px #ff7a18,0 0 16px #ff7a18,0 0 24px #ff7a18,0 0 32px #ff7a18; }
          50% { box-shadow: 0 0 12px #ff7a18,0 0 24px #ff7a18,0 0 36px #ff7a18,0 0 48px #ff7a18; }
          100% { box-shadow: 0 0 8px #ff7a18,0 0 16px #ff7a18,0 0 24px #ff7a18,0 0 32px #ff7a18; }
        }
      `}</style>

      <div style={styles.container}>
        {/* Header com avatar e nome */}
        <div style={styles.userHeader}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}></div>
          )}
          <h2 style={styles.userName}>{userName}</h2>
        </div>

        <Divider />

        {/* Barra de pesquisa simulada */}
        <input
          type="text"
          placeholder="Pesquisar..."
          style={styles.search}
        />

        {/* Grid com mini containers */}
        <div style={styles.grid}>
          {/* Steam */}
          <div style={{ ...styles.card, ...styles.steam }} onClick={() => alert('Conectar Steam')}>
            <h2>Steam</h2>
            <p>Conecte sua conta Steam</p>
          </div>

          {/* Epic */}
          <div style={{ ...styles.card, ...styles.epic }} onClick={() => alert('Conectar Epic')}>
            <h2>Epic Games</h2>
            <p>Conecte sua conta Epic</p>
          </div>

          {/* Hype / Eventos */}
          <div style={{ ...styles.card, ...styles.hype }}>
            <h2>🔥 Hype Events 🔥</h2>
            <ul style={styles.list}>
              <li>🎮 Evento de lançamento GTA VI</li>
              <li>💰 Cashback 2x por 48h</li>
              <li>🕹 Missão especial</li>
              <li>🏆 Ranking temporário</li>
            </ul>
          </div>

          {/* Clãs Financeiros */}
          <div style={{ ...styles.card, ...styles.clan }}>
            <h2>🏆 Clãs Financeiros</h2>
            <ul style={styles.list}>
              <li>• Criar clã</li>
              <li>• Contribuir para meta coletiva</li>
              <li>• Comprar jogo juntos</li>
              <li>• Liberar recompensas</li>
              <li>• Competir com outros clãs</li>
            </ul>
            <p style={{ marginTop: 10, fontWeight: 'bold' }}>
              Exemplo: Clã economizou R$ 5.000 esse mês
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

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
  },
  userHeader: {
    textAlign: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ff7a18',
    boxShadow: '0 0 8px #ff7a18, 0 0 16px #ff7a18, 0 0 24px #ff7a18, 0 0 32px #ff7a18',
    marginBottom: 8,
    animation: 'pulseNeon 2s infinite ease-in-out',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    margin: '0 auto 8px',
    border: '2px solid #ff7a18',
    boxShadow: '0 0 8px #ff7a18, 0 0 16px #ff7a18, 0 0 24px #ff7a18, 0 0 32px #ff7a18',
    animation: 'pulseNeon 2s infinite ease-in-out',
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  search: {
    width: '100%',
    padding: 10,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)',
    marginBottom: 20,
    background: '#020617',
    color: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
    marginTop: 20,
  },
  card: {
    padding: 20,
    borderRadius: 18,
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    transformStyle: 'preserve-3d',
    animation: 'pulse 1.5s infinite alternate',
  },
  steam: {
    background: 'linear-gradient(135deg,#1b2838,#3c6e71)',
    boxShadow: '0 0 20px #00adee, 0 0 40px #00adee',
  },
  epic: {
    background: 'linear-gradient(135deg,#313131,#5a2d82)',
    boxShadow: '0 0 20px #7b00ff, 0 0 40px #7b00ff',
  },
  hype: {
    background: 'linear-gradient(135deg,#ff7a18,#ff2cdf)',
    boxShadow: '0 0 20px #ff7a18, 0 0 40px #ff2cdf',
  },
  clan: {
    background: 'linear-gradient(135deg,#ffd700,#ff8c00)',
    boxShadow: '0 0 20px #ffd700, 0 0 40px #ff8c00',
    cursor: 'pointer',
    padding: 20,
    borderRadius: 18,
    textAlign: 'center',
    transformStyle: 'preserve-3d',
    animation: 'pulse 1.5s infinite alternate',
  },
  list: { listStyle: 'none', padding: 0, marginTop: 12, textAlign: 'left' },
};

export default EventsDrops;