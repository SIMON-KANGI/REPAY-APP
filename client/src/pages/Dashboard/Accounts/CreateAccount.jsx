import React from 'react'
import { Modal, ModalBody, ModalContent, Tooltip, ModalFooter, ModalCloseButton, useDisclosure, ModalOverlay, ModalHeader } from '@chakra-ui/react';
function CreateAccount() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const[categories, setCategories]=useState([])

  useEffect(()=>{
    function getCategories(){
      axios.get('http://127.0.0.1:5555/categories')
     .then(res=>{
      setCategories(res.data)
     } )}
     getCategories()
  },[])
  return (
    <div>
      <button>Create Account</button>
      <Modal>
        <ModalOverlay/>
        <ModalCloseButton/>
        <ModalHeader>Create a Funds Account</ModalHeader>
        <ModalBody>
<form>
  <select name="category">
  <option value="">Select Bank</option>
  {categories.map(category=>{
    return <option value={category.id}>{category.name}</option>
  })}

  </select>
  <div>
  <label>Account Number</label>
     <input type="number" name="accountNumber" placeholder="Account Number"/>
  </div>
 
</form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default CreateAccount
