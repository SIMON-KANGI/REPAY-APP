import { useState } from 'react';
import { Modal, ModalBody, ModalContent, Tooltip, ModalFooter, ModalCloseButton, useDisclosure, ModalOverlay, ModalHeader } from '@chakra-ui/react';
import { selectUserData } from '../../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { IoMdAdd } from "react-icons/io";
import useFetch from '../../../hooks/UseFetch';

function CreateAccount() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector(selectUserData);
  const { data: categories, loading, error } = useFetch('http://127.0.0.1:5555/categories');
  const [formData, setFormData] = useState({
    category: '',
    accountNumber: '',
    password: '',
    user_id: user.id
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios.post('http://127.0.0.1:5555/accounts', formData)
      .then(res => {
        console.log(res.data);
        onClose();
      })
      .catch(err => console.error(err));
    console.log(formData);
  }

  return (
    <div>
      <button onClick={onOpen} className='py-3 m-4 flex font-bold border border-stone-900 items-center float-end px-8 rounded-md text-stone-900'>
        <IoMdAdd />
        Create Account
      </button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Create a Funds Account</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='flex flex-col'>
                <label className="mb-2 font-medium">Account Category</label>
                <select onChange={handleChange} value={formData.category} className="p-2 border border-gray-300 rounded-md" name="category">
                  <option value="">Select Bank</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium">Account Number</label>
                <input type="number" onChange={handleChange} value={formData.accountNumber} name="accountNumber" className="p-2 border border-gray-300 rounded-md" placeholder="Account Number" />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium">Account Password</label>
                <input type="password" onChange={handleChange} name="password" value={formData.password} className="p-2 border border-gray-300 rounded-md" placeholder="Account Password" />
              </div>
              <div>
                <button type="submit" className="p-2 mt-3 w-full bg-green-900 text-white rounded-md shadow-md hover:bg-green-600 transition-colors duration-300">
                  Create Account
                </button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CreateAccount;
