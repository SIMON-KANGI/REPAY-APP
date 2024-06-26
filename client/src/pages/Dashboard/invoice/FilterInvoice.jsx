import React, { useCallback, useState } from 'react'

function FilterInvoice({handleStatus}) {
  const [activeStatus, setActiveStatus]= useState(null)

  const handleClick=useCallback((status)=>{
    if(activeStatus !==status){
      setActiveStatus(status)
      handleStatus(status)
    }
  },[activeStatus, setActiveStatus])
  return (
    <div className='flex float-start mx-4'>
      <button
      onClick={()=>handleClick('')}
       className='bg-stone-800 rounded-sm text-slate-200 font-bold px-6 py-2'>View All</button>
      <button 
      onClick={()=>handleClick('Paid')}
      className={`${activeStatus==='Paid'?'bg-green-800 text-slate-200':'bg-transparent text-stone-900' } rounded-sm border-2 border-gray-500  font-bold px-6 py-2`}>Paid</button>
      <button 
      onClick={()=>handleClick('Pending')}
      className={`${activeStatus==='Pending'?'bg-rose-600 text-slate-200':'text-stone-900'}  rounded-sm  border-2 border-gray-500 font-bold px-6 py-2`}>Pending</button>
    </div>
  )
}

export default FilterInvoice
