import React from 'react'
import NavBar from '../components/NavBar'
import Cards from './Cards'
import { useNavigate } from 'react-router-dom'
import ReactRotatingText from 'react-rotating-text';
function Home() {
  const navigate = useNavigate();
  return (
    <div className=''>
    <NavBar/>
    <div className='flex w-full flex-col justify-center'>
         <h1 className='text-center leading-loose mt-28  text-4xl text-white font-bold'>
        MAKE ALL YOUR TRANSACTIONS IN ONE APP.<br/>
        RECEIVE, SEND , DEPOSIT and TRACK<br/>
        <span className='try'>TRY REPAY</span>
    </h1>
    <p className='text-center leading-loose text-slate-200'>Enjoy easy and instant money transactions. Pay your bills faster and secure <br/>
     <span className='try'> enjoy free transaction </span>
   costs across all networks
    </p>
    </div>
   <div className='text-center my-4'>
    <button onClick={()=>navigate('/account')} className="bg-gradient-to-r from-slate-200 to-green-500 font-bold rounded-full mx-3 px-20 py-3">Start Now</button>
    <button onClick={()=>navigate('/login')} className="bg-transparent text-white rounded-full px-20 py-3 border ">Member Area</button>
   </div>
   <h2 className="lg:text-4xl  text-center   text-xl py-6 text-primary font-semibold text-green-500">
             <ReactRotatingText items={['Make Transactions', 'Receive Money', 'Withdraw Money','Pay Online']}/>
          </h2>
      <Cards/>
      <div className='flex justify-center'>
         <button onClick={()=>navigate('/how-it-works')} className="bg-transparent border-emerald-500 text-rose-600 rounded-md px-20 py-3 border ">How it Works</button>
      </div>
      <h1 className='text-center text-3xl font-bold mt-6 text-slate-200'>FAQ's</h1>
     
    </div>
  )
}

export default Home
