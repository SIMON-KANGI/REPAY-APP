import React from 'react'
import CreateContacts from './createContacts'

import TopNav from '../TopNav'
import SideBar from '../SideBar'

function Contacts() {
  return (
    <div className='flex'>
    <SideBar/>
    <section>
        <TopNav/>
        <div>
           <CreateContacts/> 
        </div>
    </section>
      
    </div>
  )
}

export default Contacts
