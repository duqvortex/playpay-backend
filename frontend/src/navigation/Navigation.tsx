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
import Upgrade from '../pages/Upgrade';
import EventsDrops from '../pages/EventsDrops';
import ClanFinance from '../pages/ClanFinance';
import ChatRooms from '../pages/ChatRooms';

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

    {/* ================= PUBLIC ROUTES ================= */}
    <Route path='/' element={<Signin />} />
    <Route path='/signup' element={<Signup />} />

    {/* ================= PROTECTED ROUTES ================= */}

    <Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
    <Route path='/events-drops' element={<PrivateRoute><EventsDrops /></PrivateRoute>} />
    <Route path='/add' element={<PrivateRoute><Add /></PrivateRoute>} />
    <Route path='/cards' element={<PrivateRoute><Cards /></PrivateRoute>} />
    <Route path='/card-credit' element={<PrivateRoute><CardCredit /></PrivateRoute>} />
    <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
    <Route path='/savings' element={<PrivateRoute><Savings /></PrivateRoute>} />
    <Route path='/transactions' element={<PrivateRoute><Transactions /></PrivateRoute>} />
    <Route path='/edit-profile' element={<PrivateRoute><EditProfile /></PrivateRoute>} />
    <Route path='/savings-calc' element={<PrivateRoute><SavingsCalc /></PrivateRoute>} />
    <Route path='/search' element={<PrivateRoute><Search /></PrivateRoute>} />
    <Route path='/upgrade' element={<PrivateRoute><Upgrade /></PrivateRoute>} />
    <Route path='/invoice' element={<PrivateRoute><Invoice /></PrivateRoute>} />

    {/* ===== PROFILE SUB PAGES ===== */}
    <Route path='/help' element={<PrivateRoute><Help /></PrivateRoute>} />
    <Route path='/account' element={<PrivateRoute><Account /></PrivateRoute>} />
    <Route path='/learn' element={<PrivateRoute><Learn /></PrivateRoute>} />
    <Route path='/inbox' element={<PrivateRoute><Inbox /></PrivateRoute>} />
    <Route path='/security' element={<PrivateRoute><Security /></PrivateRoute>} />
    <Route path='/notifications' element={<PrivateRoute><Notifications /></PrivateRoute>} />
    <Route path='/appearance' element={<PrivateRoute><Appearance /></PrivateRoute>} />
    <Route path='/features' element={<PrivateRoute><Features /></PrivateRoute>} />
    <Route path='/about' element={<PrivateRoute><About /></PrivateRoute>} />
    <Route path='/clan-finance' element={<PrivateRoute><ClanFinance /></PrivateRoute>} />
    <Route path='/chat-rooms' element={<PrivateRoute><ChatRooms /></PrivateRoute>} />

  </Routes>
);

export default Navigation;