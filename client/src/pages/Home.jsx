import React from 'react'
import NavBar from '../components/NavBar'
import Cards from './Cards'
import { useNavigate } from 'react-router-dom'
import ReactRotatingText from 'react-rotating-text';
import FAQ from '../components/Faq';
import Footer from '../components/Footer';
import SideNav from '../components/SideNav';
function Home() {
  const navigate = useNavigate();
  return (
    <div>
  
  <section
  className=" h-screen mb-8 bg-cover bg-no-repeat"
  style={{
    backgroundImage: "url(/bg.jpg)",
  }}
>
  <NavBar
  navStyles="bg-transparent hover:text-black hover:bg-stone-100"/>
  <div className="flex px-4  lg:flex-row items-center  lg:justify-between">
    <div className="flex flex-col items-center lg:items-start lg:w-1/2 justify-center text-center lg:text-left">
      <h1 className="mt-16 leading-loose text-3xl lg:text-5xl text-stone-50 font-bold">
        MAKE ALL <span className="bg-rose-700 p-2 mb-2 inline-block">YOUR TRANSACTIONS</span> IN ONE APP. RECEIVE, SEND, DEPOSIT
      </h1>
      <p className="text-2xl leading-loose text-stone-200 mt-4">
        Enjoy easy and instant money transactions. Pay your bills faster and secure <br />
        <span className="text-green-600">enjoy free transaction</span> costs across all networks.
      </p>
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-center my-4 space-y-3 lg:space-y-0 lg:space-x-6">
  <button
    onClick={() => navigate('/account')}
    className="bg-gradient-to-r from-stone-600 to-stone-950 text-slate-200 font-bold rounded-md lg:rounded-full px-20 py-3 transition-transform transform hover:scale-105 w-full lg:w-auto"
  >
    Start Now
  </button>
  <button
    onClick={() => navigate('/login')}
    className="bg-transparent text-stone-100 border border-green-600 font-bold rounded-md lg:rounded-full px-20 py-3 transition-transform transform hover:scale-105 w-full lg:w-auto"
  >
    Member Area
  </button>
</div>

    </div>
    <div
     className="w-1/2 items-center h-1/2 lg:w-1/2 flex justify-center mt-8 lg:mt-0">
      <img src="/person.png" alt="person" className=""height="500px" width="500px"   />
    </div>
  </div>
  <div className='w-screen mt-8 bg-stone-900'>
     <h2 className="lg:text-4xl  text-center   text-xl py-6 text-primary font-semibold text-rose-600">
             <ReactRotatingText items={['Make Transactions', 'Receive Money', 'Withdraw Money','Pay Online']}/>
          </h2>
  </div>
 
</section>

  
  
      <Cards/>
      <div className='flex justify-center'>
         <button onClick={()=>navigate('/how-it-works')} className="bg-transparent border-stone-900 text-rose-600 font-bold rounded-md px-20 py-3 border-2 ">How it Works</button>
      </div>
      <h1 className='text-center text-3xl font-bold mt-6 text-stone-900'>FAQ's</h1>
      <FAQ/>
     <Footer/>
    </div>
  )
}

export default Home
