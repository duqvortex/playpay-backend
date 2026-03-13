import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Layout from '../components/Layout/Layout';
import Balance from '../components/Balance/Balance';
import Actions from '../components/Actions/Actions';
import Widgets from '../components/Widgets/Widgets';
import Divider from '../components/Divider/Divider';
import PlayPayCard3D from '../components/PlayPayCard3D';

const API_URL = 'https://faithful-renewal-production.up.railway.app';

const currencyMap: any = {
  BRL: { name: 'Real', symbol: 'R$', rate: 1 },
  USD: { name: 'USD', symbol: '$', rate: 0.2 },
  EUR: { name: 'EURO', symbol: '€', rate: 0.18 },
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const selectedCurrency = localStorage.getItem('currency') || 'BRL';
  const currencyData = currencyMap[selectedCurrency] || currencyMap.BRL;

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const [balance, setBalance] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [cashback, setCashback] = useState<number>(0);
  const [vaults, setVaults] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('Usuário');
  const [userCpf, setUserCpf] = useState<string>(localStorage.getItem('cpf') || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<boolean>(false);

  const [showPix, setShowPix] = useState(false);
  const [amount, setAmount] = useState('');
  const [pixImage, setPixImage] = useState<string | null>(null);
  const [copiaECola, setCopiaECola] = useState<string | null>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const buildAvatarUrl = (rawAvatar: string | null) => {
    if (!rawAvatar) return null;

    const avatar = String(rawAvatar).trim();
    if (!avatar) return null;

    if (avatar.startsWith('data:image')) {
      return avatar;
    }

    if (avatar.startsWith('http')) {
      return `${avatar}${avatar.includes('?') ? '&' : '?'}t=${Date.now()}`;
    }

    return `${API_URL}${avatar.startsWith('/') ? '' : '/'}${avatar}?t=${Date.now()}`;
  };

  const closePixModal = () => {
  setShowPix(false);
  setPixImage(null);
  setCopiaECola(null);
  setAmount('');
  setPixLoading(false);
};

  const loadWallet = async () => {
  if (!userId) return;

  try {
    const userRes = await axios.get(
  `${API_URL}/api/user/${userId}`,
  { headers: authHeaders }
);

console.log('USER RES:', userRes.data);

const cpfFinal =
  userRes.data.cpf ||
  userRes.data.CPF ||
  userRes.data.cpfCnpj ||
  userRes.data.document ||
  localStorage.getItem('cpf') ||
  '';

console.log('CPF FINAL:', cpfFinal);

const avatarFromApi =
  userRes.data.avatar ||
  userRes.data.avatarUrl ||
  userRes.data.photo ||
  userRes.data.profile_image ||
  null;

const finalAvatar = buildAvatarUrl(avatarFromApi);

setUserName(userRes.data.name || 'Usuário');
setUserCpf(cpfFinal);
setAvatarUrl(finalAvatar);
setAvatarError(false);

    const walletRes = await axios.get(
      `${API_URL}/gamer/wallet/${userId}`,
      { headers: authHeaders }
    );

    const wallet = walletRes.data || {};
    setBalance(Number(wallet.gamer_balance || 0));
    setXp(Number(wallet.xp || 0));
    setLevel(Number(wallet.level || 1));
    setCashback(Number(wallet.cashback || 0));
    setBadges(Array.isArray(wallet.badges) ? wallet.badges : []);

    const vaultRes = await axios.get(
      `${API_URL}/gamer/vaults/${userId}`,
      { headers: authHeaders }
    );
    setVaults(Array.isArray(vaultRes.data) ? vaultRes.data : []);

    const rankingRes = await axios.get(
      `${API_URL}/gamer/ranking`,
      { headers: authHeaders }
    );
    setRanking(Array.isArray(rankingRes.data) ? rankingRes.data : []);
  } catch (err) {
    console.error('Erro ao carregar carteira gamer:', err);
  }
};

  useEffect(() => {
    loadWallet();
    const interval = setInterval(loadWallet, 5000);
    return () => clearInterval(interval);
  }, [selectedCurrency, userId, token]);

  const handleDeposit = async () => {
  if (!amount || Number(amount) <= 0) {
    alert('Digite um valor válido');
    return;
  }

  if (!userId) {
    alert('Usuário não encontrado');
    return;
  }

  try {
    setPixLoading(true);
    setPixImage(null);
    setCopiaECola(null);

    const res = await axios.post(
      `${API_URL}/pix`,
      {
        userId: Number(userId),
        amount: Number(amount),
      },
      {
        headers: authHeaders,
      }
    );

    setPixImage(res.data.qrCodeImage || null);
    setCopiaECola(res.data.copiaECola || null);
  } catch (err: any) {
    console.error('Erro ao gerar PIX:', err.response?.data || err.message);
    alert(err.response?.data?.error || 'Erro ao gerar PIX');
  } finally {
    setPixLoading(false);
  }
};

const handleCopyPix = async () => {
  if (!copiaECola) return;

  try {
    await navigator.clipboard.writeText(copiaECola);
    alert('Código PIX copiado');
  } catch {
    alert('Não foi possível copiar o código');
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
        <div style={styles.userHeader}>
          {avatarUrl && !avatarError ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              style={styles.avatar}
              onError={() => {
                console.warn('Erro ao carregar avatar:', avatarUrl);
                setAvatarError(true);
              }}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>
              <span style={styles.avatarInitial}>
                {(userName || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <h2 style={styles.userName}>{userName}</h2>
        </div>

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

        <Divider />

        <div style={styles.gamerDashboard}>
          <div style={styles.walletInfo}>
            <h3>Level {level}</h3>

            <div style={styles.xpBarContainer}>
              <div
                style={{
                  ...styles.xpBarFill,
                  width: `${xpPercentage}%`,
                }}
              />
            </div>

            <p>XP: {xp} / {xpForNextLevel}</p>
            <p>
              Cashback: {currencyData.symbol}
              {cashback.toFixed(2)}
            </p>

            <div style={{ marginTop: 10 }}>
              {badges.map((badge, idx) => (
                <span key={idx} style={styles.badge}>
                  {badge}
                </span>
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
              }}
              onClick={() => navigate('/chat-rooms')}
            >
              💬 Criar Sala / Chat
            </div>
          </div>

          <div>
            <h3 style={styles.sectionTitle}>Cofres Ativos</h3>

            {vaults.length === 0 ? (
              <p style={{ color: 'white' }}>Nenhum cofre ativo</p>
            ) : (
              <div style={styles.vaultContainer}>
                {vaults.map((vault, idx) => {
                  const saved = Number(vault.saved_amount || 0);
                  const target = Number(vault.target_price || 0);
                  const percent =
                    target > 0 ? Math.min((saved / target) * 100, 100) : 0;

                  return (
                    <div key={idx} style={styles.vaultCard}>
                      <h4 style={{ color: 'white', marginBottom: 8 }}>
                        {vault.game_name}
                      </h4>

                      <div style={styles.vaultBarContainer}>
                        <div
                          style={{
                            ...styles.vaultBarFill,
                            width: `${percent}%`,
                          }}
                        />
                      </div>

                      <p style={{ color: 'white' }}>
                        {currencyData.symbol}
                        {saved.toFixed(2)} / {currencyData.symbol}
                        {target.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 style={styles.sectionTitle}>Ranking Global</h3>

            {ranking.length === 0 ? (
              <p style={{ color: 'white' }}>Carregando...</p>
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

      {showPix && (
  <div style={styles.modal}>
    <div style={styles.box}>
      <h3 style={styles.gradientTitle}>Adicionar saldo via PIX</h3>

      {!pixImage && !copiaECola ? (
        <>
          <input
            type="number"
            placeholder="Digite o valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            min="1"
          />

          <button
            onClick={handleDeposit}
            style={{
              ...styles.neonButton,
              opacity: pixLoading ? 0.7 : 1,
              cursor: pixLoading ? 'not-allowed' : 'pointer',
            }}
            disabled={pixLoading}
          >
            {pixLoading ? 'Gerando PIX...' : 'Gerar PIX'}
          </button>
        </>
      ) : (
        <>
          <h4>Escaneie o QR Code</h4>

          {pixImage && (
            <img
              src={pixImage}
              alt="QR Code PIX"
              style={styles.qrImage}
            />
          )}

          {copiaECola && (
            <>
              <p style={styles.qrLabel}>Código copia e cola:</p>
              <p style={styles.qrText}>{copiaECola}</p>

              <button onClick={handleCopyPix} style={styles.copyButton}>
                Copiar código PIX
              </button>
            </>
          )}
        </>
      )}

      <button
        onClick={() => {
          setShowPix(false);
          setAmount('');
          setPixImage(null);
          setCopiaECola(null);
          setPixLoading(false);
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ff7a18',
    boxShadow:
      '0 0 8px #ff7a18, 0 0 16px #ff7a18, 0 0 24px #ff7a18, 0 0 32px #ff7a18',
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
    boxShadow:
      '0 0 8px #ff7a18, 0 0 16px #ff7a18, 0 0 24px #ff7a18, 0 0 32px #ff7a18',
    animation: 'pulseNeon 2s infinite ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
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
    padding: 16,
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
    outline: 'none',
    boxSizing: 'border-box',
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
  qrImage: {
    width: 220,
    height: 220,
    margin: '10px auto',
    display: 'block',
    borderRadius: 12,
    background: '#fff',
    padding: 8,
  },
  qrText: {
    wordBreak: 'break-all',
    fontSize: 12,
    background: 'rgba(255,255,255,0.06)',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    color: 'white',
  },
  copyButton: {
  marginTop: 10,
  background: '#22c55e',
  color: 'white',
  border: 'none',
  padding: 10,
  borderRadius: 10,
  cursor: 'pointer',
  width: '100%',
},
qrLabel: {
  marginTop: 10,
  fontWeight: 'bold',
  color: 'white',
},
};

export default Home;