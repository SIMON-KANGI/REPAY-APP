import { DrawerBody, DrawerContent,Drawer,useDisclosure, DrawerOverlay, DrawerCloseButton } from '@chakra-ui/react'
import React from 'react'
import { CgHome } from 'react-icons/cg';
import { HiMenuAlt3 } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { IoIosHome } from "react-icons/io";
import { BsPersonWorkspace } from "react-icons/bs";
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
      <DrawerCloseButton/>
         <DrawerBody>
<div>
<Link to="/" className='flex text-2xl text-white justify-center'>
<IoIosHome/>
  <span className='mx-4'>Home</span>
</Link>
</div>
<div>
<Link to="/how-it-works" className='flex text-2xl text-white justify-center'>
<BsPersonWorkspace/>
  <span className='mx-4'>How it works</span>
</Link>
</div>
        </DrawerBody>
      </DrawerContent>
       
      </Drawer>
    </div>
  )
}

export default SideNav
