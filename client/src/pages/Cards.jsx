import React, {useEffect} from 'react'
import { Card,CardBody,CardHeader, CardFooter, Box } from '@chakra-ui/react'
import { GrTransaction } from "react-icons/gr";
import { PiHandWithdrawFill } from "react-icons/pi";
import { GiReceiveMoney } from "react-icons/gi";
import AOS from 'aos';
import 'aos/dist/aos.css';
function Cards() {
    useEffect(() => {
        AOS.init({
          duration: 500,
          easing: 'ease-in-out',
          once: false
        });
      }, []);
  return (
    <div>
       <Box className='lg:flex justify-center' data-aos='fade-up'>

      <Card background={'stone.800'} margin={'1rem'}textColor={'white'}>
<CardHeader className=''>

    <h1 className='text-center text-2xl font-bold'>
<span className='text-green-400 text-4xl'>
    <GrTransaction/>
</span>
    Make Transactions</h1>
</CardHeader>
<CardBody className=''>
    <p className='lg:text-md text-center leading-loose'>Make Transactions across all networks for free.<br/>
    View your transactions history. Buy products</p>
</CardBody>
      </Card>
      <Card background={'stone.900'} margin={'1rem'} textColor={'white'}>
<CardHeader>
    <h1 className='text-center text-2xl font-bold'>
    <span className='text-rose-600 text-4xl'>
    <GiReceiveMoney/>
</span>
    Receive</h1>
</CardHeader>
<CardBody>
    <p className='text-center'>Make withrawals according to your account</p>
</CardBody>
      </Card>
      <Card background={'stone.950'} margin={'1rem'} textColor={'white'}>
<CardHeader>
    <h1 className='text-center text-2xl font-bold'>
    <span className='text-orange-400 text-4xl'>
    <PiHandWithdrawFill/>
</span>
    Withdrawals</h1>
</CardHeader>
<CardBody>
    <p className='text-center'>Make withrawals according to your account</p>
</CardBody>
      </Card>
      
    </Box> 
    <h1 className='text-center text-slate-200 text-4xl'>Manage Your Funds On Repay</h1>
    <Box className='lg:flex justify-center w-full'>
        <Card background={'transparent'} margin={'2rem'} textColor={'black'} width={'400px'} data-aos="fade-right" className='hover:border-r-2 hover:border-b-2 hover:border-green-600 hover:shadow-md'>
            <CardBody className=''>
                <img src="money.png" alt="app" className='lg:rounded-full rounded-md lg:w-80 lg:h-80 w-full h-80' />
                <h1 className='font-bold text-2xl mt-4'>REPAY Mobile App</h1>
            <p>
                Download the REPAY mobile app.<br/>Manage all your accounts on one <br/>
                device.
            </p>
            </CardBody>
        </Card>
        <Card background={'transparent'} margin={'2rem'} textColor={'black'} width={'400px'} data-aos="fade-up" className='hover:border-r-2 hover:border-b-2 hover:border-yellow-600 hover:shadow-md'>
            <CardBody>
                <img src="bank.jpg" alt="app" className='lg:rounded-full rounded-md lg:h-80 lg:w-80'/>
                <h1 className='font-bold text-2xl mt-4'>BANK to BANK<br/>Transfers</h1>
            <p>
                Download the REPAY mobile app.<br/>Manage all your accounts on one <br/>
                device.
            </p>
            </CardBody>
        </Card>
        <Card background={'transparent'} margin={'2rem'} textColor={'black'} width={'400px'} data-aos="fade-left" className='hover:border-r-2 hover:border-b-2 hover:border-rose-600 hover:shadow-md'>
            <CardBody>
                <img src="free.jpg" alt="app" className='lg:rounded-full rounded-md lg:w-80 xl:w-72 xl:h-72 lg:h-80'/>
                <h1 className='font-bold text-2xl mt-4'>REPAY is Free to use</h1>
            <p>
            When you send money to friends or family, it won’t cost you any extra money for the transaction.1 Which is good,
             because there are way better things to spend money on, like concert tickets… or vacations.
            </p>
            </CardBody>
        </Card>
    </Box>
    </div>
    
  )
}

export default Cards
