import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate('/transactions', { state: { query } });
  };

  return (
    <Layout>
      <Divider />
      <h1 className='title'>Search</h1>

      <div style={{ padding: 20 }}>
        <input
          type="text"
          placeholder="Search anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 12,
            border: 'none',
            background: '#0c0f14',
            color: 'white',
            marginBottom: 20,
          }}
        />

        <h3 style={{ marginBottom: 10 }}>Quick actions</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => goTo('/home')}>Home</button>
          <button onClick={() => goTo('/cards')}>Cards</button>
          <button onClick={() => goTo('/savings')}>Savings</button>
          <button onClick={() => goTo('/transactions')}>Transactions</button>
          <button onClick={() => goTo('/profile')}>Profile</button>
        </div>
      </div>

      <Divider />
    </Layout>
  );
};

export default Search;
