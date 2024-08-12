import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromStorage, selectUserData } from './features/auth/Authslice';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useGlobalContext } from './context/GlobalProvider';
import Login from './pages/authentication/Login';
import About from './pages/About';
import NavBar from './components/NavBar';
import AccountType from './pages/authentication/AccountType';
import Personal from './pages/authentication/Personal';
import Business from './pages/authentication/Business';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard/MainDash';
import Notifications from './pages/Dashboard/Notifications';
import Invoices from './pages/Dashboard/invoice/Invoices';
import Account from './pages/Dashboard/Accounts/Account';
import User from './pages/Details/User';
import AccountDetails from './pages/Dashboard/Accounts/accountDetails';
import Contacts from './pages/Dashboard/contacts/Contacts';
import Products from './pages/Dashboard/Products/Products';
import MyTransactions from './pages/Dashboard/transactions.jsx/MyTransactions';
import ErrorBoundary from './ErrorBoundary';
import MyShop from './pages/shop';
import Messages from './pages/message';
import { selectCurrentToken } from './features/auth/Authslice';
import MessageDetails from './pages/message/messageDetails';
function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
const token = useSelector(selectCurrentToken)
  const user = useSelector(selectUserData);
  const navigate = useNavigate();

//  useEffect(()=>{
//   if(!token){
//    navigate('/login')
//   }

//  },[token, navigate])

  return (
    <ErrorBoundary> 
      <main className="bg-sky-950 max-h-screen" id="main">
     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="/accounts" element={<Account />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/my-transactions" element={<MyTransactions />} />
          <Route path="*" element={<h1>404</h1>} />
          <Route path="/account-personal" element={<Personal />} />
          <Route path="/account-business" element={<Business />} />
          <Route path="/account" element={<AccountType />} />
          <Route path="/accounts/:id" element={<AccountDetails />} />
          <Route path="/my-dashboard/notifications" element={<Notifications />} />
          <Route path="inbox" element={<Messages />} />
          <Route path="/messages/:id" element={<MessageDetails/>}/>
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/my-products" element={<Products />} />
          <Route path="/my-shop" element={<MyShop/>} />
          <Route path={`/user/${user?.username}`} element={<User />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </main>
    </ErrorBoundary>
  );
}

export default App;
