
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
import Invoices from './pages/Dashboard/Invoices'
import MainDash from './pages/Dashboard/MainDash'
function App() {
  return (
    <>
   {/* <NavBar/> */}
   <main className='containers bg-sky-950 h-full'>
    <Routes>
     <Route path="/" element={<Home/>} />
     <Route path="/how-it-works" element={<About/>} />
      <Route path="/login" element={<Login />} />
      <Route path='/my-dashboard' element={<MainDash />}>
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="notifications" element={<Notifications/>} />
        <Route path="invoices" element={<Invoices/>} />
        <Route path="*" element={<h1>404</h1>} />
      </Route>
      <Route path="/account-personal" element={<Personal/>} />
      <Route path="/account-business" element={<Business/>} />
      <Route path="/account" element={<AccountType />} />
      <Route path={'/my-dashboard/notifications'} element={<Notifications/>} />
      <Route path={'/invoices'} element={<Invoices/>} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
   </main>

    </>
  )
}

export default App
