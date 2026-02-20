import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// components
import Input from '../components/Form/Input';
import Button from '../components/Form/Button';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('BRL');

  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    address: '',
    cep: '',
    birth_date: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ): Promise<void> => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch(
        'https://faithful-renewal-production.up.railway.app/api/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Erro no cadastro');
        return;
      }

      alert('Conta criada com sucesso!');

      localStorage.setItem('currency', currency);

      navigate('/', { replace: true });

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
          Create your account 🚀
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.field}>
            <label>Name</label>
            <Input
              name="name"
              type="text"
              placeholder="Enter your full name"
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>CPF</label>
            <Input
              name="cpf"
              type="text"
              placeholder="Enter your CPF"
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>Endereço</label>
            <Input
              name="address"
              type="text"
              placeholder="Enter your address"
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>CEP</label>
            <Input
              name="cep"
              type="text"
              placeholder="Enter your CEP"
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>Data de Nascimento</label>
            <Input
              name="birth_date"
              type="date"
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>Telefone</label>
            <Input
              name="phone"
              type="text"
              placeholder="Enter your phone number"
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>
            <Input
              name="password"
              type="password"
              placeholder="Create a password"
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>Confirm Password</label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label>Moeda</label>
            <select
              value={currency}
              onChange={(e) =>
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
            <Button type="submit" text="Create account" />
          </div>

          <div style={styles.links}>
            <span>Já tem conta? </span>
            <Link
              to="/"
              style={{ color: '#ff8c42', fontWeight: 700 }}
            >
              Fazer login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Signup;

/* ===============================
   🎨 ESTILO ORIGINAL PRESERVADO
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
