import { useEffect,useState } from 'react' 
import SideBar from '../SideBar'
import TopNav from '../TopNav'
import CreateAccount from './CreateAccount'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectUserData } from '../../../features/auth/Authslice'
import { Box, Card, CardBody } from '@chakra-ui/react'
function Account() {
  const [accounts, setAccounts]=useState([])
  const user = useSelector(selectUserData);

  useEffect(() => {
    axios.get('http://127.0.0.1:5555/accounts')
      .then(res => setAccounts(res.data))
      .catch(err => console.error(err));
  }, []);
const FilterAccount=accounts.filter(account=>account.user_id===user.id)
  return (
    <div className='flex'>
    <SideBar/>
    <section className='w-full'>
      <TopNav/>
      <CreateAccount/>
      <h1 className='text-center text-3xl text-green-400 font-bold'>My Accounts</h1>
    <Box className='mt-20 grid grid-cols-4 justify-evenly'>
        {
          FilterAccount.map(account => (
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
          ))
        }
      </Box>
      </section>
     
      
    </div>
  )
}

export default Account
