import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './features/store.jsx'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store}>  
 
  <BrowserRouter> 
  {/* <ToastContainer> */}
  <App />  
  {/* </ToastContainer> */}
</BrowserRouter>
 
  
  </Provider>
   
  </React.StrictMode>,
)
