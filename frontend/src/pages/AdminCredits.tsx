import { useEffect, useState } from 'react';

const AdminCredits: React.FC = () => {
  const [credits, setCredits] = useState<any[]>([]);

  const loadCredits = async () => {
    const res = await fetch('http://localhost:3000/api/admin/credit-requests');
    const data = await res.json();
    setCredits(data);
  };

  useEffect(() => {
    loadCredits();
  }, []);

  const approve = async (id: number) => {
    await fetch('http://localhost:3000/api/admin/approve-credit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creditId: id }),
    });

    loadCredits();
  };

  const reject = async (id: number) => {
    await fetch('http://localhost:3000/api/admin/reject-credit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creditId: id }),
    });

    loadCredits();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Credit Requests</h1>

      {credits.map((credit) => (
        <div
          key={credit.id}
          style={{
            border: '1px solid #ccc',
            marginBottom: 10,
            padding: 10,
          }}
        >
          <p><strong>User:</strong> {credit.name} ({credit.email})</p>
          <p><strong>Amount:</strong> {credit.amount}</p>
          <p><strong>Installments:</strong> {credit.installments}</p>

          <button onClick={() => approve(credit.id)}>
            Approve
          </button>

          <button
            onClick={() => reject(credit.id)}
            style={{ marginLeft: 10 }}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminCredits;
