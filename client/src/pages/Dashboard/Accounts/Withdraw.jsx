import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent, Tooltip, ModalFooter, ModalCloseButton, useDisclosure, ModalOverlay } from '@chakra-ui/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../../features/auth/Authslice';
import useFetch from '../../../hooks/UseFetch';
import { PiHandWithdrawFill } from "react-icons/pi";
function Withdraw() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [values, setValues] = useState([]);
  const { data: accounts, loading: accountsLoading, error: accountsError } = useFetch('https://repay-app.onrender.com/accounts');
  const user = useSelector(selectUserData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Fromaccount_name: '',
    amount: '',
    Toaccount_name: '',
    password: '',
    transaction_type: 'withdrawal',
    sender_id: user?.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.Fromaccount_name !== formData.Toaccount_name) {
      try {
        const response = await axios.post('https://repay-app.onrender.com/withdrawal', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Response:', response.data);
        setValues([...values, formData]);
        setFormData({
          Fromaccount_name: '',
          amount: '',
          Toaccount_name: '',
          password: '',
          transaction_type: 'withdrawal',
          sender_id: user?.id,
        });
        onClose();
      } catch (err) {
        setError('Transaction failed. Please try again.');
        console.error('Error:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError('You cannot withdraw money to the same account');
      setLoading(false);
    }
    console.log(formData);
  };

  const filterAccount = accounts?.filter((account) => account.user_id === user?.id);

  return (
    <div className="flex justify-center items-center h-full">
      <Tooltip label="Withdraw Money" aria-label="withdraw Tooltip">
        <button
          onClick={onOpen}
          className="px-4 py-2  text-white rounded-md shadow-md flex items-center w-full my-4 transition-colors duration-300"
        >
        <PiHandWithdrawFill/>
          Withdraw
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody className="p-6">
            <h2 className="text-center text-2xl font-bold mb-4">Withdraw Money</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="mb-2 font-medium" htmlFor="Fromaccount_name">
                  From Account
                </label>
                <select
                  name="Fromaccount_name"
                  className="p-2 border border-gray-300 rounded-md"
                  onChange={handleChange}
                  value={formData.Fromaccount_name}
                  required
                >
                  <option value="">Select Account</option>
                  {filterAccount?.map((account) => (
                    <option key={account.id} value={account.category}>
                      {account.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium" htmlFor="amount">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  className="p-2 border border-gray-300 rounded-md"
                  onChange={handleChange}
                  value={formData.amount}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium" htmlFor="Toaccount_name">
                  To Account
                </label>
                <select
                  name="Toaccount_name"
                  className="p-2 border border-gray-300 rounded-md"
                  onChange={handleChange}
                  value={formData.Toaccount_name}
                  required
                >
                  <option value="">Select Account</option>
                  {filterAccount?.map((account) => (
                    <option key={account.id} value={account.category}>
                      {account.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="p-2 border border-gray-300 rounded-md"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>
              <ModalFooter className="flex w-full justify-around p-4">
                <button
                  type="submit"
                  className={`px-4 py-2 mx-4 ${loading ? 'bg-gray-400' : 'bg-green-500'} text-white rounded-md shadow-md hover:${loading ? 'bg-gray-400' : 'bg-green-600'} transition-colors duration-300`}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Withdraw;
