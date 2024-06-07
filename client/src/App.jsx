import { useState } from 'react'

import Login from './pages/authentication/Login'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/authentication/SignUp'
function App() {
  return (
    <>
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<SignUp/>} />
  <Route path="*" element={<h1>404</h1>} />
</Routes>
    </>
  )
}

export default App
