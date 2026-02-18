import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import FundCard from '../components/FundCard/FundCard';

// tipo do backend
export interface BackendFund {
  invested: number;
  total: number;
  dailyYield: number;
}

const Cards: React.FC = () => {
  const [funds, setFunds] = useState<BackendFund[]>([]);

  // estados do Disciplina
  const [disciplineGoal, setDisciplineGoal] = useState<number>(0);
  const [disciplineSaved, setDisciplineSaved] = useState<number>(0);
  const [showGoalInput, setShowGoalInput] = useState<boolean>(false);
  const [goalInput, setGoalInput] = useState<string>('');

  useEffect(() => {
    const loadFunds = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await fetch(`https://faithful-renewal-production.up.railway.app/funds/${userId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setFunds(data);
        } else {
          setFunds([data]);
        }
      } catch (err) {
        console.error('Erro ao carregar fundos', err);
      }
    };

    // carregar dados da disciplina
    const savedGoal = localStorage.getItem('disciplineGoal');
    const savedValue = localStorage.getItem('disciplineSaved');

    if (savedGoal) setDisciplineGoal(Number(savedGoal));
    if (savedValue) setDisciplineSaved(Number(savedValue));

    loadFunds();
  }, []);

  // salvar meta
  const handleSetGoal = () => {
    const value = Number(goalInput);
    if (value <= 0) return;

    setDisciplineGoal(value);
    localStorage.setItem('disciplineGoal', value.toString());
    setShowGoalInput(false);
  };

  // depositar na disciplina
  const handleDisciplineDeposit = () => {
    const newValue = disciplineSaved + 10; // exemplo: depósito fixo de 10
    setDisciplineSaved(newValue);
    localStorage.setItem('disciplineSaved', newValue.toString());
  };

  // sacar disciplina
  const handleDisciplineWithdraw = () => {
    setDisciplineSaved(0);
    setDisciplineGoal(0);
    localStorage.removeItem('disciplineSaved');
    localStorage.removeItem('disciplineGoal');
  };

  return (
    <Layout>
      <Divider />
      <h1 className="title">Boss Fund</h1>

      {/* RESPAWN FARM */}
      <div style={{ marginBottom: 20 }}>
        <FundCard
          fund={{
            id: 999,
            name: 'Respawn Farm',
            amount: 0,
            aer: 0,
            days: 0,
            profit: '0.00',
            total: '0.00',
          }}
        />
      </div>

      {/* GOLD FARM (backend) */}
      {funds.map((fund, index) => (
        <div key={index} style={{ marginBottom: 20 }}>
          <FundCard
            fund={{
              id: index,
              name: 'Gold Farm',
              amount: fund.invested,
              aer: fund.dailyYield * 365,
              days: 0,
              profit: '0.00',
              total: fund.total.toFixed(2),
            }}
          />
        </div>
      ))}

      {/* DISCIPLINA */}
      <div
        style={{
          background: '#111',
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
        }}
      >
        <h3>Disciplina</h3>

        {disciplineGoal === 0 ? (
          <>
            {!showGoalInput ? (
              <button
                onClick={() => setShowGoalInput(true)}
                style={styles.button}
              >
                Definir meta
              </button>
            ) : (
              <>
                <input
                  type="number"
                  placeholder="Digite a meta"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  style={styles.input}
                />
                <button onClick={handleSetGoal} style={styles.button}>
                  Confirmar meta
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <p>Meta: R$ {disciplineGoal.toFixed(2)}</p>
            <p>Guardado: R$ {disciplineSaved.toFixed(2)}</p>

            {disciplineSaved < disciplineGoal ? (
              <button
                onClick={handleDisciplineDeposit}
                style={styles.button}
              >
                Depositar
              </button>
            ) : (
              <button
                onClick={handleDisciplineWithdraw}
                style={styles.withdraw}
              >
                Sacar
              </button>
            )}
          </>
        )}
      </div>

      <Divider />
    </Layout>
  );
};

const styles: any = {
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: 'none',
  },
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: 'none',
    background: '#22c55e',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  withdraw: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: 'none',
    background: '#ef4444',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Cards;
