import { useEffect, useState } from 'react';

const MyInstallments: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    fetch(`https://faithful-renewal-production.up.railway.app/api/my-installments/${userId}`)
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>My Installments</h1>

      {data.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <p>Installment: {item.number}</p>
          <p>Amount: {item.amount}</p>
          <p>Due date: {new Date(item.due_date).toLocaleDateString()}</p>
          <p>Status: {item.status || 'pending'}</p>
        </div>
      ))}
    </div>
  );
};

export default MyInstallments;
