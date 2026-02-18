import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import Button from '../components/Form/Button';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import Currency from '../components/Currency/Currency';

const Savings: React.FC = () => {
  const [selected, setSelected] = useState<string>('');
  const navigate = useNavigate();

  /**
   * Handles the selection of a currency symbol.
   *
   * @param {string} symbol - The symbol of the currency to be selected.
   */
  const handleOnSelect = (symbol: string): void => {
    setSelected(symbol);
  };

  /**
   * Action when clicking Continue
   */
  const handleContinue = (): void => {
    if (selected === '') {
      return;
    }

    // Navega para a página de cálculo enviando a moeda escolhida
    navigate('/savings-calc', {
      state: { currency: selected }
    });
  };

  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Savings</h1>

      <p className='information text-shadow'>
        Annual Equivalent Rate or AER, is used to show what you would earn in interest over a year.
        Please select a currency in the list.
      </p>

      <Divider />

      <div className='history'>
        <Currency
          aer='2.29% AER'
          name='British Pound'
          shortName='GBP'
          active={selected === 'GBP'}
          onSelect={() => handleOnSelect('GBP')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
            <text x="6" y="18" fontSize="16" fontWeight="bold">£</text>
          </svg>
        </Currency>

        <Currency
          aer='1.49% AER'
          name='US Dollar'
          shortName='USD'
          active={selected === 'USD'}
          onSelect={() => handleOnSelect('USD')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
            <text x="6" y="18" fontSize="16" fontWeight="bold">$</text>
          </svg>
        </Currency>

        <Currency
          aer='1.19% AER'
          name='Euro'
          shortName='EUR'
          active={selected === 'EUR'}
          onSelect={() => handleOnSelect('EUR')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
            <text x="4" y="18" fontSize="16" fontWeight="bold">€</text>
          </svg>
        </Currency>

        <Currency
          aer='8.50% AER'
          name='Brazilian Real'
          shortName='BRL'
          active={selected === 'BRL'}
          onSelect={() => handleOnSelect('BRL')}
        >
          <svg width='24' height='24' viewBox='0 0 24 24' fill='#ffffff'>
            <text x='2' y='18' fontSize='16' fontWeight='bold'>R$</text>
          </svg>
        </Currency>
      </div>

      <Divider />

      <div className='add-buttons flex flex-space-between'>
        <Button
          type='button'
          text='Continue'
          tabIndex={0}
          disabled={selected === ''}
          onClick={handleContinue}
        />
      </div>

      <Divider />
    </Layout>
  );
};

export default Savings;
