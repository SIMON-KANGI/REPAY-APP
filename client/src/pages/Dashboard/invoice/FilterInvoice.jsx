import React from 'react'

function FilterInvoice() {
  return (
    <div className='flex m-4'>
      <button className='bg-stone-800 rounded-sm text-slate-200 font-bol px-6 py-2'>View All</button>
      <button className='bg-green-600  rounded-sm text-slate-200 font-bol px-6 py-2'>Paid</button>
      <button className='bg-rose-600  rounded-sm text-slate-200 font-bol px-6 py-2'>Pending</button>
    </div>
  )
}

export default FilterInvoice
