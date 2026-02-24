import { BrowserRouter } from 'react-router-dom';
import Navigation from './navigation/Navigation';

// 👇 IMPORTA A BASE VISUAL DO PLAYPAY
import './styles/reset.css';
import './styles/theme.css';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  );
}

export default App;