import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React from 'react'

function CreateContacts() {
  const {onOpen, isOpen, onClose}= useDisclosure()
  return (
    <div>
      <button onClick={onClose}>Add Contacts</button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
        <ModalTitle>Create Contacts</ModalTitle>
            <ModalBody>

            </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CreateContacts
