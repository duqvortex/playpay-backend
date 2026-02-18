import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Security: React.FC = () => {
  return (
    <Layout>
      <Divider />
      <h1 className="title">Safe Zone</h1>

      <div
        style={{
          background: '#0c0f14',
          borderRadius: 18,
          padding: '28px 24px',
          margin: '0 20px',
          color: '#e5e7eb',
          lineHeight: 1.7,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        <h2 style={{ marginBottom: 20 }}>
          Política de Segurança e Privacidade
        </h2>

        <h3 style={titleStyle}>1. Compromisso com a Segurança da Informação</h3>
        <p>
          A [NOME DA SUA INSTITUIÇÃO] adota os mais altos padrões de segurança
          da informação, garantindo a confidencialidade, integridade,
          disponibilidade e autenticidade dos dados.
        </p>

        <h3 style={titleStyle}>2. Coleta de Dados</h3>
        <ul>
          <li>Dados cadastrais e de contato.</li>
          <li>Dados financeiros e transações.</li>
          <li>Dados de acesso e dispositivo.</li>
          <li>Dados de uso da plataforma.</li>
        </ul>

        <h3 style={titleStyle}>3. Uso dos Dados</h3>
        <ul>
          <li>Autenticação e identificação.</li>
          <li>Processamento de transações.</li>
          <li>Exigências legais e regulatórias.</li>
          <li>Prevenção à fraude.</li>
        </ul>

        <h3 style={titleStyle}>4. Compartilhamento</h3>
        <p>
          Os dados só são compartilhados com autoridades, órgãos reguladores ou
          parceiros essenciais para funcionamento do serviço.
        </p>

        <h3 style={titleStyle}>5. Segurança Tecnológica</h3>
        <ul>
          <li>Criptografia AES-256 e TLS 1.3.</li>
          <li>Autenticação multifator.</li>
          <li>Monitoramento 24/7.</li>
          <li>Sistemas antifraude.</li>
        </ul>

        <h3 style={titleStyle}>6. Direitos do Usuário</h3>
        <ul>
          <li>Acesso aos dados.</li>
          <li>Correção de informações.</li>
          <li>Exclusão quando permitido.</li>
          <li>Revogação de consentimento.</li>
        </ul>

        <h3 style={titleStyle}>7. Responsabilidade do Usuário</h3>
        <ul>
          <li>Manter credenciais seguras.</li>
          <li>Não compartilhar senhas.</li>
          <li>Reportar suspeitas de fraude.</li>
        </ul>

        <h3 style={titleStyle}>8. Atualizações</h3>
        <p>
          Esta política pode ser alterada a qualquer momento para adequações
          legais ou melhorias no serviço.
        </p>
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

const titleStyle: React.CSSProperties = {
  marginTop: 28,
  marginBottom: 8,
  fontWeight: 600,
  fontSize: 18,
  background: 'linear-gradient(90deg, #ff7a18, #ff3cac)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export default Security;
