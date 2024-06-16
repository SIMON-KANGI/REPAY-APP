import React, { useEffect, useState } from 'react';
import { Modal, ModalCloseButton, ModalBody, ModalContent, ModalOverlay, ModalHeader, useDisclosure } from '@chakra-ui/react';
import { selectUserData } from '../../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Balance() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accounts, setAccounts] = useState([]);
  const user = useSelector(selectUserData);
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    user_id: user.id
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios.post('http://127.0.0.1:5555/checkbalance', formData)
      .then(res => {
        console.log(res.data);
        onClose();
      })
      .catch(err => {
        console.error(err);
      });
  }

  useEffect(() => {
    axios.get('http://127.0.0.1:5555/accounts')
      .then(res => setAccounts(res.data))
      .catch(err => console.error(err));
  }, []);

  const FilterAccount = accounts.filter(account => account.user_id === user.id);

  return (
    <div>
      <button onClick={onOpen} className='text-center bg-orange-700 text-white'>Check Balance</button>
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
                  <select className="p-2" onChange={handleChange} name="account">
                    <option>Select Account</option>
                    {FilterAccount.map(account => (
                      <option key={account.id} value={account.category}>{account.category}</option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col my-4 rounded-md'>
                  <label className='font-bold'>Password</label>
                  <input type='password' name='password' onChange={handleChange} className='border border-gray-900' />
                </div>
                <div className='flex justify-center my-4'>
                  <button type='submit' className='bg-black rounded-full text-slate-200 px-6 py-2'>Check Balance</button>
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
