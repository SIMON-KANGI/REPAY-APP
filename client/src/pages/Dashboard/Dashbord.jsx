import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../features/auth/Authslice';
import useFetch from '../../hooks/UseFetch';
import { Card, CardBody, Box, Button } from '@chakra-ui/react';
import { AiOutlineTransaction } from "react-icons/ai";
import { PiHandWithdraw, PiHandWithdrawFill } from "react-icons/pi";
import { RiFolderReceivedFill } from "react-icons/ri";
import { MdAccountBalanceWallet, MdContacts } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { LiaFileInvoiceSolid } from "react-icons/lia";

function Dashboard() {
  const { data: transactions } = useFetch('https://repay-app.onrender.com/transactions');
  const { data: users } = useFetch('https://repay-app.onrender.com/users');
  const user = useSelector(selectUserData);
  const filteredTransactions = transactions?.filter(transaction => transaction.user_id === user?.id) || [];

  const sumOfTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  }, [filteredTransactions]);

  return (
    <div className='p-8'>
      <section className='grid grid-cols-5'>
        <Card className='m-4 p-8 justify-center'>
          <CardBody>
            <h1>Total Users</h1>
            <div>
              <h1 className='text-4xl font-extrabold'>{users?.length}</h1>
              <p><span className='text-rose-600'>-20 </span>from last week</p>
            </div>
          </CardBody>
        </Card>
        <Card className='m-4 p-8 justify-center'>
          <CardBody>
            <h1 className='flex items-center font-bold'>
              <span className='text-green-500'><AiOutlineTransaction /></span>
              Amount Transacted
            </h1>
            <div>
              <h1 className='text-4xl font-extrabold'>${sumOfTransactions}</h1>
              <p><span className='text-green-600'>+2000 </span>from last week</p>
            </div>
          </CardBody>
        </Card>
        <Card className='m-4 py-8 px-6 justify-center'>
          <CardBody className='w-full'>
            <h1 className='flex items-center font-bold'>
              <span className='text-rose-600 font-bold'><PiHandWithdraw /></span>
              Amount Withdrawn
            </h1>
            <div>
              <h1 className='text-4xl font-extrabold'>70,000</h1>
              <p><span className='text-rose-600'>-2000 </span>from last week</p>
            </div>
          </CardBody>
        </Card>
        <Card className='m-4 p-8 justify-center'>
          <CardBody>
            <h1 className='flex items-center font-bold'>
              <span className='text-rose-600 font-bold'><RiFolderReceivedFill /></span>
              Amount Received
            </h1>
            <div>
              <h1 className='text-4xl font-extrabold'>100,000</h1>
              <p><span className='text-emerald-600'>+20000 </span>from last week</p>
            </div>
          </CardBody>
        </Card>
        <Card className='m-4 p-8 justify-center'>
          <CardBody>
            <h1 className='flex items-center font-bold'>
              <span className='text-blue-600 font-bold'><MdAccountBalanceWallet /></span>
              Total Balance
            </h1>
            <div>
              <h1 className='text-4xl font-extrabold'>700,000</h1>
              <p><span className='text-emerald-600'>+20000 </span>from last week</p>
            </div>
          </CardBody>
        </Card>
      </section>
      <section className='flex h-60'>
        <Card className='p-8 mx-4 w-fit'>
          <h1 className='font-bold text-xl'>Quick Links</h1>
          <CardBody className='flex'>
            <div className='items-center mx-4 block border-r-2 border-stone-800 p-4 mt-4'>
              <div className='rounded-full text-green-800 font-bold text-2xl w-10 h-10 bg-stone-200 flex items-center justify-center'>
                <IoIosSend />
              </div>
              Send Money
            </div>
            <div className='items-center p-4 block mt-4'>
              <div className='rounded-full text-emerald-600 font-bold text-2xl w-10 h-10 bg-stone-200 flex items-center justify-center'>
                <PiHandWithdrawFill />
              </div>
              Withdraw
            </div>
            <div className='items-center mx-6 p-4 block mt-4'>
              <div className='rounded-full text-green-300 font-bold text-2xl w-10 h-10 bg-stone-200 flex items-center justify-center'>
                <MdContacts />
              </div>
              Contacts
            </div>
            <div className='items-center p-4 block mt-4'>
              <div className='rounded-full text-lime-500 font-bold text-2xl w-10 h-10 bg-stone-200 flex items-center justify-center'>
                <MdContacts />
              </div>
              My Account
            </div>
            <div className='items-center p-4 block mt-4'>
              <div className='rounded-full text-lime-700 font-bold text-2xl w-10 h-10 bg-stone-200 flex items-center justify-center'>
                <LiaFileInvoiceSolid />
              </div>
              Invoices
            </div>
          </CardBody>
        </Card>
        <Box className='p-5 mr-2 overflow-y-scroll h-60 w-1/2 position-fixed'>
          <div className="bg-stone-950 text-center justify-center flex h-12 align-middle">
            <h2 className="text-slate-100 p-3 w-100">
              Recent Transactions
            </h2>
          </div>
          {filteredTransactions.slice(0, 10).map(transaction => (
            <div key={transaction.id} className="flex mt-2 align-middle p-4 justify-between w-100 bg-stone-300">
              <div className="p-2 align-middle">
                <h5 className="text-green-500 font-extrabold">{transaction.id}</h5>
                <h6 className="text-stone-800 text-md font-bold">{transaction.accountOne}</h6>
              </div>
              <div className="m-3 text-slate-200">
                <h6 className="text-zinc-800 text-xl">{transaction.accountTwo}</h6>
              </div>
              <div className="m-3 text-slate-200">
                <Button className="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">${transaction.amount}</Button>
              </div>
            </div>
          ))}
        </Box>
      </section>
      <section className='flex h-60 my-6'>
        <Box className='p-5 mr-2 overflow-y-scroll h-60 w-1/2'>
          <div className="bg-stone-950 text-center justify-center flex h-12 align-middle">
            <h2 className="text-slate-100 p-3 w-100">
              Recent Transactions
            </h2>
          </div>
          <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-stone-300">
            <div className="p-2 align-middle">
              <h5 className="text-green-500 font-extrabold">009ur47</h5>
              <h6 className="text-stone-800 font-bold">Simon</h6>
            </div>
            <div className="m-3 text-slate-200">
              <h6 className="text-zinc-800 text-sm">072435464</h6>
            </div>
            <div className="m-3 text-slate-200">
              <Button className="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
          </div>
          <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-stone-300">
            <div className="p-2 align-middle">
              <h5 className="text-green-500 font-extrabold">009ur47</h5>
              <h6 className="text-stone-800 font-bold">Simon</h6>
            </div>
            <div className="m-3 text-slate-200">
              <h6 className="text-zinc-800 text-sm">072435464</h6>
            </div>
            <div className="m-3 text-slate-200">
              <Button className="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
          </div>
        </Box>
      </section>
    </div>
  );
}

export default Dashboard;
