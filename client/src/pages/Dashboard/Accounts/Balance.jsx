import React, { useEffect, useState } from 'react';
import { Modal, ModalCloseButton, ModalBody, ModalContent, ModalOverlay, ModalHeader, useDisclosure, useToast } from '@chakra-ui/react';
import { selectUserData } from '../../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEye } from "react-icons/fa";

function Balance() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUserData);
  const toast = useToast();
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    user_id: user?.id
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.post('http://127.0.0.1:5555/checkbalance', formData)
      .then(res => {
        const message=res.data
        onClose();
        toast({
          title: 'Message sent',
          position: "top-right",
          status: "success",
          isClosable: true,
        });
      })
      .catch(err => {
        console.error(err);
        toast({
          title: "Error checking balance",
          position: "top-right",
          status: "error",
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:5555/account/accounts')
      .then(res => setAccounts(res.data))
      .catch(err => {
        console.error(err);
        toast({
          title: "Error fetching accounts",
          position: "top-right",
          status: "error",
          isClosable: true,
        });
      });
  }, [toast]);

  const filteredAccounts = accounts.filter(account => account.user_id === user?.id);

  return (
    <div>
      <button onClick={onOpen} className='text-center flex items-center w-full px-3 py-3 shadow-md text-white'>
        <FaEye />
        Check Balance
      </button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Check Balance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className='text-center'>
              <form onSubmit={handleSubmit}>
                <div className='flex flex-col'>
                  <label className='font-bold'>Account to check balance</label>
                  <select className="p-2" onChange={handleChange} name="account" required>
                    <option value=''>Select Account</option>
                    {filteredAccounts.map(account => (
                      <option key={account.id} value={account.category}>{account.category}</option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col my-4 rounded-md'>
                  <label className='font-bold'>Password</label>
                  <input type='password' name='password' onChange={handleChange} className='border border-gray-900' required />
                </div>
                <div className='flex justify-center my-4'>
                  <button type='submit' className='bg-black rounded-full text-slate-200 px-6 py-2' disabled={isLoading}>
                    {isLoading ? 'Checking...' : 'Check Balance'}
                  </button>
                </div>
              </form>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Balance;
