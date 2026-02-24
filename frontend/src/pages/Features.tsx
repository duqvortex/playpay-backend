import React from 'react';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import './Features.css';

const Features: React.FC = () => {

  const features = [
    {
      icon: "⚡",
      title: "Instant Transfers",
      description: "Envie e receba dinheiro em segundos, 24/7."
    },
    {
      icon: "🌎",
      title: "Multi-Currency Wallet",
      description: "Conta internacional para gamers globais."
    },
    {
      icon: "💳",
      title: "Virtual Gaming Cards",
      description: "Cartões virtuais seguros para compras online."
    },
    {
      icon: "🔥",
      title: "Gold Exclusive Rewards",
      description: "Cashback maior, eventos VIP e boosts especiais."
    }
  ];

  return (
    <Layout>
      <div className="playpay-features-wrapper">
        <Divider />

        <h1 className="playpay-features-title">
          🚀 New Features
        </h1>

        <div className="features-container">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <Divider />
      </div>
    </Layout>
  );
};

export default Features;