import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  FormControl,
  FormLabel
} from '@chakra-ui/react';

function UpdateStock({ handleChange, handleUpdate, stock, product }) {
  const { onClose, onOpen, isOpen } = useDisclosure();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate({ ...product, stock: stock.stock });
    onClose();
  };

  return (
    <div>
      <Button onClick={onOpen}>Update Stock</Button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Stock</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Stock:</FormLabel>
                <Input
                  type="number"
                  onChange={handleChange}
                  name="stock"
                  value={stock.stock}
                  required
                />
              </FormControl>
              <Button type="submit" mt={4} colorScheme="blue">
                Update
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default UpdateStock;
