import React from 'react'
import SideBar from '../SideBar'
import TopNav from '../TopNav'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
function AccountDetails() {
    const currAccount = useLocation()
   const account=currAccount.state?.account

   function ChangeCurrency(){
    axios.patch(`http://127.0.0.1:5555/account/${account.id}/currency`)
   }
  return (
    <div className='flex'>
    <SideBar/>
    <section className='w-full'>
    <TopNav/>
      <h1 className='text-center text-3xl'><span className='text-rose-600'>{account.category}</span> Account Details</h1>
      <form className='w-1/2 align-middle mx-8'>
        <div className='flex flex-col bg-stone-900 rounded-md p-8 text-stone-200 shadow-md my-4'>
        <label className='text-2xl text-green-400'>Account Number</label>
    <h1 className='text-xl'>{account.number}</h1>
      </div>
      <div className='flex flex-col  bg-stone-900 p-8 text-stone-200 shadow-md'>
        <label className='text-2xl text-green-400'>Balance</label>
        <h1 className='text-rose-600'>Change Currency</h1>
        <select className='text-black w-1/2'>
            <option value="">{account.currency}</option>
            <option value="KSH">KSH</option>
            <option value="USD">USD</option>
        </select>
        <h1 className='text-xl'>{account.currency} {account.balance}</h1>
      </div>
      </form>
      
    </section>
      
    </div>
  )
}

export default AccountDetails
