import { useNavigate } from 'react-router-dom';


// components
import Saved from '../components/Add/Saved';
import Arrow from '../components/Arrow/Arrow';
import Button from '../components/Form/Button';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import Destination from '../components/Add/Destination';

const Add: React.FC = () => {
  const navigate = useNavigate();

  const handleAddMoney = () => {
    navigate('/card-credit'); // corrigido aqui
  };

  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Add money</h1>

      <Saved />
      <Arrow />
      <Destination />

      <Divider />

      <div className='add-buttons flex flex-space-between'>
        <Button
          type='button'
          text='Solicitar Crédito'
          tabIndex={0}
          onClick={handleAddMoney}
        />
      </div>

      <Divider />
    </Layout>
  );
};


export default Add;
