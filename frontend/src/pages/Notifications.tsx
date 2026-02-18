import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Notifications: React.FC = () => {
  return (
    <Layout>
      <Divider />
      <h1 className="title">Notifications</h1>

      <div className="card">
        <p>Email notifications: Enabled</p>
        <p>Push notifications: Enabled</p>
      </div>

      <Divider />
    </Layout>
  );
};

export default Notifications;
