import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Invoice: React.FC = () => {
  const [loan, setLoan] = useState<any>(null);

  useEffect(() => {
    const storedLoan = JSON.parse(localStorage.getItem('activeLoan') || 'null');
    if (storedLoan) {
      setLoan(storedLoan);
    }
  }, []);

  if (!loan) {
    return (
      <Layout>
        <Divider />
        <h1 className="title">Fatura</h1>
        <p>Você não possui nenhuma fatura ativa.</p>
        <Divider />
      </Layout>
    );
  }

  const remaining = loan.installments - loan.paidInstallments;

  return (
    <Layout>
      <Divider />
      <h1 className="title">Fatura do Cartão</h1>

      <div style={styles.card}>
        <p><strong>Valor total:</strong> R$ {loan.total.toFixed(2)}</p>
        <p><strong>Parcelas:</strong> {loan.installments}x</p>
        <p><strong>Valor da parcela:</strong> R$ {loan.installmentValue.toFixed(2)}</p>
        <p><strong>Parcelas pagas:</strong> {loan.paidInstallments}</p>
        <p><strong>Parcelas restantes:</strong> {remaining}</p>
        <p><strong>Dia de vencimento:</strong> {loan.dueDay}</p>
        <p><strong>Status:</strong> {loan.status}</p>
      </div>

      <Divider />
    </Layout>
  );
};

const styles: any = {
  card: {
    background: '#111827',
    padding: 20,
    borderRadius: 16,
    color: 'white',
  },
};

export default Invoice;
