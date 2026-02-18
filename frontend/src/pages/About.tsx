import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const About: React.FC = () => {
  return (
    <Layout>
      <Divider />

      <h1 style={styles.title}>Sobre o PlayPay</h1>

      <div style={styles.card}>
        <p style={styles.text}>
          O <strong>PlayPay</strong> nasceu com um propósito claro:
          transformar a forma como jogadores vivem o mundo digital.
        </p>

        <p style={styles.text}>
          Criado por <strong>Mikael Aurenfall</strong>, no Brasil,
          o PlayPay foi idealizado pensando em quem joga, cria,
          compete e vive experiências online todos os dias.
          Não é apenas um banco digital — é uma ponte entre
          o universo gamer e a liberdade financeira.
        </p>

        <h2 style={styles.subtitle}>Nossa Missão</h2>
        <p style={styles.text}>
          Criar uma experiência bancária digital pensada para o jogador.
          Uma plataforma simples, intuitiva e sem complicações,
          onde você pode organizar seu dinheiro, economizar com
          inteligência e crescer dentro e fora do jogo.
        </p>

        <h2 style={styles.subtitle}>Nossa Visão</h2>
        <p style={styles.text}>
          Acreditamos que o futuro do dinheiro é digital,
          e o futuro do digital é interativo.
          O PlayPay foi construído para unir o universo dos games
          com o universo financeiro.
        </p>

        <h2 style={styles.subtitle}>Nossa Origem</h2>
        <p style={styles.text}>
          Fundado no Brasil por <strong>Mikael Aurenfall</strong>,
          o PlayPay nasceu da ideia de que jogadores merecem
          uma solução financeira feita sob medida para seu estilo de vida.
        </p>

        <div style={styles.versionBox}>
          <p style={styles.version}>PlayPay • Versão 1.0 • Mikael Aurenfall</p>
        </div>
      </div>

      <Divider />
    </Layout>
  );
};

export default About;

const styles: Record<string, React.CSSProperties> = {
  title: {
    textAlign: 'center',
    margin: '20px 0',
    fontSize: 28,
    fontWeight: 800,
    background: 'linear-gradient(90deg, #ff6a00, #b000ff, #ff0050)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  card: {
    background: '#12151c',
    padding: 30,
    borderRadius: 18,
    maxWidth: 600,
    margin: '0 auto',
    boxShadow: `
      0 0 20px rgba(255, 106, 0, 0.5),
      0 0 40px rgba(176, 0, 255, 0.4),
      0 0 60px rgba(255, 0, 80, 0.3)
    `,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 700,
    background: 'linear-gradient(90deg, #ff6a00, #b000ff, #ff0050)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  text: {
    color: '#d6d6d6',
    lineHeight: 1.6,
    fontSize: 15,
  },

  versionBox: {
    marginTop: 15,
    paddingTop: 15,
    borderTop: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },

  version: {
    color: '#888',
    fontSize: 13,
  },
};
