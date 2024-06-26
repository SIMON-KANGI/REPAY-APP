import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';

function UpdateInvoice({ invoice, onClose, isOpen, handleUpdate, handleChange }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(invoice);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className='text-center text-pink-600 font-bold text-2xl'>Update Invoice</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col p-4'>
              <label htmlFor="status" className='py-2'>Status</label>
              <select id="status" className='py-2' value={invoice.status} onChange={handleChange}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <button type="submit" style={{ backgroundColor: "midnightblue" }} className='w-full text-white px-2 py-2 rounded-md'>Update</button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default UpdateInvoice;
