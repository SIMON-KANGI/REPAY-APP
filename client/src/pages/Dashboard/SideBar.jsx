import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { FcMenu } from 'react-icons/fc';
import { selectUserData } from '../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdDashboard, MdAccountBalanceWallet } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
import { MdSendToMobile } from "react-icons/md";
import { PiHandWithdrawFill } from "react-icons/pi";
import { FaBalanceScale, FaHome } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { FaEdit } from "react-icons/fa";
import { IoMdSettings, IoIosNotifications } from "react-icons/io";
import { MdOutlineAccountTree } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { MdContacts } from "react-icons/md";
import LogOut from '../authentication/LogOut';
import Send from './Accounts/Send';

function SideBar() {
  const user = useSelector(selectUserData);
  const [isCollapsed, setCollapsed] = useState(false);

  const handleCollapsed = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <div className={`transition-width duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-80'} border-x text-white bg-stone-800 border-gray-500 h-screen`}>
      <header className='h-40 p-4'>
        <div className='flex w-full justify-between'>
          <h1 className={`text-2xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>REPAY</h1>
          <FcMenu onClick={handleCollapsed} className='text-xl' />
        </div>
        <div className='flex items-center mt-4'>
          <div className='w-20 h-20 border-4 border-stone-300 rounded-full overflow-hidden'>
            <img src={user.profile} alt={user.username} className={`w-full h-full object-cover ${isCollapsed ? 'hidden' : 'block'}`} />
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
              {/* <Link className='flex hover:bg-stone-300 mb-2'>
                <MdSendToMobile className='mr-2' />
                <span>Send Money</span>
              </Link> */}
              <Send/>
              <Link className='flex hover:bg-stone-300 mb-2'>
                <PiHandWithdrawFill className='mr-2' />
                <span>Withdraw</span>
              </Link>
              <Link className='flex hover:bg-stone-300 mb-2'>
                <FaBalanceScale className='mr-2' />
                <span>Account Balance</span>
              </Link>
              <Link className='flex hover:bg-stone-300'>
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
              <Link className='flex hover:bg-stone-300 mb-2'>
                <MdSendToMobile className='mr-2' />
                <span>My Transactions</span>
              </Link>
              <Link className='flex hover:bg-stone-300 mb-2'>
                <PiHandWithdrawFill className='mr-2' />
                <span>Received</span>
              </Link>
              <Link className='flex hover:bg-stone-300'>
                <FaBalanceScale className='mr-2' />
                <span>Account Balance</span>
              </Link>
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
              <Link className='flex hover:bg-stone-300 mb-2'>
                <MdSendToMobile className='mr-2' />
                <span>My Profile</span>
              </Link>
              <Link className='flex hover:bg-stone-300 mb-2'>
                <FaEdit className='mr-2' />
                <span>Edit Profile</span>
              </Link>
              <Link className='flex hover:bg-stone-300'>
                <IoMdSettings className='mr-2' />
                <span>Settings</span>
              </Link>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <div className='mt-4 ml-3'>
          <Link className='text-xl flex items-center mb-3 font-bold' to="contacts">
            <MdContacts className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Contacts</span>
          </Link>
        </div>
        <div className='mt-4 ml-3'>
          <Link className='text-xl flex items-center mb-3 font-bold' to="invoices">
            <LiaFileInvoiceSolid className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Invoices</span>
          </Link>
        </div>
        <div className='mt-4 ml-3'>
          <Link className='text-xl flex items-center mb-3 font-bold' to="notifications">
            <IoIosNotifications className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Notifications</span>
          </Link>
        </div>
        <div className='mt-4 ml-3'>
          <Link className='text-xl flex items-center mb-3 font-bold' to="/">
            <FaHome className='mr-2' />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Landing Page</span>
          </Link>
        </div>

      </section>
      
       <section className={`${isCollapsed ? 'hidden' : 'block'}`}>
        <h1 className='text-center text-2xl font-bold text-rose-600'>{user.account_type} Account</h1>
       </section>
     
    </div>
  );
}

export default SideBar;
