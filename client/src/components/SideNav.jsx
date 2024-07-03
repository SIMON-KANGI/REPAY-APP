import { DrawerBody, DrawerContent,Drawer,useDisclosure, DrawerOverlay, DrawerCloseButton } from '@chakra-ui/react'
import React from 'react'
import { CgHome } from 'react-icons/cg';
import { HiMenuAlt3 } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { IoIosHome } from "react-icons/io";
import { BsPersonWorkspace } from "react-icons/bs";
import { IoLogIn } from "react-icons/io5";
import { SiGnuprivacyguard } from "react-icons/si";
import { IoMdClose } from "react-icons/io";
function SideNav() {
    const {isOpen, onOpen, onClose}=useDisclosure()
  return (
    <div>
    <button className='mx-4' onClick={onOpen}>
      <HiMenuAlt3 fontSize={'2rem'} color="white"/>
    </button>
      <Drawer isOpen={isOpen} onClose={onClose} size={"md"} className="bg-stone-900">
      <DrawerOverlay/>
      <DrawerContent backgroundColor={'stone.900'} className='py-6'>
      {/* <DrawerCloseButton color="stone.200" className='flex-start' fontSize={'1.3rem'}/> */}
      <button onClick={onClose} className='flex-start text-3xl px-4 text-stone-200 '>
        <IoMdClose/>
      </button>
         <DrawerBody>
<div className='my-6'>
<Link to="/" className='flex text-2xl text-white'>
<IoIosHome/>
  <span className='mx-4'>Home</span>
</Link>
</div>
<div className='my-6 border-t p-2 border-stone-600'>
<Link to="/how-it-works" className='flex text-2xl text-white '>
<BsPersonWorkspace/>
  <span className='mx-4'>How it works</span>
</Link>
</div>
<div className='border-t p-2 border-stone-600'>
<Link to="/login" className='flex text-2xl text-white'>
<IoLogIn/>
  <span className='mx-4'>Login</span>
</Link>
</div>
<div className='my-6 border-t p-2 border-stone-600'>
<Link to="/account" className='flex text-2xl text-white'>
<SiGnuprivacyguard/>
  <span className='mx-4'>Register</span>
</Link>
</div>
        </DrawerBody>
      </DrawerContent>
       
      </Drawer>
    </div>
  )
}

export default SideNav
