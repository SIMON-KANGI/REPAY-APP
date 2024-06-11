import React from 'react'
import SideBar from './SideBar'
import TopNav from './TopNav'

function Dashboard() {
  return (
    <div className='flex'>
   
      <SideBar/> 
    <section className='w-full'>
        <TopNav/>
        <div>

        </div>
      </section>
    </div>
  )
}

export default Dashboard
