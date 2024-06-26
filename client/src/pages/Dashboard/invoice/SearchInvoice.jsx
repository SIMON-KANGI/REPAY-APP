import React from 'react'

function SearchInvoice({value,handleChange}) {
  return (
    <div className='float-end'>
      <div className='float-end mx-4'>
        <input type='text' value={value} onChange={handleChange} placeholder='Search Invoice' className='p-2 w-60 rounded-md'/>
        <button type='submit' className='rounded-md bg-blue-700 text-white px-6 py-2'>Search</button>
      </div>
    </div>
  )
}

export default SearchInvoice
