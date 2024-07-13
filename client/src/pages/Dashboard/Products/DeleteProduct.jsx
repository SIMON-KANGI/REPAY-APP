import { Modal, ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,Button } from '@chakra-ui/react'
import React from 'react'
import { MdDelete } from "react-icons/md";
function DeleteProduct({handleDelete, product}) {
  const { onClose, onOpen, isOpen } = useDisclosure();
  // function DeleteProduct(){
  //   handleDelete(product.id)
  //   onClose()  
  // }
  return (
    <div>
    <button onClick={onOpen} className="items-center flex font-bold justify-center" >
   <MdDelete/>
    Delete</button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this product?
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="solid" colorScheme="red">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default DeleteProduct
