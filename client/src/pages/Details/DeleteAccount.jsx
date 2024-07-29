import { Modal, ModalOverlay, ModalBody, ModalContent, ModalHeader, ModalFooter, useToast } from '@chakra-ui/react'
import {useState} from 'react'
import { useDisclosure } from '@chakra-ui/react';
import { selectUserData, setCredentials } from '../../features/auth/Authslice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function DeleteAccount() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast= useToast()
    const [loading, setLoading]= useState(false)
    const user = useSelector(selectUserData);
    const navigate= useNavigate()
    const dispatch=useDispatch()
    function handleDelete(id){
      try{
         const response=axios.delete(`https://repay-app.onrender.com/users/${user.id}`)
        if(response.ok){
          toast({
            title: 'Account deleted successfully',
            position: 'top-center',
            status:'success',
            isClosable: true,
          })
          setLoading(false);
          navigate('/')
          onClose()
          dispatch(setCredentials({ accessToken:null, username:null, role:null, user:null }));
            }
        setLoading(true);
      }catch(error){
        console.error(error)
        toast({
          title: 'Error occurred while deleting account',
          position: 'top-center',
          status:'error',
          isClosable: true,
        })
        setLoading(false);
        onClose()
        dispatch(setCredentials({ accessToken:null, username:null, role:null, user:null }));
      }
       
    }
    setTimeout(()=>{
        onClose()
        handleDelete(user.id)  // replace user.id with the actual user id to delete it.
    }, 10000)
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
            <button onClick={()=>handleDelete(user.id)} className='bg-rose-900 text-white rounded-md px-8 py-3'>
            {loading?'Deleting account...':'Delete'}
            </button> 
          </ModalFooter>
         
        </ModalContent>
      </Modal>
    </div>
  )
}

export default DeleteAccount
