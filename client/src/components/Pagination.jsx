import React from 'react'

function Pagination({numberPerpage, totalItems, paginate}) {
    const pageNumbers=[]

    for(let i=1; i<=Math.ceil(totalItems/numberPerpage);i++){
      pageNumbers.push(i)
    }
  return (
    <nav>
    <ul className='flex justify-center'>
           {
      pageNumbers.map(number=>(
        <li key={number} className='flex m-2 p-2' >
          <button onClick={()=>paginate(number)}  className='bg-stone-600 text-white p-3 rounded-md'>{number}</button>
        </li>
      ))
     } 
    </ul>

    </nav>
  )
}

export default Pagination