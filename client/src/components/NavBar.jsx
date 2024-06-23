import React from 'react'
import { Link } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'
import useAuth from '../hooks/UseAuth'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button
  } from '@chakra-ui/react'
import LogOut from '../pages/authentication/LogOut'
import { MdDashboard } from "react-icons/md";
function NavBar() {
  const isAuthenticated = useAuth(['admin', 'user']);
  return (
    <header className='w-screen bg-stone-950 flex py-10 shadow-md  justify-around items-center'>
    <h1 className='text-lime-700 text-3xl font-bold'>RE<span className='text-rose-600'>PAY</span></h1>
    <nav className='text-white'>
<ul className='text-black'>
    <Link className='px-4 text-stone-200 font-bold text-xl' to="/">Home</Link>
    <Link className='px-4 text-stone-200 font-bold text-xl' to="/how-it-works">How it Works</Link>
    <Menu>
  <MenuButton as={Button} rightIcon={<FaChevronDown />}>
    Account
  </MenuButton>
  <MenuList>
    <MenuItem>
    {!isAuthenticated &&<Link to="/login">Login</Link>}
    </MenuItem>
    <MenuItem>
    {!isAuthenticated &&<Link to="/account">Register</Link>}
    
    </MenuItem>
   <MenuItem>
   {isAuthenticated &&<LogOut/>}
    
   </MenuItem>
   {isAuthenticated &&<MenuItem>
    <Link to="my-dashboard" className='flex items-center font-bold text-xl'>
    <MdDashboard/>
    My Dashboard</Link>
   </MenuItem>}
  </MenuList>
   
</Menu>
</ul>
    </nav>
      
    </header>
  )
}

export default NavBar
