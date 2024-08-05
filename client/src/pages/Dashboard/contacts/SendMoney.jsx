import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useToast } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../../features/auth/Authslice';
import axios from 'axios';
import useFetch from '../../../hooks/UseFetch';
function SendMoney({ onClose, isOpen, contact }) {
  const user = useSelector(selectUserData);
const toast=useToast()
  const { data: accounts, loading, error } = useFetch('http://127.0.0.1:5555/account/accounts');
  const [formData, setFormData] = useState({
    account_name:'',
    amount: '',
    password: '',
    user_id: user.id,
    account: contact.account,
    transaction_type:'sent'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loading;
    !error;

    try {
      const response = await axios.post('http://127.0.0.1:5555/transaction/transactions', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
     
      setFormData({
        account_name:"",
        amount: '',
        password: '',
        user_id: user.id,
        account: contact.account,
        transaction_type:'sent'
      });
      if(response.ok){
        toast({
          title: `Transaction  Successfull`,
          position: "top-center",
          status: "info",
          isClosable: true,
        });
      }
      onClose();
    } catch (err) {
      toast({
        title: `transaction failed`,
        position: "top-center",
        status: "error",
        isClosable: true,
      });
      error
      console.error('Error:', err.response ? err.response.data : err.message);
    } finally {
     !loading;
    }
    
  };

  const filteredAccounts = accounts?.filter(account => account.user_id === user.id);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClick={onClose} />
          <ModalHeader className='text-center text-xl'>Send Money to {contact?.name}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-4">
                <label className="mb-2 font-medium" htmlFor="account_name">Account Name</label>
                <select
                  name="account_name"
                  className="p-2 border border-gray-300 rounded-md"
                  onChange={handleChange}
                  value={formData.account_name}
                  required
                >
                  <option value=''>Select Account</option>
                  {filteredAccounts?.map(account => (
                    <option key={account.id} value={account.category}>{account.category}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='amount' className='text-xl font-bold'>Amount</label>
                <input
                  type='number'
                  name='amount'
                  className='p-2 bg-stone-300'
                  id='amount'
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='password' className='text-xl font-bold'>Password</label>
                <input
                  type='password'
                  name='password'
                  className='p-2 bg-stone-300'
                  id='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <div className='text-red-500'>{error}</div>}
              <button type='submit' className='w-full my-6 bg-stone-950 rounded-md text-white items-center py-3' disabled={loading}>
                {loading ? 'Sending...' : 'Send Money'}
              </button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default SendMoney;
