import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Help: React.FC = () => {
  return (
    <Layout>
      <Divider />
      <h1 className="title">Base de Apoio</h1>

      <div
        style={{
          background: 'linear-gradient(180deg, #0f172a, #020617)',
          padding: '28px',
          borderRadius: '20px',
          maxWidth: 600,
          margin: '0 auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.06)',
          color: 'white',
        }}
      >
        <h2
          style={{
            fontSize: 22,
            marginBottom: 16,
            background: 'linear-gradient(90deg, #ff7a18, #ff2cdf)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Suporte PlayPay
        </h2>

        <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
          Precisa de ajuda? Nossa equipe está pronta para atender você.
          Entre em contato pelo e-mail abaixo e responderemos o mais rápido
          possível.
        </p>

        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          playpaycontato@gmail.com
        </div>

        {/* rodapé elegante */}
        <hr
          style={{
            marginTop: 40,
            marginBottom: 20,
            border: 'none',
            height: 1,
            background: 'rgba(255,255,255,0.08)',
          }}
        />

        <p
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: 0.5,
          }}
        >
          PlayPay • Versão 1.0 • Mikael Aurenfall
        </p>
      </div>

      <Divider />
    </Layout>
  );
};

export default Help;
