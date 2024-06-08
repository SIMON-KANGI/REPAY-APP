import React from 'react'
import { Link } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'
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

function NavBar() {
  return (
    <header className='w-screen flex py-4 shadow-md justify-around items-center'>
    <h1 className='text-lime-700 text-3xl font-bold'>RE<span className='text-rose-600'>PAY</span></h1>
    <nav>
<ul>
    <Link className='px-4' to="/">Home</Link>
    <Link className='px-4' to="/about">About</Link>
    <Menu>
  <MenuButton as={Button} rightIcon={<FaChevronDown />}>
    Account
  </MenuButton>
  <MenuList>
    <MenuItem>
    <Link to="/login">Login</Link></MenuItem>
    <MenuItem>
    <Link to="/account">SignUp</Link>
    </MenuItem>
   
  </MenuList>
</Menu>
</ul>
    </nav>
      
    </header>
  )
}

export default NavBar
