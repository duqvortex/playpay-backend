import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Learn: React.FC = () => {
  return (
    <Layout>
      <Divider />
      <h1 className="title">Tutorial do Play pay</h1>

      <div className="card">
        <p>Financial tips and tutorials will appear here.</p>
      </div>

      <Divider />
    </Layout>
  );
};

export default Learn;
