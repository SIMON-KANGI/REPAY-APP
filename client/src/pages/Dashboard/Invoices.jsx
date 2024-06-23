import React from 'react'
import SideBar from './SideBar'
import TopNav from './TopNav'
import CreateInvoice from './CreateInvoice'
function Invoices() {
  return (
    <div className='flex'>
    <SideBar/>
    <section className='w-full'>
      <TopNav/>
      <div>
       <CreateInvoice/>
      </div>
      </section>
      </div>
  )
}

export default Invoices
