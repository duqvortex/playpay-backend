import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>(
    localStorage.getItem('userName') || ''
  );

  const [username, setUsername] = useState<string>(
    localStorage.getItem('username') || ''
  );

  // Função para gerar username automático
  const generateUsername = (value: string) => {
    const normalized = value
      .normalize('NFD') // separa acentos
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/\s+/g, '') // remove espaços
      .toLowerCase();

    setUsername(normalized);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    generateUsername(value);
  };

  const handleSave = () => {
    if (!name.trim() || !username.trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    localStorage.setItem('userName', name.trim());
    localStorage.setItem('username', username.trim());

    navigate('/profile');
  };

  return (
    <Layout>
      <Divider />

      <h1 className="title">Editar Perfil</h1>

      <div style={styles.form}>
        <label>Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Seu nome"
          style={styles.input}
        />

        <label style={{ marginTop: 20 }}>Username</label>
        <input
          type="text"
          value={`@${username}`}
          disabled
          style={styles.input}
        />

        <button style={styles.button} onClick={handleSave}>
          Salvar alterações
        </button>
      </div>

      <Divider />
    </Layout>
  );
};

export default EditProfile;

const styles: any = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '85%',
    margin: '40px auto',
  },

  input: {
    padding: '12px',
    borderRadius: 8,
    border: '1px solid #333',
    backgroundColor: '#111',
    color: '#fff',
    marginTop: 8,
  },

  button: {
    marginTop: 30,
    padding: '12px',
    borderRadius: 25,
    border: 'none',
    background: 'linear-gradient(45deg, #ff7a00, #ff2d55)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
