import { useState } from 'react'

import Login from './pages/authentication/Login'
import { Route, Routes } from 'react-router-dom'

import NavBar from './components/NavBar'
import AccountType from './pages/authentication/AccountType'
import Personal from './pages/authentication/Personal'
import Business from './pages/authentication/Business'
function App() {
  return (
    <>
   {/* <NavBar/> */}
   <main className='container'>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/account-personal" element={<Personal/>} />
      <Route path="/account-business" element={<Business/>} />
      <Route path="/account" element={<AccountType />} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
   </main>

    </>
  )
}

export default App
