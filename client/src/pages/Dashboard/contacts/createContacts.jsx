import { Modal, ModalBody, ModalContent, ModalOverlay,ModalHeader, useDisclosure } from '@chakra-ui/react'
import React from 'react'

function CreateContacts({handleSubmit, handleChange, isLoading}) {
  const {onOpen, isOpen, onClose}= useDisclosure()
  return (
    <div>
      <button onClick={onOpen}>Add Contacts</button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay/>
        <ModalContent>
        <ModalHeader className='text-center text-pink-600 font-bold text-2xl'>Create Contacts</ModalHeader>
            <ModalBody>
            <form onSubmit={handleSubmit}>
      <div className='flex flex-col p-4'>
  <label className='text-xl font-bold'>Name <span className='text-rose-600'>*</span></label>
  <input type="text" onChange={handleChange} name="name" placeholder='john doe' required className='p-2 bg-stone-300'/>
</div>
<div className='flex flex-col p-4'>
  <label  className='text-xl font-bold'>Phone Number <span className='text-rose-600'>*</span></label>
  <input type="number" onChange={handleChange} name="phone" placeholder='Phone number' className='p-2 bg-stone-300' required/>
</div>
<div className='flex flex-col p-4'>
  <label className='text-xl font-bold'>Email</label>
  <input type="email" onChange={handleChange}  name="email" placeholder='Email adress' className='p-2 bg-stone-300' required/>
</div>
<div className='flex flex-col p-4'>
  <label className='text-xl font-bold'>Account Number</label>
  <input type="number" onChange={handleChange}  name="account" placeholder='Account number' className='p-2 bg-stone-300' required/>
</div>
<button className='w-full bg-stone-950 rounded-md text-white items-center py-3'>{isLoading?'Adding....':'Add Contact'}</button>
            </form>

            </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CreateContacts
