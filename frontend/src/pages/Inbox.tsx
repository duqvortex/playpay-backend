import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Inbox: React.FC = () => {
  return (
    <Layout>
      <Divider />
      <h1 className="title">Inbox</h1>

      <div className="card">
        <p>No new messages.</p>
      </div>

      <Divider />
    </Layout>
  );
};

export default Inbox;
