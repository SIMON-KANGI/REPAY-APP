import React from 'react'

function SearchInvoice() {
  return (
    <div className='float-end'>
      <form className='float-end mx-4'>
        <input type='text' placeholder='Search Invoice' className='p-2 w-60 rounded-md'/>
        <button type='submit' className='rounded-md bg-blue-700 text-white px-6 py-2'>Search</button>
      </form>
    </div>
  )
}

export default SearchInvoice
