import React, { useState } from 'react';
import { Divider, Center } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

function AccountType() {
  const [accountType, setAccountType] = useState('personal');
  const location = useLocation();
  const navigate = useNavigate();

  function handleAccountType(event) {
    setAccountType(event.target.value);
    console.log(event.target.value);
  }

  function handleProceed(event) {
    event.preventDefault();
    console.log(accountType);
    if (accountType === 'personal') {
      navigate('/account-personal');
    } else {
      navigate('/account-business');
    }
  }

  return (
    <section className="flex w-full h-screen">
     <div
  style={{
    backgroundImage: "url(/Money-Transfer.png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  }}
  className="lg:w-3/4 w-0 lg:flex lg:flex-col justify-center items-center overflow-hidden"
>
  <div className='bg-stone-800 opacity-75 w-full h-full flex justify-center items-center'>
    <div className='text-center'>
      <h1 className='text-6xl font-extrabold text-white'>Great! Let's Start!</h1>
      <p className='text-slate-200 text-lg'>Follow the easy steps</p>
      <br />
      <button
        onClick={() => navigate('/')}
        className='py-3 my-6 rounded-md shadow-md text-slate-100 bg-emerald-700 w-32 font-bold'
      >
        Home
      </button>
    </div>
  </div>
</div>

        
      
      <div className="lg:w-fit w-full lg:flex lg:flex-col px-12 justify-center h-full bg-white">
        {/* <Center height="50px">
          <Divider orientation="vertical" />
        </Center> */}
        <div className="lg:flex full justify-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Account Type</h1>
        </div>
        <form onSubmit={handleProceed} className="space-y-4 w-full">
          <div className="border border-gray-300 hover:bg-stone-800 hover:text-white p-4 rounded-lg hover:shadow-md transition-shadow">
            <label className="font-bold text-xl flex items-center space-x-2">
              <input type="radio" onChange={handleAccountType} name="accountType" value="personal" checked={accountType === 'personal'} className="form-radio text-blue-600" />
              <span>Personal</span>
            </label>
            <p className="mt-2 hover:text-stone-200">Create an account to manage your personal transactions.</p>
          </div>
          <div className="border border-gray-300 p-4  hover:bg-stone-800 hover:text-white rounded-lg hover:shadow-md transition-shadow">
            <label className="font-bold text-xl flex items-center space-x-2">
              <input type="radio" onChange={handleAccountType} name="accountType" value="business" checked={accountType === 'business'} className="form-radio text-blue-600" />
              <span>Business</span>
            </label>
            <p className="mt-2">Create an account to manage your business transactions. Make invoices to send to your clients. Manage all your business accounts and transactions.</p>
          </div>
          <button type="submit" className="w-full bg-green-700 text-white rounded-lg py-3 hover:bg-green-800 transition-colors">
            Proceed
          </button>
        </form>
      </div>
    </section>
  );
}

export default AccountType;
