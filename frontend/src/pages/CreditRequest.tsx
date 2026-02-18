import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../components/Modal/AlertModal';


// components
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import Button from '../components/Form/Button';

const CreditRequest: React.FC = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [installments, setInstallments] = useState('12');
  const [startDate, setStartDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


const handleRequest = async () => {
  const token = localStorage.getItem('token');

  console.log('token:', token);
  console.log('amount:', amount);
  console.log('installments:', installments);
  console.log('startDate:', startDate);

  if (!token) {
    setErrorMessage('Usuário não logado');
    return;
  }

  if (!amount || !startDate) {
    alert('Preencha todos os campos');
    return;
  }

  try {
    const response = await fetch('https://faithful-renewal-production.up.railway.app/api/credit-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        amount: Number(amount),
        installments: Number(installments),
        startDate,
      }),
    });

    const data = await response.json();
    console.log('Resposta do servidor:', data);

    if (!response.ok) {
      setErrorMessage(data.message || 'Erro na solicitação');
      return;
    }

    alert(data.message);
    navigate('/home');
  } catch (error) {
    console.error(error);
    setErrorMessage('Erro ao solicitar crédito');

  }
};


  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Request Credit</h1>

      <Divider />

      <div className='form-group'>
        <label>Amount</label>
        <input
          type='number'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder='Enter amount'
        />
      </div>

      <Divider />

      <div className='form-group'>
        <label>Installments</label>
        <select
          value={installments}
          onChange={(e) => setInstallments(e.target.value)}
        >
          <option value='3'>3 months</option>
          <option value='6'>6 months</option>
          <option value='12'>12 months</option>
          <option value='24'>24 months</option>
        </select>
      </div>

      <Divider />

      <div className='form-group'>
        <label>First payment date</label>
        <input
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <Divider />

      <Button
        type='button'
        text='Request Credit'
        tabIndex={0}
        onClick={handleRequest}
      />

      {errorMessage && (
  <AlertModal
    message={errorMessage}
    onClose={() => setErrorMessage('')}
  />
)}


      <Divider />
    </Layout>
  );
};

export default CreditRequest;
