import { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../components/Layout/Layout';
import Balance from '../components/Balance/Balance';
import Actions from '../components/Actions/Actions';
import History from '../components/History/History';
import Widgets from '../components/Widgets/Widgets';
import Divider from '../components/Divider/Divider';

const currencyMap: any = {
  BRL: { name: 'Real', symbol: 'R$', rate: 1 },
  USD: { name: 'USD', symbol: '$', rate: 0.2 },
  EUR: { name: 'EURO', symbol: '€', rate: 0.18 },
};

const Home: React.FC = () => {
  const selectedCurrency = localStorage.getItem('currency') || 'BRL';
  const currencyData = currencyMap[selectedCurrency] || currencyMap['BRL'];

  const [balance, setBalance] = useState<number>(0);

  // estados do PIX
  const [showPix, setShowPix] = useState(false);
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const loadBalance = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/user/${userId}`
      );

      const rawBalance = Number(res.data?.balance);
      const safeBalance = isNaN(rawBalance) ? 0 : rawBalance;

      const convertedBalance = safeBalance * currencyData.rate;
      const formattedBalance = Number(convertedBalance.toFixed(2));

      setBalance(formattedBalance);
     
    } catch (err) {
      console.error('Erro ao buscar saldo:', err);
      setBalance(0);
    }
  };

  useEffect(() => {
    loadBalance();
    const interval = setInterval(loadBalance, 5000);
    return () => clearInterval(interval);
  }, [selectedCurrency]);

  const handleDeposit = async () => {
    if (!amount) return alert('Digite um valor');

    try {
      const res = await axios.post(
        'http://localhost:3000/api/deposit',
        {
          userId,
          amount: Number(amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQrCode(res.data.qr_code);
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar PIX');
    }
  };

  return (
    <Layout>
      {/* CONTAINER NEON PRINCIPAL */}
      <div style={styles.container}>
        <Balance
          balance={balance}
          currency={currencyData.name}
          currencySymbol={currencyData.symbol}
        />

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <button
            onClick={() => setShowPix(true)}
            style={styles.neonButton}
          >
            Adicionar saldo via PIX
          </button>
        </div>

        <Actions />
        <Divider />
        <History />
        <Divider />
        <Widgets />
      </div>

      <Divider />

      {/* Modal PIX */}
      {showPix && (
        <div style={styles.modal}>
          <div style={styles.box}>
            <h3 style={styles.gradientTitle}>
              Adicionar saldo via PIX
            </h3>

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
