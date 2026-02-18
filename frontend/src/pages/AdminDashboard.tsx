import { useEffect, useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch('http://localhost:3000/api/admin/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Score</th>
            <th>Limit</th>
            <th>Used</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.balance}</td>
              <td>{user.credit_score}</td>
              <td>{user.credit_limit}</td>
              <td>{user.credit_used}</td>
              <td>{user.available_limit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
