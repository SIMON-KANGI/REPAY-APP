import React, { useState } from 'react';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { FcMenu } from 'react-icons/fc';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdDashboard, MdAccountBalanceWallet, MdSendToMobile, MdOutlineAccountTree, MdContacts, MdAccountTree } from 'react-icons/md';
import { IoIosArrowDown, IoIosNotifications } from 'react-icons/io';
import { PiHandWithdrawFill } from 'react-icons/pi';
import { FaBalanceScale, FaHome, FaEdit } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { IoMdSettings } from 'react-icons/io';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { selectUserData } from '../../features/auth/Authslice';
import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import LogOut from '../authentication/LogOut';
import Send from './Accounts/Send';
import Withdraw from './Accounts/Withdraw';
import EditUser from '../Details/EditUser';
import Balance from './Accounts/Balance';
import useFetch from '../../hooks/UseFetch';


function SideBar() {
  const user = useSelector(selectUserData);
  const [isCollapsed, setCollapsed] = useState(false);
  const {data:invoices}= useFetch('https://repay-app.onrender.com/invoices')
  const {data:notifications}= useFetch('https://repay-app.onrender.com/notifications')
  const {data:contacts}= useFetch('https://repay-app.onrender.com/contacts')
  const {data:products}= useFetch('https://repay-app.onrender.com/products')
  const handleCollapsed = () => {
    setCollapsed(!isCollapsed);
  };
  const filteredNotifications = notifications?.filter(notification => notification.user_id === user.id);
  const filteredContacts = contacts?.filter(contact => contact.user_id === user.id);
  const filteredInvoices = invoices?.filter(invoice => invoice.user_id === user.id);
  const filteredProducts = products?.filter(product => product.user_id === user.id);
  return (
    <div className={`transition-width duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-80'} border-x  text-white bg-stone-800 border-gray-500 h-screen`}>
      <header className='h-40 p-4'>
        <div className='flex w-full justify-between'>
          <h1 className={`text-2xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>REPAY</h1>
          <FcMenu onClick={handleCollapsed} className='text-xl cursor-pointer' />
        </div>
        <div className='flex items-center mt-4'>
          <div className={`w-20 h-20 border-4 border-stone-300 rounded-full overflow-hidden ${isCollapsed ? 'hidden' : 'block'}`}>
            <img src={user.profile} alt={user.username} className='w-full h-full object-cover' />
          </div>
          {!isCollapsed && (
            <div className='ml-4'>
              <h1>Welcome</h1>
              <h1 className='font-bold text-xl'>{user.username}</h1>
            </div>
          )}
        </div>
      </header>
      <section className='bg-stone-600 py-4'>
        <div className='mt-3 ml-3'>
          <Link className='text-xl flex items-center mb-3 font-bold' to="/my-dashboard">
            <MdDashboard className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
          </Link>
        </div>
        <Accordion allowMultiple className='mt-3 border-stone-500'>
          <AccordionItem className='mt-4'>
            <h2>
              <AccordionButton className='flex items-center justify-between p-3 text-stone-50 rounded-md'>
                <Box className='flex text-xl items-center font-bold'>
                  <MdAccountBalanceWallet className='mr-2' />
                  <span className={`${isCollapsed ? 'hidden' : 'block'}`}>My Account</span>
                </Box>
                {!isCollapsed && <IoIosArrowDown />}
              </AccordionButton>
            </h2>
            <AccordionPanel className={`text-stone-50 p-4 ${isCollapsed ? 'hidden' : 'block'}`}>
             
              
            <Withdraw/>
             <Balance/>
             
              <Link to='/accounts' className='flex items-center w-full shadow-md px-3 py-4 hover:bg-stone-300'>
                <MdOutlineAccountTree className='mr-2' />
                <span>Accounts</span>
              </Link>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem className='mt-4'>
            <h2>
              <AccordionButton className='flex items-center justify-between p-3 text-stone-50 rounded-md'>
                <Box className='flex text-xl items-center font-bold'>
                  <MdAccountBalanceWallet className='mr-2' />
                  <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Transactions</span>
                </Box>
                {!isCollapsed && <IoIosArrowDown />}
              </AccordionButton>
            </h2>
            <AccordionPanel className={`text-stone-50 p-4 ${isCollapsed ? 'hidden' : 'block'}`}>
              <Link to="/my-transactions" className='flex items-center px-3 py-3 w-full shadow-md hover:bg-stone-300 mb-2'>
                <MdSendToMobile className='mr-2' />
                <span>My Transactions</span>
              </Link>
              
              <Send/>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem className='mt-4'>
            <h2>
              <AccordionButton className='flex items-center justify-between p-3 text-stone-50 rounded-md'>
                <Box className='flex text-xl items-center font-bold'>
                  <ImProfile className='mr-2' />
                  <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Profile</span>
                </Box>
                {!isCollapsed && <IoIosArrowDown />}
              </AccordionButton>
            </h2>
            <AccordionPanel className={`text-stone-50 p-4 ${isCollapsed ? 'hidden' : 'block'}`}>
              <Link to={`/user/${user.username}`} className='flex items-center w-full shadow-md px-3 py-3 hover:bg-stone-300 mb-2'>
                <ImProfile className='mr-2' />
                <span>My Profile</span>
              </Link>
              <div className='flex items-center w-full hover:bg-stone-300 mb-2'>
                <FaEdit className='mr-2' />
               <EditUser/>
              </div>
              <Link to="/settings" className='flex items-center w-full p-3 shadow-md hover:bg-stone-300'>
                <IoMdSettings className='mr-2' />
                <span>Settings</span>
              </Link>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <div className='mt-4 ml-3'>
          <Link to="/contacts" className='text-xl flex items-center mb-3 font-bold'>
            <MdContacts className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Contacts</span>
            <span className='rounded-full text-md text-center w-6 h-6 items-center bg-orange-600 mx-8'>{filteredContacts?.length}</span>
          </Link>
        </div>
        <div className='mt-4 ml-3'>
          <Link to="/invoices" className='text-xl flex justify-between items-center mb-3 font-bold'>
          <div className='flex items-center'>
            <LiaFileInvoiceSolid className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
            
            Invoices
           
            </span> 
          </div>
            
            <span className='rounded-full text-center text-sm w-6 h-6 items-center bg-orange-600 mx-8'>{filteredInvoices?.length}</span>
          </Link>
        </div>
        <div className='mt-4 ml-3'>
          <Link to="/notifications" className='text-xl flex items-center mb-3 font-bold'>
            <IoIosNotifications className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
            
            Notifications</span>
            <span className='rounded-full text-center text-sm w-6 h-6 items-center bg-orange-600 mx-8'>{filteredNotifications?.length}</span>
          </Link>
        </div>
        <div className='mt-4 ml-3'>
          <Link to="/my-products" className='text-xl flex items-center mb-3 font-bold'>
            <MdOutlineProductionQuantityLimits className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
            
            Products</span>
            <span className='rounded-full text-sm text-center w-6 h-6 items-center bg-orange-600 mx-8'>{filteredProducts?.length}</span>
          </Link>
        </div>
        <div className='mt-4 ml-3'>
          <Link to="/" className='text-xl flex items-center mb-3 font-bold'>
            <FaHome className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Landing Page</span>
          </Link>
        </div>
      </section>

      <section className={`${isCollapsed ? 'hidden' : 'block'}`}>
        <div className='text-center text-2xl font-bold text-rose-600 mt-4'>
          <LogOut />
        </div>
      </section>
    </div>
  );
}

export default SideBar;
