import React from 'react';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import './Inbox.css';

const Inbox: React.FC = () => {

  const messages = [
    {
      id: 1,
      title: "Cashback Recebido 🔥",
      description: "Você recebeu 7% de cashback no seu último depósito.",
      date: "Hoje",
      unread: true
    },
    {
      id: 2,
      title: "Novo Evento Gold 🪙",
      description: "Evento exclusivo disponível para membros Gold.",
      date: "Ontem",
      unread: false
    }
  ];

  return (
    <Layout>
      <div className="playpay-inbox-wrapper">
        <Divider />

        <h1 className="playpay-inbox-title">Inbox</h1>

        <div className="playpay-inbox-container">

          {messages.length === 0 ? (
            <div className="empty-state">
              <p>🚀 Nenhuma mensagem no momento.</p>
            </div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                className={`message-card ${msg.unread ? 'unread' : ''}`}
              >
                <div className="message-header">
                  <h3>{msg.title}</h3>
                  {msg.unread && <span className="badge-unread">NEW</span>}
                </div>

                <p className="message-desc">{msg.description}</p>

                <span className="message-date">{msg.date}</span>
              </div>
            ))
          )}

        </div>

        <Divider />
      </div>
    </Layout>
  );
};

export default Inbox;