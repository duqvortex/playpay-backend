import React, { useState } from 'react';
import { getCurrency } from '../../utils/currency';

const Destination: React.FC = () => {
  const currency = getCurrency();
  const [amount, setAmount] = useState('');

  const getSymbol = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'USD':
        return '$';
      case 'BRL':
        return 'R$';
      default:
        return currency;
    }
  };

  return (
    <div className='accounts flex flex-v-center flex-space-between'>
      <div className='account-balance flex flex-col'>
        <div className='flex flex-v-center no-select'>
          <span>{currency}</span>
        </div>
        <span className='account-balance-bottom'>
          Balance: {getSymbol(currency)} 231.40
        </span>
      </div>

      <div className='account-money flex flex-col right'>
        <div className='flex flex-v-center flex-end'>
          <span>{getSymbol(currency)}</span>
          <input
            tabIndex={0}
            className='account-balance-input right'
            value={amount}
            type='text'
            placeholder='0'
            autoComplete='off'
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <span className='account-balance-bottom'>No fee</span>
      </div>
    </div>
  );
};

export default Destination;
