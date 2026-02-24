import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import './Account.css';

const Account: React.FC = () => {
  const name = localStorage.getItem('userName') || 'User';
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="playpay-account-wrapper">
        <Divider />

        <h1 className="playpay-title">Account</h1>

        <div className="playpay-container">
          <div className="playpay-card">
            
            <div className="playpay-row">
              <span className="label">Name</span>
              <span className="value">{name}</span>
            </div>

            <div className="playpay-row">
              <span className="label">Status</span>
              <span className="status active">Active</span>
            </div>

            <div className="playpay-row">
              <span className="label">Plan</span>
              <span className="plan standard">Standard</span>
            </div>

            <button 
              className="upgrade-btn"
              onClick={() => navigate('/upgrade')}
            >
              Upgrade to Gold 🔥
            </button>

          </div>
        </div>

        <Divider />
      </div>
    </Layout>
  );
};

export default Account;