import { Routes, Route } from 'react-router-dom';

import Add from '../pages/Add';
import Home from '../pages/Home';
import Cards from '../pages/Cards';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import Savings from '../pages/Savings';
import Transactions from '../pages/Transactions';
import CardCredit from '../pages/CardCredit';
import Invoice from '../pages/Invoice';

// páginas do profile
import Help from '../pages/Help';
import Account from '../pages/Account';
import Learn from '../pages/Learn';
import Inbox from '../pages/Inbox';
import Security from '../pages/Security';
import Notifications from '../pages/Notifications';
import Appearance from '../pages/Appearance';
import Features from '../pages/Features';
import About from '../pages/About';
import SavingsCalc from '../pages/SavingsCalc';

import PrivateRoute from './PrivateRoute';
import EditProfile from '../pages/EditProfile';
import Search from '../pages/Search';



const Navigation: React.FC = () => (
  <Routes>
    {/* Rotas públicas */}
    <Route path='/' element={<Signin />} />
    <Route path='/signup' element={<Signup />} />

    {/* Rotas protegidas */}
    <Route
      path='/home'
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />

    <Route
      path='/add'
      element={
        <PrivateRoute>
          <Add />
        </PrivateRoute>
      }
    />

    <Route
      path='/cards'
      element={
        <PrivateRoute>
          <Cards />
        </PrivateRoute>
      }
    />
<Route
  path='/card-credit'
  element={
    <PrivateRoute>
      <CardCredit />
    </PrivateRoute>
  }
/>

    <Route
      path='/profile'
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />

    <Route
      path='/savings'
      element={
        <PrivateRoute>
          <Savings />
        </PrivateRoute>
      }
    />

    <Route
      path='/transactions'
      element={
        <PrivateRoute>
          <Transactions />
        </PrivateRoute>
      }
    />
    <Route
  path="/edit-profile"
  element={
    <PrivateRoute>
      <EditProfile />
    </PrivateRoute>
  }
/>
<Route
  path='/savings-calc'
  element={
    <PrivateRoute>
      <SavingsCalc />
    </PrivateRoute>
  }
/>
<Route
  path='/search'
  element={
    <PrivateRoute>
      <Search />
    </PrivateRoute>
  }
/>


    {/* Profile pages protegidas */}
    <Route path='/help' element={<PrivateRoute><Help /></PrivateRoute>} />
    <Route path='/account' element={<PrivateRoute><Account /></PrivateRoute>} />
    <Route path='/learn' element={<PrivateRoute><Learn /></PrivateRoute>} />
    <Route path='/inbox' element={<PrivateRoute><Inbox /></PrivateRoute>} />
    <Route path='/security' element={<PrivateRoute><Security /></PrivateRoute>} />
    <Route path='/notifications' element={<PrivateRoute><Notifications /></PrivateRoute>} />
    <Route path='/appearance' element={<PrivateRoute><Appearance /></PrivateRoute>} />
    <Route path='/features' element={<PrivateRoute><Features /></PrivateRoute>} />
    <Route path='/about' element={<PrivateRoute><About /></PrivateRoute>} />
    <Route path="/invoice" element={<Invoice />} />

  </Routes>
);

export default Navigation;
