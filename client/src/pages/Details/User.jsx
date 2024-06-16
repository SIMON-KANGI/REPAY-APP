import React from 'react'
import SideBar from '../Dashboard/SideBar'
import TopNav from '../Dashboard/TopNav'
import { selectUserData } from '../../features/auth/Authslice'
import { useSelector } from 'react-redux'
import Account from '../Dashboard/Accounts/Account'
import MyAccounts from '../Dashboard/Accounts/myAccounts'
function User() {
    const user=useSelector(selectUserData)
  return (
    <div className='flex'>
     <SideBar/>
     <section className="w-full">
        <TopNav/> 
         <h1 className='text-center text-green-500 font-bold text-3xl'>My Profile</h1>
         <div>
            <h2 className='text-center text-2xl bg-stone-900 text-stone-200'>Personal Details</h2>
            <div className='p-4'>
                <h1 className='text-xl flex'>Full Name:
                <span className='font-bold'>{user.username}</span>
                </h1>
                <h1 className=' text-xl flex'>Phone Number:
                <span className='font-bold'>{user.phone}</span>
                </h1>
                <h1 className='text-xl flex'>Email:
                <span className='font-bold'>{user.email}</span>
                </h1>
                <h1 className='text-xl'>Location:
                <span className='font-bold'>{user.location}</span>
                </h1>
            </div>
            <h2 className='text-center text-2xl bg-stone-900 text-stone-200'>Account Details</h2>
            <MyAccounts/>
         </div>
     </section>
    
    </div>
  )
}

export default User
