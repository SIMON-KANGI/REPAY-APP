import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectUserData } from '../../../features/auth/Authslice'
import { Box, Card, CardBody } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import useFetch from '../../../hooks/UseFetch'
function MyAccounts() {
    
    const user = useSelector(selectUserData);
    const { data: accounts, loading, error } = useFetch('http://127.0.0.1:5555/accounts');
  const FilterAccount=accounts?.filter(account=>account.user_id===user.id)
  return (
   
       <Box className='mt-20 grid lg:grid-cols-4  justify-evenly'>
       
        {
          FilterAccount?.map(account => (
            <Link to={`/accounts/${account.id}`} state={{account}}>
                 <Card backgroundColor={'stone.800'} textColor={'stone.200'} key={account.id} className='mt-4 p-10 mx-4 items-center'>
              <CardBody>
                <h1 className='font-bold text-xl'>{account.account_number}</h1>
                <h1 className='font-bold text-rose-600 text-2xl'>
                <span className='text-xl text-stone-300'>Bank Name: </span>
                  {account.category}
                </h1> 
                <h1 className='text-3xl text-green-400 font-bold'>
                <span className='text-xl text-stone-300'>Your balance:  {account.currency}</span>
               {account.balance}</h1>
                <h1 className='text-3xl text-sky-500 '>
                <span className='text-stone-300 text-xl'>Account No: </span>
                  {account.number}..
                </h1>
               
              </CardBody>
            </Card>
            </Link>
         
          ))
        }
      </Box>
   
  )
}

export default MyAccounts
