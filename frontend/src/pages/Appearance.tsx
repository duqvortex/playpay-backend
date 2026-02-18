import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Appearance: React.FC = () => {
  return (
    <Layout>
      <Divider />
      <h1 className="title">Appearance</h1>

      <div className="card">
        <p>Theme: PlayPay Neon</p>
      </div>

      <Divider />
    </Layout>
  );
};

export default Appearance;
