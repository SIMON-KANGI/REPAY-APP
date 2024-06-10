import React from 'react'
import { Card,CardBody,CardHeader, CardFooter, Box } from '@chakra-ui/react'
import { GrTransaction } from "react-icons/gr";
import { PiHandWithdrawFill } from "react-icons/pi";
import { GiReceiveMoney } from "react-icons/gi";
function Cards() {
  return (
    <Box className='lg:flex justify-center'>

      <Card background={'rgba(65,65,105,0.4)'} margin={'1rem'}textColor={'white'}>
<CardHeader className=''>

    <h1 className='text-center text-2xl font-bold'>
<span className='text-green-400 text-4xl'>
    <GrTransaction/>
</span>
    Make Transactions</h1>
</CardHeader>
<CardBody className=''>
    <p className='text-md leading-loose'>Make Transactions across all networks for free.<br/>
    View your transactions history. Buy products</p>
</CardBody>
      </Card>
      <Card background={'rgba(60,60,100,0.4)'} margin={'1rem'} textColor={'white'}>
<CardHeader>
    <h1 className='text-center text-2xl font-bold'>
    <span className='text-rose-600 text-4xl'>
    <GiReceiveMoney/>
</span>
    Receive</h1>
</CardHeader>
<CardBody>
    <p>Make withrawals according to your account</p>
</CardBody>
      </Card>
      <Card background={'rgba(60,60,100,0.4)'} margin={'1rem'} textColor={'white'}>
<CardHeader>
    <h1 className='text-center text-2xl font-bold'>
    <span className='text-orange-400 text-4xl'>
    <PiHandWithdrawFill/>
</span>
    Withdrawals</h1>
</CardHeader>
<CardBody>
    <p>Make withrawals according to your account</p>
</CardBody>
      </Card>
    </Box>
  )
}

export default Cards
