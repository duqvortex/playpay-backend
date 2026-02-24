import React from 'react';
import Layout from '../components/Layout/Layout';
import './Upgrade.css';

const Upgrade: React.FC = () => {

  const handleSelect = (plan: string) => {
    alert(`Você selecionou o plano ${plan}`);
  };

  return (
    <Layout>
      <div className="upgrade-wrapper">

        <h1 className="upgrade-title">Upgrade Your PlayPay</h1>
        <p className="upgrade-subtitle">
          Escolha o plano ideal para dominar o jogo.
        </p>

        <div className="plans-container">

          {/* STANDARD */}
          <div className="plan-card standard">
            <h2>Standard</h2>
            <p className="price">Gratuito</p>

            <ul>
              <li>Transferências padrão</li>
              <li>Saques em até 24h</li>
              <li>1% Cashback</li>
              <li>Suporte padrão</li>
            </ul>

            <button onClick={() => handleSelect('Standard')}>
              Plano Atual
            </button>
          </div>

          {/* PRO */}
          <div className="plan-card pro">
            <h2>Pro Gamer</h2>
            <p className="price">R$29/mês</p>

            <ul>
              <li>Saques instantâneos</li>
              <li>3% Cashback</li>
              <li>Limite 2x maior</li>
              <li>Suporte prioritário</li>
              <li>Badge Pro Gamer</li>
            </ul>

            <button onClick={() => handleSelect('Pro Gamer')}>
              Escolher Plano
            </button>
          </div>

          {/* GOLD */}
          <div className="plan-card gold highlight">
            <div className="badge">MAIS POPULAR</div>

            <h2>Gold</h2>
            <p className="price">R$59/mês</p>

            <ul>
              <li>Saques imediatos</li>
              <li>7% Cashback</li>
              <li>Sem taxas internas</li>
              <li>Limite ilimitado</li>
              <li>Suporte VIP 24/7</li>
              <li>Eventos exclusivos</li>
              <li>Missões com recompensas</li>
              <li>Multiplicador 2x pontos</li>
            </ul>

            <button onClick={() => handleSelect('Gold')}>
              Virar Gold 🔥
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Upgrade;