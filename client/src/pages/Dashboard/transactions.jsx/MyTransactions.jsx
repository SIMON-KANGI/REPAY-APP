import React from 'react'
import SideBar from '../SideBar'
import TopNav from '../TopNav'
import useFetch from '../../../hooks/UseFetch'
function MyTransactions() {
    const {data:transactions, loading}= useFetch('http://127.0.0.1:5555/transactions')
  return (
    <div className='flex'>
      <SideBar/>
      <section className='w-full'>
        <TopNav/>
        <h1>My Transactions</h1>
{transactions.length >0 &&
<table  className='min-w-full table-auto'>
    <thead>
    <th className='px-4 py-2'>Id</th>
        <th className='px-4 py-2'>Date</th>
        <th className='px-4 py-2'>Account</th>
        <th className='px-4 py-2'>Amount</th>
        <th className='px-4 py-2'>Type</th>
        <th className='px-4 py-2'>Receiver</th>
    </thead>
    <tbody>
        {transactions.map(transaction=>(
            <tr className='bg-white border-b items-center' key={transaction.id}>
                <td className='px-4 py-2 text-center'>{transaction.id}</td>
                <td className='px-4 py-2 text-center'>{transaction.date.slice(0,16)}</td>
                <td className='px-4 py-2 text-center'>{transaction.accountOne}</td>
                <td className='px-4 py-2 text-center'>{transaction.amount}</td>
                <td className='px-4 py-2 text-center'>{transaction.type}</td>
                <td className='px-4 py-2 text-center'>{transaction.accountTwo}</td>
            </tr>
        ))}
    </tbody>
</table>
}
      </section>
    </div>
  )
}

export default MyTransactions
