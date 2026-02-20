import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// components
import Input from '../components/Form/Input';
import Button from '../components/Form/Button';

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('BRL');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  // animação do fundo (evita erro de tela branca)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes gradientMove {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch('https://faithful-renewal-production.up.railway.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Erro no login');
        return;
      }

      localStorage.setItem('token', data.token);


      // salva dados do usuário
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('isAdmin', data.isAdmin);

      // salva moeda escolhida
      localStorage.setItem('currency', currency);


      navigate('/home', { replace: true });
    } catch (error) {
      alert('Erro ao conectar com o servidor');
      console.error(error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img src={logo} alt="PlayPay" style={styles.logo} />

        <p style={styles.subtitle}>
          Log in or create a new account 🚀
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
<div style={styles.field}>
  <label>CPF</label>
  <Input
    tabIndex={1}
    name="cpf"
    type="text"
    placeholder="Enter your CPF"
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      setCpf(e.target.value)
    }
  />
</div>


          <div style={styles.field}>
            <label>Password</label>
            <Input
              tabIndex={2}
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div style={styles.field}>
            <label>Moeda</label>
            <select
              value={currency}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCurrency(e.target.value)
              }
              style={styles.select}
            >
              <option value="BRL">Real (R$)</option>
              <option value="USD">Dólar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <div style={styles.buttonWrap}>
            <Button type="submit" text="Sign in" tabIndex={0} />
          </div>

          <div className="links text-shadow" style={{ marginTop: 20 }}>
            <span>Não tem conta? </span>
            <Link to="/signup" style={{ color: '#ff8c42', fontWeight: 700 }}>
              Criar nova conta 🚀
            </Link>
          </div>
        </form>

        <div style={styles.links}>
          <Link to="/">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;

/* ===============================
   🎨 ESTILO GAMER / FINTECH
=============================== */

const styles: any = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `
      linear-gradient(135deg,
        #000000,
        #1a1a1a,
        #ff7a00,
        #ff2d55,
        #7b2cff,
        #00ff88
      )
    `,
    backgroundSize: '400% 400%',
    animation: 'gradientMove 12s ease infinite',
  },

  card: {
    width: 380,
    padding: 40,
    borderRadius: 20,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(14px)',
    boxShadow: '0 0 40px rgba(255,122,0,0.35)',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },

  logo: {
    width: 220,
    margin: '0 auto 10px',
    filter: 'drop-shadow(0 0 15px rgba(255,122,0,0.8))',
  },

  subtitle: {
    textAlign: 'center',
    color: '#fff',
    opacity: 0.85,
    marginBottom: 10,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    color: '#fff',
  },

  buttonWrap: {
    marginTop: 12,
    filter: 'drop-shadow(0 0 12px rgba(255,122,0,0.8))',
  },

  links: {
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
  },

  select: {
    padding: '10px',
    borderRadius: 8,
    border: 'none',
    outline: 'none',
    background: '#111',
    color: '#fff',
    fontSize: 14,
  },
};
