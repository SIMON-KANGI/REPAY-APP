import { useState } from 'react'

import Login from './pages/authentication/Login'
import { Route, Routes } from 'react-router-dom'
function App() {
  return (
    <>
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="*" element={<h1>404</h1>} />
</Routes>
    </>
  )
}

export default App
