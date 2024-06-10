import React from 'react'
import { FaApple } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";
function Footer() {
  return (
    <div className='shadow-md  p-16 bg-stone-950'>
    <section className='flex justify-around'>
         <div className='text-center'>
        <h1 className='font-bold text-slate-200'>Send & Receive</h1>
        <ul className='text-slate-200'>
            <li>How it Works</li>
            <li>Tips and tricks</li>
            <li>Manage balance</li>
            <li>Direct Deposit</li>
            <li>Convert Currency</li>
        </ul>
      </div>
      <div className='text-center'>
        <h1 className='font-bold text-slate-200'>Pay with REPAY</h1>
        <ul className='text-slate-200'>
            <li>Ways to pay</li>
            <li>Pay business</li>
            <li>Pay in apps & online</li>
            <li>Pay in stores</li>
            <li>Convert Currency</li>
        </ul>
      </div>
      <div className='text-center'>
        <h1 className='font-bold text-slate-200'>REPAY for business</h1>
        <ul className='text-slate-200'>
            <li>Ways to get paid</li>
            <li>Accept Repay payments</li>
            <li>Accept Repay in apps & online</li>
            
        </ul>
      </div>
      <div>
        <h1 className='font-bold text-slate-200'>Help Center</h1>
      </div>
      <div className='grid'>
        <button className='rounded-full flex text-xl px-8 m-3 py-3 text-slate-200 border'>
        <FaApple/>
        Apple Store</button>
        <button className='rounded-full flex text-xl px-8 m-3 py-3 text-slate-200 border'>
        <FaGooglePlay/>
        Play Store</button>
      </div>
    </section>
     
    </div>
  )
}

export default Footer
