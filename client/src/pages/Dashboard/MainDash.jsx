import React from 'react'
import SideBar from './SideBar'
import TopNav from './TopNav'
import Dashbord from './Dashbord'

function MainDash() {
  return (
    <div className='flex'>
   
      <SideBar/> 
    <section className='w-full'>
        <TopNav/>
        <div>
<Dashbord/>
        </div>
      </section>
    </div>
  )
}

export default MainDash
