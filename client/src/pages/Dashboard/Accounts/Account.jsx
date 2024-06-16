import { useEffect,useState } from 'react' 
import SideBar from '../SideBar'
import TopNav from '../TopNav'
import CreateAccount from './CreateAccount'
import MyAccounts from './myAccounts'
function Account() {
  
  return (
    <div className='flex'>
    <SideBar/>
    <section className='w-full'>
      <TopNav/>
      <CreateAccount/>
      <h1 className='text-center text-3xl text-green-400 font-bold'>My Accounts</h1>
    <MyAccounts/>
      </section>
     
      
    </div>
  )
}

export default Account
