import { Modal, ModalCloseButton, ModalContent,ModalHeader, ModalBody, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { addMessage } from '../../features/messages/messageSlice'
function CreateMessage({handleChange, handleSubmit, formData}) {
    const {onClose, isOpen, onOpen} = useDisclosure()
  return (
    <div>
     <button onClick={onOpen} className='bg-gradient-to-r from-green-700 to-green-500 text-white flex items-center font-bold float-end rounded-md px-6 m-6 py-3'>Start a Chat</button> 
     <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start a Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
            <div className='flex flex-col'>
            <label>Contact</label>
             <input type="number" name='contact' onChange={handleChange} value={formData.contact} placeholder="contact" className='p-2 border-2 rounded-md'/>    
            </div>
           <div className='flex flex-col'>
           <label>Message</label>
              <textarea type='text' name="message" onChange={handleChange} value={formData.message} placeholder='Enter your message' className='border-2 rounded-md p-4'/>
           </div>
           
              <button type='submit' onClick={onClose} className='w-full py-3 justify-center rounded-md text-white text-xl items-center bg-green-700 my-3'>Send</button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CreateMessage
