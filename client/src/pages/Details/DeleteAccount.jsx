import { Modal, ModalOverlay, ModalBody, ModalContent, ModalHeader, ModalFooter } from '@chakra-ui/react'
import React from 'react'
import { useDisclosure } from '@chakra-ui/react';
import { selectUserData } from '../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import axios from 'axios';
function DeleteAccount() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useSelector(selectUserData);
    function handleDelete(id){
        const response=axios.delete(`https://repay-app.onrender.com/users/${user.id}`)
        if(response.ok){
          console.log('user deleted successfully')
        
            }
        console.log("user not delete")
    }
    setTimeout(()=>{
        onClose()
        handleDelete(user.id)  // replace user.id with the actual user id to delete it.
    }, 5000)
  return (
    <div>
    <button onClick={onOpen} className='p-3 w-full shadow-md items-center bg-red-800 font-bold text-slate-200'>Delete account</button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalBody>Are you sure you want to delete your account? This action cannot be undone and all data will be lost!!</ModalBody>
          <ModalFooter className='flex justify-between w-full'>
            <button onClick={onClose} className='bg-stone-900 mx-32 rounded-md  text-white px-8 py-3'>Cancel</button>
            <button onClick={()=>handleDelete(user.id)} className='bg-rose-900 text-white rounded-md px-8 py-3'>Delete</button> 
          </ModalFooter>
         
        </ModalContent>
      </Modal>
    </div>
  )
}

export default DeleteAccount
