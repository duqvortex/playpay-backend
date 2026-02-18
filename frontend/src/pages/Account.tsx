import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Account: React.FC = () => {
  const name = localStorage.getItem('userName') || 'User';

  return (
    <Layout>
      <Divider />
      <h1 className="title">Account</h1>

      <div className="card">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Status:</strong> Active</p>
        <p><strong>Plan:</strong> Standard</p>
      </div>

      <Divider />
    </Layout>
  );
};

export default Account;
