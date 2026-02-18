import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import { useNavigate } from 'react-router-dom';


const CardCredit: React.FC = () => {
  const navigate = useNavigate();
  const [hasCard, setHasCard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<'idle' | 'analysis' | 'approved' | 'rejected'>('idle');
  const [dueDay, setDueDay] = useState('');
  const [installments, setInstallments] = useState('1');
  const [modalMessage, setModalMessage] = useState('');
  const [limit, setLimit] = useState<number>(0);
  const [inputLimit, setInputLimit] = useState('');
  const [balance, setBalance] = useState(0);

useEffect(() => {
  const storedCard = localStorage.getItem('creditCard');
  const storedRequest = localStorage.getItem('creditRequest');

  if (storedCard) {
    const data = JSON.parse(storedCard);
    setHasCard(true);
    setLimit(data.limit);
    return;
  }

  if (storedRequest) {
    const request = JSON.parse(storedRequest);

    // tempo de análise: 5 segundos
    const now = Date.now();
    const diff = now - request.requestedAt;

    if (diff > 5000) {
      // análise automática baseada no saldo

      if (balance >= request.limit * 0.2) {
        // aprovado
        const cardData = {
          limit: request.limit,
          lastDigits: Math.floor(1000 + Math.random() * 9000),
        };

        localStorage.setItem('creditCard', JSON.stringify(cardData));
        localStorage.removeItem('creditRequest');
        setHasCard(true);
        setLimit(request.limit);
      } else {
        // reprovado
        localStorage.removeItem('creditRequest');
        alert('Crédito não aprovado. Saldo insuficiente.');
      }
    }
  }
}, []);

useEffect(() => {
  const userId = localStorage.getItem('userId');

  fetch('/api/user/balance', {
    headers: {
      userid: userId || ''
    }
  })
    .then(res => res.json())
    .then(data => {
      setBalance(data.balance || 0);
    })
    .catch(() => {
      setBalance(0);
    });
}, []);


useEffect(() => {
  const loan = JSON.parse(localStorage.getItem('activeLoan') || 'null');
  if (!loan) return;

  const now = Date.now();

  if (loan.status === 'active' && now >= loan.dueDate) {

    if (balance >= loan.total) {
      const newBalance = balance - loan.total;

      loan.status = 'paid';
      localStorage.setItem('activeLoan', JSON.stringify(loan));

      setStatus('approved');
      setModalMessage('Empréstimo debitado automaticamente com sucesso.');
      setShowModal(true);
} else {
  // aplicar multa de 5%
  const lateFee = loan.installmentValue * 0.05;
  loan.installmentValue += lateFee;

  localStorage.setItem('activeLoan', JSON.stringify(loan));

  setStatus('rejected');
  setModalMessage('Parcela atrasada. Multa de 5% aplicada.');
  setShowModal(true);
}

  }
}, []);

const calculateMaxLimit = () => {
  if (balance < 100) return 0;
  return Math.floor(balance / 100) * 500;
};

const requestCredit = () => {
  const value = Number(inputLimit);
  const maxLimit = calculateMaxLimit();

  if (!dueDay || Number(dueDay) < 1 || Number(dueDay) > 28) {
    setStatus('rejected');
    setModalMessage('Escolha um dia válido entre 1 e 28.');
    setShowModal(true);
    return;
  }

  if (balance < 100) {
    setStatus('rejected');
    setModalMessage('Saldo mínimo de R$100 necessário.');
    setShowModal(true);
    return;
  }

  if (value > maxLimit) {
    setStatus('rejected');
    setModalMessage(`Seu limite máximo é R$ ${maxLimit}`);
    setShowModal(true);
    return;
  }

  const interestRate = 0.04; // 4% ao mês
  const months = Number(installments);

  const totalWithInterest =
    value * Math.pow(1 + interestRate, months);

  const installmentValue = totalWithInterest / months;

  const loanData = {
    createdAt: Date.now(),
    principal: value,
    total: totalWithInterest,
    installmentValue,
    installments: months,
    paidInstallments: 0,
    interest: interestRate,
    dueDay: Number(dueDay),
    status: 'active',
  };

  localStorage.setItem('activeLoan', JSON.stringify(loanData));

  setStatus('approved');
  setModalMessage(
    `Crédito aprovado!\n${months}x de R$ ${installmentValue.toFixed(2)}`
  );
  setShowModal(true);
};


  return (
    <Layout>
{showModal && (
  <div style={styles.modalOverlay}>
    <div
      style={{
        ...styles.modal,
        border:
          status === 'approved'
            ? '2px solid #22c55e'
            : status === 'rejected'
            ? '2px solid #ef4444'
            : '2px solid #00f5ff',
      }}
    >
      <h2>
        {status === 'approved'
          ? 'Aprovado ✅'
          : status === 'rejected'
          ? 'Reprovado ❌'
          : 'Em análise 🔎'}
      </h2>

      <p>{modalMessage}</p>

      <button
        style={styles.modalButton}
        onClick={() => {
          setShowModal(false);
          window.location.reload();
        }}
      >
        OK
      </button>
    </div>
  </div>
)}


      <Divider />
      <h1 className="title">Solicitar Crédito</h1>

      {/* Ilustração do cartão */}
<div style={styles.previewCard}>
  <div style={styles.cardTop}>
    <span style={styles.brand}>PLAYPAY</span>
  </div>

  <div style={styles.chip}></div>

  <div style={styles.cardCenter}>
    <h2 style={styles.logo}>PlayPay</h2>
  </div>

  <div style={styles.cardBottom}>
    <p style={styles.cardNumber}>**** **** **** 0000</p>
    <span style={styles.cardType}>CREDIT</span>
  </div>
</div>


      <Divider />

{!hasCard ? (
  (() => {
    const storedRequest = localStorage.getItem('creditRequest');

    if (storedRequest) {
      return (
        <div style={styles.analysisBox}>
          <div style={styles.loader}></div>
          <p>Solicitação em análise...</p>
          <p>Aguarde alguns instantes.</p>
        </div>
      );
    }

    return (
      <div style={styles.box}>
        <p>Você ainda não tem cartão.</p>
        <p>Solicite um limite abaixo.</p>

        <p>Limite máximo disponível: R$ {calculateMaxLimit()}</p>
        <input
          type="number"
          placeholder="Digite o limite desejado"
          value={inputLimit}
          onChange={(e) => setInputLimit(e.target.value)}
          style={styles.input}
        />

        <select
  value={installments}
  onChange={(e) => setInstallments(e.target.value)}
  style={styles.input}
>
  {[...Array(12)].map((_, i) => (
    <option key={i + 1} value={i + 1}>
      {i + 1} parcela{i + 1 > 1 && 's'}
    </option>
  ))}
</select>

<input
  type="number"
  placeholder="Dia do vencimento (1 a 28)"
  value={dueDay}
  onChange={(e) => setDueDay(e.target.value)}
  style={styles.input}
/>


        <button onClick={requestCredit} style={styles.button}>
          Solicitar crédito
        </button>
<button
  style={{ ...styles.button, marginTop: 10 }}
  onClick={() => navigate('/invoice')}
>
  Ver fatura
</button>

      </div>
    );
  })()
) : (

        <div style={styles.realCard}>
          <p style={{ fontWeight: 'bold' }}>SEU CARTÃO</p>
          <p>**** **** **** 9075</p>
          <p>Limite aprovado: R$ {limit.toFixed(2)}</p>
        </div>
        
      )}

      <Divider />
    </Layout>
  );
};

const styles: any = {
  previewCard: {
    height: 200,
    padding: 20,
    borderRadius: 24,
    color: 'white',
    marginBottom: 30,
    background: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
    boxShadow: '0 0 25px rgba(214, 166, 33, 0.4)',
    position: 'relative',
    overflow: 'hidden',
  },

  realCard: {
    height: 200,
    padding: 20,
    borderRadius: 24,
    color: 'white',
    marginTop: 20,
    background: 'linear-gradient(135deg,#141e30,#243b55)',
    boxShadow: '0 0 25px rgba(231, 174, 18, 0.5)',
    position: 'relative',
    overflow: 'hidden',
  },

  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    fontSize: 14,
    letterSpacing: 2,
    opacity: 0.8,
  },

  chip: {
    width: 45,
    height: 30,
    borderRadius: 6,
    background: 'linear-gradient(135deg,#d4af37,#f9e79f)',
    marginTop: 15,
  },

  cardCenter: {
    textAlign: 'center',
    marginTop: 10,
  },

  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    background: 'linear-gradient(90deg,#00f5ff,#ff00f5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  cardBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardNumber: {
    fontSize: 16,
    letterSpacing: 2,
  },

  cardType: {
    fontSize: 12,
    opacity: 0.8,
  },

  limit: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  box: {
    background: '#cd9a24',
    padding: 20,
    borderRadius: 16,
    color: 'white',
  },

  input: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: 'none',
  },

  button: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(90deg,#00f5ff,#ff00f5)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  analysisBox: {
  background: '#111',
  padding: 30,
  borderRadius: 16,
  color: 'white',
  textAlign: 'center',
},

loader: {
  width: 40,
  height: 40,
  border: '4px solid #333',
  borderTop: '4px solid #22c55e',
  borderRadius: '50%',
  margin: '0 auto 15px',
  animation: 'spin 1s linear infinite',
},
modalOverlay: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
  backdropFilter: 'blur(4px)',
},

modal: {
  background: '#111827',
  padding: 30,
  borderRadius: 20,
  width: 320,
  textAlign: 'center',
  color: 'white',
  boxShadow: '0 0 25px rgba(0,255,255,0.3)',
  animation: 'fadeIn 0.3s ease-in-out',
},

modalButton: {
  marginTop: 20,
  width: '100%',
  padding: 12,
  borderRadius: 10,
  border: 'none',
  background: 'linear-gradient(90deg,#00f5ff,#ff00f5)',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
},

};

export default CardCredit;
