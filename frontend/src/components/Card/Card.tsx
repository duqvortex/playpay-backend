import React, { useState } from 'react';
import { formatCurrency, getCurrency } from '../../utils/currency';

// interfaces
interface IProps {
  number: string;
  cvcNumber: string;
  validUntil: string;
  cardHolder: string;
  balance?: number;
}

const Card: React.FC<IProps> = ({
  number,
  cvcNumber,
  validUntil,
  cardHolder,
  balance = 0
}) => {
  const [currency, setCurrency] = useState(getCurrency());

  function toggleCurrency() {
    const currencies = ['BRL', 'USD', 'EUR'];
    const currentIndex = currencies.indexOf(currency);
    const nextCurrency = currencies[(currentIndex + 1) % currencies.length];

    localStorage.setItem('currency', nextCurrency);
    setCurrency(nextCurrency);

    window.location.reload();
  }

  return (
    <>
      <div className='card no-select'>
        <div className='card-inner'>
          <div className='front'>
            <div className='row'>
              <svg fill='#ffffff' width='27px' height='39px' viewBox='0 3.71 26.959 38.787'>
                <path d='M19.709 3.719c.266.043.5.187.656.406 4.125 5.207 6.594 11.781 6.594 18.938 0 7.156-2.469 13.73-6.594 18.937-.195.336-.57.531-.957.492a.9946.9946 0 0 1-.851-.66c-.129-.367-.035-.777.246-1.051 3.855-4.867 6.156-11.023 6.156-17.718 0-6.696-2.301-12.852-6.156-17.719-.262-.317-.301-.762-.102-1.121.204-.36.602-.559 1.008-.504z' />
              </svg>
            </div>

            <div className='row card-no'>
              <p>{number}</p>
            </div>

            <div className='row card-holder'>
              <p>CARD HOLDER</p>
              <p>VALID UNTIL</p>
            </div>

            <div className='row name'>
              <p>{cardHolder}</p>
              <p>{validUntil}</p>
            </div>
          </div>

          <div className='back'>
            <div className='bar' />
            <div className='row card-cvv'>
              <div className='signature-back' />
              <p>{cvcNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* BALANCE DINÂMICO */}
      <div className='card-balance flex flex-v-center flex-space-between'>
        <div
          className='flex flex-col flex-h-center flex-1 center'
          onClick={toggleCurrency}
          style={{ cursor: 'pointer' }}
        >
          <h3>Balance</h3>
          <span>{formatCurrency(balance)}</span>
        </div>

        <div className='flex flex-col flex-h-center flex-1 center'>
          <h3>Limit</h3>
          <span>{formatCurrency(1250)}</span>
        </div>
      </div>
    </>
  );
};

export default Card;
