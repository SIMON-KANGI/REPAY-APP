import React, {useState} from 'react'
import { Divider, Center } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
function AccountType() {
    const [accountType, setAccountType] =useState('personal')
    const location=useLocation()
    const navigate=useNavigate()
    function handleAccountType(event){
        setAccountType(event.target.value)
        console.log(event.target.value)
    }
    function handleProceed(){
        console.log(accountType)
        if(accountType==='personal'){
           navigate('/account-personal')
        }else{
            navigate('/account-business')
        }
    }
  return (
    <section className='flex justify-center  w-full'>
      <h1>Account Type</h1>
      <div>
        <img src="http://placehold.it/" alt="placholder" />
      </div>
      <div>
      <Center height='50px'>
  <Divider orientation='vertical' />
</Center>
      <form onSubmit={handleProceed}>
      <div className='border border-gray-600 p-4 rounded-md w-96'>
      <label className='font-bold text-xl'>
        <input type="checkbox" onChange={handleAccountType} name='personal' value='personal' checked={accountType==='personal'}/>
         Personal</label>
        <p>Create an account to manage your personal transaction</p>
      </div>
      <div className='border my-4 border-gray-600 p-4 rounded-md w-96'>
      <label className='font-bold text-xl'>
        <input type="checkbox" onChange={handleAccountType} name="business" value='business' checked={accountType ==='business'}/>
        Business</label>
        <p>Create an account to manage your Business transactions <br/>
        Make invoices to send to yoyr clients. Manage all your business accounts <br/> and transactions</p>
      </div>
        <button type="submit" className='w-full bg-green-700 text-white rounded-md py-3 '>Proceed</button>
      </form>
        
      </div>
    </section>
  )
}

export default AccountType
