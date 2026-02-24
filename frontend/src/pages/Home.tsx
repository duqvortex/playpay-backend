import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Layout from '../components/Layout/Layout';
import Balance from '../components/Balance/Balance';
import Actions from '../components/Actions/Actions';
import Widgets from '../components/Widgets/Widgets';
import Divider from '../components/Divider/Divider';
import PlayPayCard3D from "../components/PlayPayCard3D";
import ChatRooms from './ChatRooms';

const currencyMap: any = {
  BRL: { name: 'Real', symbol: 'R$', rate: 1 },
  USD: { name: 'USD', symbol: '$', rate: 0.2 },
  EUR: { name: 'EURO', symbol: '€', rate: 0.18 },
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const selectedCurrency = localStorage.getItem('currency') || 'BRL';
  const currencyData = currencyMap[selectedCurrency] || currencyMap['BRL'];

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Dados principais
  const [balance, setBalance] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [cashback, setCashback] = useState<number>(0);
  const [vaults, setVaults] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('Usuário');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // PIX
  const [showPix, setShowPix] = useState(false);
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const loadWallet = async () => {
    if (!userId) return;
    try {
      // Dados do usuário
      const userRes = await axios.get(
        `https://faithful-renewal-production.up.railway.app/api/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserName(userRes.data.name || 'Usuário');
      setAvatarUrl(userRes.data.avatar || null);

      // Wallet info
      const walletRes = await axios.get(
        `https://faithful-renewal-production.up.railway.app/gamer/wallet/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const wallet = walletRes.data;
      setBalance(wallet.gamer_balance || 0);
      setXp(wallet.xp || 0);
      setLevel(wallet.level || 1);
      setCashback(wallet.cashback || 0);
      setBadges(wallet.badges || []);

      // Vaults
      const vaultRes = await axios.get(
        `https://faithful-renewal-production.up.railway.app/gamer/vaults/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVaults(vaultRes.data || []);

      // Ranking
      const rankingRes = await axios.get(
        `https://faithful-renewal-production.up.railway.app/gamer/ranking`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRanking(rankingRes.data || []);

    } catch (err) {
      console.error('Erro ao carregar carteira gamer:', err);
    }
  };

  useEffect(() => {
    loadWallet();
    const interval = setInterval(loadWallet, 5000);
    return () => clearInterval(interval);
  }, [selectedCurrency]);

  const handleDeposit = async () => {
    if (!amount) return alert('Digite um valor');

    try {
      const res = await axios.post(
        'https://faithful-renewal-production.up.railway.app/api/deposit',
        { userId, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQrCode(res.data.qr_code);
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar PIX');
    }
  };

  const xpForNextLevel = level * 1000;
  const xpPercentage = Math.min((xp / xpForNextLevel) * 100, 100);

  return (
    <Layout>
      <style>
{`
  @keyframes pulseNeon {
    0% {
      box-shadow: 0 0 8px #ff7a18, 0 0 16px #ff7a18, 0 0 24px #ff7a18, 0 0 32px #ff7a18;
    }
    50% {
      box-shadow: 0 0 12px #ff7a18, 0 0 24px #ff7a18, 0 0 36px #ff7a18, 0 0 48px #ff7a18;
    }
    100% {
      box-shadow: 0 0 8px #ff7a18, 0 0 16px #ff7a18, 0 0 24px #ff7a18, 0 0 32px #ff7a18;
    }
  }
`}
</style>
      <div style={styles.container}>
        {/* AVATAR + NOME */}
        <div style={styles.userHeader}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}></div>
          )}
          <h2 style={styles.userName}>{userName}</h2>
        </div>

        {/* SALDO PRINCIPAL */}
        <Balance
          balance={balance}
          currency={currencyData.name}
          currencySymbol={currencyData.symbol}
        />
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <button onClick={() => setShowPix(true)} style={styles.neonButton}>
            Adicionar saldo via PIX
          </button>
        </div>

        {/* XP, LEVEL, CASHBACK, BADGES, COFRES, RANKING */}
        <Divider />
        <div style={styles.gamerDashboard}>
          <div style={styles.walletInfo}>
            <h3>Level {level}</h3>
            <div style={styles.xpBarContainer}>
              <div style={{ ...styles.xpBarFill, width: `${xpPercentage}%` }} />
            </div>
            <p>XP: {xp} / {xpForNextLevel}</p>
            <p>Cashback: {currencyData.symbol}{cashback.toFixed(2)}</p>
            <div style={{ marginTop: 10 }}>
              {badges.map((badge, idx) => (
                <span key={idx} style={styles.badge}>{badge}</span>
              ))}
            </div>
            <div
  style={{
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    background: 'linear-gradient(135deg,#ff7a18,#ff2cdf)',
    boxShadow: '0 0 25px #ff7a18,0 0 50px #ff2cdf',
    textAlign: 'center',
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
    animation: 'pulse 1.5s infinite alternate',
  }}
  onClick={() => navigate('/events-drops')}
>
  Eventos & Drops
</div>
<div
  style={{
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    background: 'linear-gradient(135deg,#22c55e,#06b6d4)',
    boxShadow: '0 0 25px #22c55e,0 0 50px #06b6d4',
    textAlign: 'center',
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
    animation: 'pulse 1.5s infinite alternate',
  }}
  onClick={() => navigate('/clan-finance')}
>
  🏆 Clãs Financeiros
</div>
<div
  style={{
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    background: 'linear-gradient(135deg,#06b6d4,#22c55e)',
    boxShadow: '0 0 25px #06b6d4,0 0 50px #22c55e',
    textAlign: 'center',
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
    animation: 'pulse 1.5s infinite alternate',
  }}
  onClick={() => navigate('/chat-rooms')} // rota que vamos criar
>
  💬 Criar Sala / Chat
</div>
          </div>

          {/* Cofres Ativos */}
          <div>
            <h3 style={styles.sectionTitle}>Cofres Ativos</h3>
            {vaults.length === 0 ? (
              <p>Nenhum cofre ativo</p>
            ) : (
              <div style={styles.vaultContainer}>
                {vaults.map((vault, idx) => {
                  const percent = Math.min((vault.saved_amount / vault.target_price) * 100, 100);
                  return (
                    <div key={idx} style={styles.vaultCard}>
                      <h4>{vault.game_name}</h4>
                      <div style={styles.vaultBarContainer}>
                        <div style={{ ...styles.vaultBarFill, width: `${percent}%` }} />
                      </div>
                      <p>{currencyData.symbol}{vault.saved_amount.toFixed(2)} / {currencyData.symbol}{vault.target_price.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ranking Global */}
          <div>
            <h3 style={styles.sectionTitle}>Ranking Global</h3>
            {ranking.length === 0 ? (
              <p>Carregando...</p>
            ) : (
              <ol style={styles.rankingList}>
                {ranking.map((user, idx) => (
                  <li key={idx}>
                    {user.name} - Level {user.level} - XP: {user.xp}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <Divider />
        <PlayPayCard3D />
        <Actions />
        <Divider />
        <Widgets />
      </div>

      {/* Modal PIX */}
      {showPix && (
        <div style={styles.modal}>
          <div style={styles.box}>
            <h3 style={styles.gradientTitle}>Adicionar saldo via PIX</h3>
            {!qrCode ? (
              <>
                <input
                  type="number"
                  placeholder="Digite o valor"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={styles.input}
                />
                <button onClick={handleDeposit} style={styles.neonButton}>
                  Gerar PIX
                </button>
              </>
            ) : (
              <>
                <h4>Escaneie o QR Code</h4>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrCode}`}
                  alt="QR Code"
                />
                <p style={{ wordBreak: 'break-all' }}>{qrCode}</p>
              </>
            )}
            <button
              onClick={() => {
                setShowPix(false);
                setQrCode(null);
                setAmount('');
              }}
              style={styles.close}
            >
              Fechar
            </button>
          </div>
          
        </div>
      )}
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
  },
  userHeader: {
    textAlign: 'center',
    marginBottom: 20,
  },
// Adicione isso no objeto styles
avatar: {
  width: 80,
  height: 80,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #ff7a18',
  boxShadow: '0 0 8px #ff7a18, 0 0 16px #ff7a18, 0 0 24px #ff7a18, 0 0 32px #ff7a18',
  marginBottom: 8,
  animation: 'pulseNeon 2s infinite ease-in-out', // animação
},

// placeholder caso não tenha avatar
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
  neonButton: {
    padding: '12px 26px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow:
      '0 0 12px rgba(34,197,94,0.6), 0 0 30px rgba(6,182,212,0.4)',
  },
  walletInfo: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  xpBarContainer: {
    width: '100%',
    height: 12,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    margin: '10px 0',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
    borderRadius: 6,
    transition: 'width 0.5s ease-in-out',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    margin: '0 5px',
    borderRadius: 12,
    background: 'linear-gradient(90deg, #ff7a18, #ff2cdf)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  vaultContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  vaultCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
  },
  vaultBarContainer: {
    width: '100%',
    height: 8,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    margin: '6px 0',
  },
  vaultBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #06b6d4, #22c55e)',
    borderRadius: 4,
    transition: 'width 0.5s ease-in-out',
  },
  rankingList: {
    listStyle: 'decimal',
    paddingLeft: 20,
    color: 'white',
  },
  gamerDashboard: {
    marginTop: 24,
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

export default Home;