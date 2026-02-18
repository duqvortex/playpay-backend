import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// components
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';


const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const isVerified = balance >= 1000;


  // FOTO
  const [photoUrl, setPhotoUrl] = useState<string>(
    localStorage.getItem('profilePhoto') ||
      process.env.PUBLIC_URL + '/avatar.png'
  );

  // NOME E USERNAME DINÂMICOS
  const userName = localStorage.getItem('userName');
  const userUsername = localStorage.getItem('username');

  // upload de foto sem reload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      localStorage.setItem('profilePhoto', result);
      setPhotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // logout real
  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <Layout>
      <Divider />

      <h1 className='title'>Profile</h1>

      {/* FOTO COM NEON */}
      <div style={styles.neonWrap}>
        <img src={photoUrl} alt='Profile' style={styles.photo} />
      </div>

      {/* BOTÃO TROCAR FOTO */}
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <label style={styles.uploadBtn}>
          Trocar foto
          <input
            type='file'
            accept='image/*'
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* NOME E USERNAME */}
      <div className='center'>
<h2 style={styles.nameRow}>
  {userName || 'Seu nome'}

  {isVerified && (
    <span style={styles.verifiedBadge}>
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
        verified
      </span>
    </span>
  )}
</h2>


        <p className='flex flex-v-center flex-h-center'>
          @{userUsername || 'seuuser'} &nbsp;
          <span className='material-symbols-outlined'>qr_code</span>
        </p>
      </div>

      {/* BOTÃO EDITAR PERFIL */}
      <div style={{ textAlign: 'center' }}>
        <Link to="/edit-profile" style={styles.editBtn}>
          Editar perfil
        </Link>
      </div>

      <Divider />

      {/* PRIMEIRO BLOCO */}
      <div className='account'>
        <Link to='/help' className='flex flex-v-center'>
          <span className='material-symbols-outlined'>support</span>
          Help
        </Link>

        <Link to='/account' className='flex flex-v-center'>
          <span className='material-symbols-outlined'>account_circle</span>
          Account
        </Link>

        <Link to='/learn' className='flex flex-v-center'>
          <span className='material-symbols-outlined'>school</span>
          Learn
        </Link>

        <Link
          to='/inbox'
          className='flex flex-v-center flex-space-between'
        >
          <div className='flex flex-v-center flex-h-center'>
            <span className='material-symbols-outlined'>inbox</span>
            Inbox
          </div>
          <span className='notification flex flex-v-center flex-h-center'>
            4
          </span>
        </Link>
      </div>

      <Divider />

      {/* SEGUNDO BLOCO */}
      <div className='account'>
        <Link to='/security' className='flex flex-v-center'>
          <span className='material-symbols-outlined'>verified_user</span>
          Security &amp; privacy
        </Link>

        <Link to='/notifications' className='flex flex-v-center'>
          <span className='material-symbols-outlined'>notifications</span>
          Notification settings
        </Link>

        <Link to='/appearance' className='flex flex-v-center'>
          <span className='material-symbols-outlined'>contrast</span>
          Appearance
        </Link>

        <Link to='/features' className='flex flex-v-center'>
          <span className='material-symbols-outlined'>grade</span>
          New features
        </Link>
      </div>

      <Divider />

      {/* TERCEIRO BLOCO */}
      <div className='account'>
        <Link to='/about' className='flex flex-v-center'>
          <span className='material-symbols-outlined'>token</span>
          About us
        </Link>

        <div
          onClick={handleLogout}
          className='flex flex-v-center'
          style={{ cursor: 'pointer' }}
        >
          <span className='material-symbols-outlined'>
            power_settings_new
          </span>
          Sign out
        </div>
      </div>

      <Divider />

      <footer className='center no-select'>
        v.1.0
        <br />
        Playpay Ltd.
      </footer>

      <Divider />
    </Layout>
  );
};

export default Profile;

/* ===============================
   ESTILO NEON
=============================== */
const styles: any = {
  neonWrap: {
    width: 140,
    height: 140,
    margin: '20px auto',
    padding: 6,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #ff7a00, #ff2d55, #7b2cff)',
    boxShadow: `
      0 0 15px #ff7a00,
      0 0 30px #ff2d55,
      0 0 45px #7b2cff
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  photo: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: '#111',
  },

  uploadBtn: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: 20,
    background: 'linear-gradient(45deg, #ff7a00, #ff2d55)',
    color: '#fff',
    fontSize: 13,
    cursor: 'pointer',
  },

  editBtn: {
    display: 'inline-block',
    marginTop: 10,
    fontSize: 13,
    color: '#ff7a00',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 600,
  },
  nameRow: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
},

verifiedBadge: {
  backgroundColor: '#1da1f2',
  borderRadius: '50%',
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
},

};
