import { Link } from 'react-router-dom';

// interfaces
interface IProps {
  date?: string;
  detailed?: boolean;
  dateBalance?: string;
}

const History: React.FC<IProps> = ({
  date = undefined,
  detailed = false,
  dateBalance = undefined,
}) => {
  const selectedCurrency = localStorage.getItem('currency') || 'EUR';

  const currencySymbols: any = {
    BRL: 'R$',
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
  };

  const symbol = currencySymbols[selectedCurrency] || '€';

  return (
    <div className="history">
      {detailed && (
        <div className="history-header flex flex-v-center flex-space-between">
          <span className="text-shadow no-select date">{date}</span>
          <span className="text-shadow no-select amount flex flex-end">
            {dateBalance}
          </span>
        </div>
      )}

      {/* mensagem quando não há transações */}
      <p style={{ opacity: 0.6, textAlign: 'center', padding: 20 }}>
        No transactions yet ({symbol})
      </p>

      {!detailed && (
        <Link
          to="/transactions"
          className="history-line bottom flex flex-v-center flex-h-center"
        >
          See all
          <span className="material-symbols-outlined">
            keyboard_arrow_right
          </span>
        </Link>
      )}
    </div>
  );
};

export default History;
