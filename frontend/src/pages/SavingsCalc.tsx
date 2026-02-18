import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  currency: string;
}

interface CurrencyData {
  rate: number;
  symbol: string;
}

const SavingsCalc: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { currency } =
    (location.state as LocationState) || { currency: 'USD' };

  const currencyData: Record<string, CurrencyData> = {
    GBP: { rate: 2.29, symbol: '£' },
    USD: { rate: 1.49, symbol: '$' },
    EUR: { rate: 1.19, symbol: '€' },
    BRL: { rate: 8.5, symbol: 'R$' },
  };

  const selectedCurrency =
    currencyData[currency] || currencyData['USD'];

  const [amount, setAmount] = useState<string>('1000');

  // valor numérico seguro
  const numericAmount = useMemo(() => {
    const parsed = parseFloat(amount);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [amount]);

  // cálculos automáticos
  const totalAfterOneYear =
    numericAmount *
    Math.pow(1 + selectedCurrency.rate / 100, 1);

  const interestEarned = totalAfterOneYear - numericAmount;
  const monthlyAverage = interestEarned / 12;

  const chartData = useMemo<number[]>(() => {
    const data: number[] = [];
    for (let i = 1; i <= 12; i++) {
      const value =
        numericAmount *
        Math.pow(1 + selectedCurrency.rate / 100, i / 12);
      data.push(value);
    }
    return data;
  }, [numericAmount, selectedCurrency.rate]);

  const maxValue =
    chartData.length > 0 ? chartData[chartData.length - 1] : 1;

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>
          Calculadora de Poupança ({currency})
        </h2>

        <label style={styles.label}>Valor do depósito</label>
        <input
          type="number"
          value={amount}
          min={0}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />

        <div style={styles.rateBox}>
          <p>Taxa Anual Equivalente (TAE)</p>
          <h3>{selectedCurrency.rate}%</h3>
        </div>

        <div style={styles.results}>
          <div style={styles.resultCard}>
            <p>Juros mensais estimados</p>
            <h3 style={styles.highlight}>
              {selectedCurrency.symbol}{' '}
              {monthlyAverage.toFixed(2)}
            </h3>
          </div>

          <div style={styles.resultCard}>
            <p>Juros após 1 ano</p>
            <h3 style={styles.highlight}>
              {selectedCurrency.symbol}{' '}
              {interestEarned.toFixed(2)}
            </h3>
          </div>

          <div style={styles.resultCard}>
            <p>Total após 1 ano</p>
            <h2 style={styles.total}>
              {selectedCurrency.symbol}{' '}
              {totalAfterOneYear.toFixed(2)}
            </h2>
          </div>
        </div>

        <div style={styles.chart}>
          {chartData.map((value, index) => (
            <div
              key={index}
              style={{
                ...styles.bar,
                height: `${(value / maxValue) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavingsCalc;


const styles: Record<string, React.CSSProperties> = {
  container: {
    background: '#0a0c10',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    color: 'white',
    position: 'relative',
  },

  card: {
    background: '#12151c',
    padding: 35,
    borderRadius: 20,
    width: '100%',
    maxWidth: 460,
    boxShadow: `
      0 0 20px rgba(255, 106, 0, 0.6),
      0 0 40px rgba(176, 0, 255, 0.5),
      0 0 60px rgba(255, 0, 80, 0.4)
    `,
  },

  title: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 24,
    background: 'linear-gradient(90deg, #ff6a00, #b000ff, #ff0050)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  },

  label: {
    display: 'block',
    marginBottom: 8,
    color: '#aaa',
    fontSize: 14,
  },

  input: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: '#0c0f14',
    color: 'white',
    marginBottom: 20,
    fontSize: 16,
    outline: 'none',
  },

  rateBox: {
    background: '#0c0f14',
    padding: 18,
    borderRadius: 14,
    marginBottom: 25,
    textAlign: 'center',
  },

  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },

  resultCard: {
    background: '#0c0f14',
    padding: 16,
    borderRadius: 14,
  },

  highlight: {
    color: '#ff6a00',
    fontSize: 20,
    fontWeight: 600,
  },

  total: {
    background: 'linear-gradient(90deg, #ff6a00, #b000ff, #ff0050)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: 28,
    fontWeight: 800,
  },

  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 6,
    height: 100,
    marginTop: 25,
  },

  bar: {
    flex: 1,
    background:
      'linear-gradient(180deg, #ff6a00, #b000ff, #ff0050)',
    borderRadius: 4,
  },

  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: 15,
    cursor: 'pointer',
    opacity: 0.7,
  },
};
