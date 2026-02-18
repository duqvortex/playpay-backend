// components
import Header from '../Header/Header';

// interfaces
interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => (
  <>
    {/* FUNDO */}
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
      }}
      className='bg'
    />

    {/* CONTEÚDO */}
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
      className='content'
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
        }}
        className='container'
      >
        <Header />
        {children}
      </div>
    </div>
  </>
);

export default Layout;
