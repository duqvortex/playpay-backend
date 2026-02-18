import { Link } from 'react-router-dom';

const Actions: React.FC = () => (
  <div className='actions flex flex-v-center flex-h-center'>
    {/* Boss Credito */}
    <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
      <Link to='/add' className='flex flex-v-center flex-h-center'>
        <span className='material-symbols-outlined'>add</span>
      </Link>
      <span className='text-shadow'>Boss Credito</span>
    </div>

    {/* Exchange → transactions */}
    <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
      <Link to='/transactions' className='flex flex-v-center flex-h-center'>
        <span className='material-symbols-outlined'>sync</span>
      </Link>
      <span className='text-shadow'>Exchange</span>
    </div>

    {/* Details → profile */}
    <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
      <Link to='/profile' className='flex flex-v-center flex-h-center'>
        <span className='material-symbols-outlined'>page_info</span>
      </Link>
      <span className='text-shadow'>Details</span>
    </div>

    {/* Boss fund → cards */}
    <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
      <Link to='/cards' className='flex flex-v-center flex-h-center'>
        <span className='material-symbols-outlined'>more_horiz</span>
      </Link>
      <span className='text-shadow'>Boss Fund</span>
    </div>
  </div>
);

export default Actions;

