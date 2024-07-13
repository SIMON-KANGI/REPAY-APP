import { useEffect } from 'react'
import Login from './pages/authentication/Login'
import { Route, Routes } from 'react-router-dom'
import About from './pages/About'
import NavBar from './components/NavBar'
import AccountType from './pages/authentication/AccountType'
import Personal from './pages/authentication/Personal'
import Business from './pages/authentication/Business'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard/MainDash'
import Notifications from './pages/Dashboard/Notifications'
import Invoices from './pages/Dashboard/invoice/Invoices'
import MainDash from './pages/Dashboard/MainDash'
import Account from './pages/Dashboard/Accounts/Account'
import User from './pages/Details/User'
import { selectUserData, selectCurrentToken } from './features/auth/Authslice'
import { useDispatch, useSelector } from'react-redux'
import AccountDetails from './pages/Dashboard/Accounts/accountDetails'
import Contacts from './pages/Dashboard/contacts/Contacts'
import Products from './pages/Dashboard/Products/Products'
import MyTransactions from './pages/Dashboard/transactions.jsx/MyTransactions'
function App() {
  const user = useSelector(selectUserData);
  const dispatch= useDispatch()
  useEffect(()=>{
    const token =localStorage.getItem('access_token')
    if(token){
      dispatch(selectCurrentToken(token))
    }
  
  },[dispatch])
  return (
    <>
   {/* <NavBar/> */}
   <main  className=' bg-sky-950 h-full' id="main">
    <Routes>
     <Route path="/" element={<Home/>} />
     <Route path="/how-it-works" element={<About/>} />
      <Route path="/login" element={<Login />} />
      <Route path='/my-dashboard' element={<MainDash />}/>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="notifications" element={<Notifications/>} />
        <Route path="invoices" element={<Invoices/>} />
        <Route path='/accounts' element={<Account/>} />
        <Route path='/contacts' element={<Contacts/>} />
        <Route path='/my-transactions' element={<MyTransactions/>} />
        <Route path="*" element={<h1>404</h1>} />
    
      <Route path="/account-personal" element={<Personal/>} />
      <Route path="/account-business" element={<Business/>} />
      <Route path="/account" element={<AccountType />} />
      <Route path={'/accounts/:id'} element={<AccountDetails/>} />
      <Route path={'/my-dashboard/notifications'} element={<Notifications/>} />
      <Route path={'/invoices'} element={<Invoices/>} />
      <Route path={'/my-products'} element={<Products/>} />
      <Route path={`/user/${user.username}`} element={<User/>} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
   </main>

    </>
  )
}

export default App
