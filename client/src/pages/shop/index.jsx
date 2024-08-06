import React from 'react'
import SideBar from '../Dashboard/SideBar'
import TopNav from '../Dashboard/TopNav'
function MyShop() {
  return (
    <div className='flex'>
    <SideBar/>
    <section className='w-full'>
    <TopNav/>
      <h1>My Shop</h1>
    </section>
      
    </div>
  )
}

export default MyShop
