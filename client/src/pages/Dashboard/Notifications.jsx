import React,{useState, useEffect} from 'react'
import SideBar from './SideBar'
import TopNav from './TopNav'
import NotificationList from './notificationList'

function Notifications() {
 
  return (
    <div className='flex'>
   
    <SideBar/> 
  <section className='w-full'>
      <TopNav />
      <div>
<h1 className='text-center text-2xl'>Notifications</h1>
      </div>
      <NotificationList/>
    </section>
  </div>
  )
}

export default Notifications
