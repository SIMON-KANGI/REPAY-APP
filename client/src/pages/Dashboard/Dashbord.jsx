import { Card, CardBody, Box, Button } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineTransaction } from "react-icons/ai";
import { PiHandWithdraw } from "react-icons/pi";
import { RiFolderReceivedFill } from "react-icons/ri";
import { MdAccountBalanceWallet } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { PiHandWithdrawFill } from "react-icons/pi";
import { MdContacts } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
function Dashbord() {
  return (
    <div className='p-8'>
    <section className='grid grid-cols-5'>
    <Card className='m-4 p-8 justify-center'>
        <CardBody>
            <h1>Total Users</h1>
            <div>
            <h1 className='text-4xl font-extrabold'>80,000</h1>
            <p><span className='text-rose-600'>-2000 </span>from last week</p>
            </div>
        </CardBody>
      </Card>
         <Card className='m-4 p-8 justify-center'>
        <CardBody>
            <h1 className='flex items-center font-bold'>
            <span className='text-green-500'><AiOutlineTransaction /></span>
            Amount Transacated</h1>
            <div>
            <h1 className='text-4xl font-extrabold'>50,000</h1>
            <p><span className='text-green-600'>+2000 </span>from last week</p>
            </div>
        </CardBody>
      </Card>
      <Card className='m-4 py-8 px-6 justify-center'>
      <CardBody className='w-full'>
            <h1 className='flex  items-center font-bold'>
            <span className='text-rose-600 font-bold'><PiHandWithdraw /></span>
           Amount Widthdrawn </h1>
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
            Amount Received</h1>
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
            Amount Received</h1>
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
<div className='rounded-full text-green-800 font-bold  text-2xl w-10 h-10 bg-stone-200  flex items-center justify-center'>
<IoIosSend/>
</div>
    Send Money
</div>
<div className='items-center p-4 block mt-4'>
<div className='rounded-full text-emerald-600 font-bold  text-2xl w-10 h-10 bg-stone-200  flex items-center justify-center'>
<PiHandWithdrawFill/>
</div>
    Withdraw
</div>
<div className='items-center mx-6 p-4 block mt-4'>
<div className='rounded-full text-green-300 font-bold  text-2xl w-10 h-10 bg-stone-200  flex items-center justify-center'>
<MdContacts/>
</div>
    Contacts
</div>
<div className='items-center p-4 block mt-4'>
<div className='rounded-full text-lime-500 font-bold  text-2xl w-10 h-10 bg-stone-200  flex items-center justify-center'>
<span className='text-center'><MdContacts/></span>
</div>
    My Account
</div>
<div className='items-center p-4 block mt-4'>
<div className='rounded-full text-lime-700 font-bold  text-2xl w-10 h-10 bg-stone-200  flex items-center justify-center'>
<span className='text-center'><LiaFileInvoiceSolid/></span>
</div>
    Invoices
</div>
</CardBody>

        </Card>
        <Box class="p-5 mr-2 overflow-y-scroll h-60 w-1/2 position-fixed scroll-">
        <div className="bg-stone-950 text-center justify-center flex h-12 align-middle">
        <h2 class="text-slate-100 p-3  w-100">
            Recent Transactions
        </h2>
        </div>
        <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-stone-300">
            <div className=" p-2 align-middle">
            <h5 className="text-green-500 font-extrabold">009ur47</h5>
            <h6 className="text-stone-800 font-bold">Simon</h6>
            </div>
            <div className="m-3 text-slate-200">
            <h6 className="text-zinc-800 text-sm">072435464</h6>
            </div>
            <div className="m-3 text-slate-200">
            <Button class="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
        </div>
        <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-stone-300">
            <div className=" p-2 align-middle">
            <h5 className="text-green-500 font-extrabold">009ur47</h5>
            <h6 className="text-stone-900 font-bold">Charity</h6>
            </div>
            <div className="m-3 text-slate-200">
            <h6 className="text-zinc-300 text-sm">39764784</h6>
            </div>
            <div className="m-3 text-slate-200">
            <Button class="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
        </div>
        <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-sky-950">
            <div className=" p-2 align-middle">
            <h5 className="text-green-500 font-extrabold">009ur47</h5>
            <h6 className="text-slate-200">Abaadir</h6>
            </div>
            <div className="m-3 text-slate-200">
            <h6 className="text-zinc-300 text-sm">3873785</h6>
            </div>
            <div className="m-3 text-slate-200">
            <Button class="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
        </div>
        <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-sky-950">
            <div className=" p-2 align-middle">
            <h5 className="text-green-500 font-extrabold">009ur47</h5>
            <h6 className="text-slate-200">Mwangi</h6>
            </div>
            <div className="m-3 text-slate-200">
            <h6 className="text-zinc-300 text-sm">3873785</h6>
            </div>
            <div className="m-3 text-slate-200">
            <Button class="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
        </div>
        
    </Box>
    </section>
    <section className='flex h-60 my-6'>
    <Box class="p-5 mr-2 overflow-y-scroll h-60 w-1/2 position-fixed scroll-">
        <div className="bg-stone-950 text-center justify-center flex h-12 align-middle">
        <h2 class="text-slate-100 p-3  w-100">
            Recent Transactions
        </h2>
        </div>
        <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-stone-300">
            <div className=" p-2 align-middle">
            <h5 className="text-green-500 font-extrabold">009ur47</h5>
            <h6 className="text-stone-800 font-bold">Simon</h6>
            </div>
            <div className="m-3 text-slate-200">
            <h6 className="text-zinc-800 text-sm">072435464</h6>
            </div>
            <div className="m-3 text-slate-200">
            <Button class="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
        </div>
        <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-stone-300">
            <div className=" p-2 align-middle">
            <h5 className="text-green-500 font-extrabold">009ur47</h5>
            <h6 className="text-stone-900 font-bold">Charity</h6>
            </div>
            <div className="m-3 text-slate-200">
            <h6 className="text-zinc-300 text-sm">39764784</h6>
            </div>
            <div className="m-3 text-slate-200">
            <Button class="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
        </div>
        <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-sky-950">
            <div className=" p-2 align-middle">
            <h5 className="text-green-500 font-extrabold">009ur47</h5>
            <h6 className="text-slate-200">Abaadir</h6>
            </div>
            <div className="m-3 text-slate-200">
            <h6 className="text-zinc-300 text-sm">3873785</h6>
            </div>
            <div className="m-3 text-slate-200">
            <Button class="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
        </div>
        <div className="flex mt-2 align-middle p-4 justify-between w-100 bg-sky-950">
            <div className=" p-2 align-middle">
            <h5 className="text-green-500 font-extrabold">009ur47</h5>
            <h6 className="text-slate-200">Mwangi</h6>
            </div>
            <div className="m-3 text-slate-200">
            <h6 className="text-zinc-300 text-sm">3873785</h6>
            </div>
            <div className="m-3 text-slate-200">
            <Button class="bg-teal-500 text-slate-200 p-1 w-100 border-r-2">$45.90</Button>
            </div>
        </div>
        
    </Box>
        <Card className='p-4 mx-4 h-fit w-fit'>
<h1 className='font-bold text-xl'>Create Invoice</h1>
<CardBody className=''>
    <div className='items-center w-full block border-2 border-stone-800 p-4 mt-4'>
<form>
    <div className='flex'>
    <label className='block text-gray-700 text-sm font-bold mx-3 mb-2' for='Email'>
    Customers Email
    <input className='shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='username' type='text' placeholder='Customers Email' />
    </label>
    
    <label className='block text-gray-700 text-sm font-bold mb-2' for='description'>
    Service description
    <input className='shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='username' type='text' placeholder='description' />
    </label>
   </div>
   <div className='flex'>
    <label className='block text-gray-700 text-sm font-bold mx-3 mb-2' for='amount'>
    Charged Amount
    <input className='shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='username' type='number' placeholder='amount' />
    </label>
    
    <label className='block text-gray-700 text-sm font-bold mb-2' for='words'>
    Amount in Words
    <input className='shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='username' type='text' placeholder='amount in words' />
    </label>
   </div>
</form>
   
</div>

</CardBody>

        </Card>
       
    </section>
    </div>
  )
}

export default Dashbord
