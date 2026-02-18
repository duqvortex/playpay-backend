import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface SearchItem {
  label: string;
  path: string;
  icon: string;
}

const Header: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [open, setOpen] = useState(false);

  const profilePhoto = localStorage.getItem('profilePhoto');
  const photoUrl = profilePhoto
    ? profilePhoto
    : process.env.PUBLIC_URL + '/avatar.png';

  // 🔎 Base de busca global
  const searchItems: SearchItem[] = [
    { label: 'Saldo', path: '/home', icon: 'account_balance_wallet' },
    { label: 'Cartões', path: '/cards', icon: 'credit_card' },
    { label: 'Transações', path: '/transactions', icon: 'equalizer' },
    { label: 'Poupança', path: '/savings', icon: 'savings' },
    { label: 'Calculadora de Poupança', path: '/savings-calc', icon: 'calculate' },
    { label: 'Perfil', path: '/profile', icon: 'person' },
    { label: 'Configurações', path: '/profile', icon: 'settings' },
    { label: 'Segurança', path: '/security', icon: 'lock' },
    { label: 'Notificações', path: '/notifications', icon: 'notifications' },
    { label: 'Ajuda', path: '/help', icon: 'help' },
    { label: 'Sobre o PlayPay', path: '/about', icon: 'info' },
  ];

useEffect(() => {
  const savedFunds = JSON.parse(localStorage.getItem('funds') || '[]');

  let dynamicResults: SearchItem[] = [];

  // 🔎 Busca estática
  if (search.trim() === '') {
    dynamicResults = searchItems.slice(0, 5);
  } else {
    dynamicResults = searchItems.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 🔎 Busca nos fundos criados (Golden Fund, Respawn, Boss Fund, etc)
  if (search.trim() !== '') {
    savedFunds.forEach((fund: any) => {
      if (
        fund.name.toLowerCase().includes(search.toLowerCase())
      ) {
        dynamicResults.push({
          label: `Fund: ${fund.name}`,
          path: '/savings',
          icon: 'savings',
        });
      }
    });
  }

  setResults(dynamicResults);
}, [search]);


  const handleSelect = (path: string) => {
    setOpen(false);
    setSearch('');
    navigate(path);
  };

  return (
    <header className='flex flex-v-center flex-space-between' style={{ position: 'relative' }}>
      {/* FOTO PERFIL */}
      <div className='header-profile flex flex-1'>
        <Link to='/profile'>
          <div
            className='profile-photo'
            style={{
              backgroundImage: `url(${photoUrl})`,
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: `
                0 0 6px #ff7a00,
                0 0 12px #ff2d55,
                0 0 18px #7b2cff
              `,
            }}
          />
        </Link>
      </div>

      {/* BUSCA */}
      <div className='header-center' style={{ position: 'relative' }}>
        <div className='header-search flex flex-v-center'>
          <span
            className='material-symbols-outlined no-select'
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setOpen(true);
              inputRef.current?.focus();
            }}
          >
            search
          </span>

          <input
            ref={inputRef}
            type='text'
            placeholder='Search'
            value={search}
            onFocus={() => setOpen(true)}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* RESULTADOS */}
        {open && (
          <div
            style={{
              position: 'absolute',
              top: 45,
              left: 0,
              right: 0,
              background: '#12151c',
              borderRadius: 14,
              padding: 10,
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              zIndex: 10,
            }}
          >
            {results.length === 0 && (
              <p style={{ padding: 10, opacity: 0.6 }}>
                Nenhum resultado
              </p>
            )}

            {results.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelect(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 10,
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
                className='search-item'
              >
                <span className='material-symbols-outlined'>
                  {item.icon}
                </span>
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTÕES DIREITA */}
      <div className='header-buttons flex flex-1 flex-v-center flex-end'>
        <Link
          to='/home'
          className='header-button flex flex-v-center flex-h-center'
        >
          <span className='material-symbols-outlined'>home</span>
        </Link>

        <Link
          to='/transactions'
          className='header-button flex flex-v-center flex-h-center'
        >
          <span className='material-symbols-outlined'>equalizer</span>
        </Link>

        <Link
          to='/cards'
          className='header-button flex flex-v-center flex-h-center'
        >
          <span className='material-symbols-outlined'>credit_card</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
