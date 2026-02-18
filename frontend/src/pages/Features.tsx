import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Features: React.FC = () => {
  return (
    <Layout>
      <Divider />
      <h1 className="title">New Features</h1>

      <div className="card">
        <p>• Instant transfers</p>
        <p>• Multi-currency accounts</p>
        <p>• Virtual cards</p>
      </div>

      <Divider />
    </Layout>
  );
};

export default Features;
