import { Modal, ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton} from '@chakra-ui/react'
import React from 'react'
import { useLocation } from 'react-router-dom'

function UpdateInvoice({invoice,onClose,isOpen}) {
   
   
  return (
    <div>
 <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay/>
    <ModalContent>
        <ModalHeader className='text-center text-pink-600 font-bold text-2xl'>Update Invoice</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
            <form>
      <div className='flex flex-col p-4'>
<select className='py-2'>
<option value="">{invoice.status}</option>
    <option value="Paid">Paid</option>
    <option value="Pending">Pending</option>
</select>
      </div>
      <button style={{backgroundColor:"midnightblue"}} className='w-full text-white px-2 py-2 rounded-md'>Update</button>
      </form>
      </ModalBody>
    </ModalContent>
 </Modal>
   
    </div>
  )
}

export default UpdateInvoice
