import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, Tooltip, ModalFooter, ModalCloseButton, useDisclosure, ModalOverlay } from '@chakra-ui/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../../features/auth/Authslice';
import useFetch from '../../../hooks/UseFetch';
import { IoIosSend } from "react-icons/io";
function Send() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [values, setValues] = useState([]);
    const { data: accounts, loading, error } = useFetch('http://127.0.0.1:5555/accounts');
   
    const user = useSelector(selectUserData);
    const [formData, setFormData] = useState({
        account_name: '',
        amount: '',
        account: '',
        password: '',
        transaction_type: 'sent',
        sender_id: user.id,
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
        loading
        error
    
        try {
            const response = await axios.post('http://127.0.0.1:5555/transactions', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', response.data);
            setValues([...values, formData]);
            setFormData({
                account_name: '',
                amount: '',
                account: '',
                password: '',
                transaction_type: 'sent',
                sender_id: user.id,
            });
            onClose();
        } catch (err) {
            error('Transaction failed. Please try again.');
            console.error('Error:', err.response ? err.response.data : err.message);
        } finally {
           loading;
        }
    };
    

  

    const filterAccount = accounts?.filter(account => account.user_id === user.id);

    return (
        <div className="flex justify-center items-center h-full">
            <Tooltip label="Send Money" aria-label="Send Money Tooltip">
                <button onClick={onOpen} className="px-4 py-2  text-white rounded-md shadow-md flex items-center w-full transition-colors duration-300">
                <IoIosSend/>
                    Send Money
                </button>
            </Tooltip>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody className="p-6">
                        <h2 className="text-center text-2xl font-bold mb-4">Send Money</h2>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium" htmlFor="account_name">Account Name</label>
                                <select name="account_name" className="p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.account_name} required>
                                    <option value=''>Select Account</option>
                                    {filterAccount?.map(account => (
                                        <option key={account.id} value={account.category}>{account.category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium" htmlFor="amount">Amount</label>
                                <input type="number" name="amount" placeholder="Enter Amount" className="p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.amount} required />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium" htmlFor="account">Account Number</label>
                                <input type="text" name="account" placeholder="Enter Phone Number/account" className="p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.account} required />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium" htmlFor="password">Password</label>
                                <input type="password" name="password" placeholder="Enter your password" className="p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.password} required />
                            </div>
                            <ModalFooter className="flex w-full justify-around p-4">
                                <button type="submit" className={`px-4 py-2 mx-4 ${loading ? 'bg-gray-400' : 'bg-green-500'} text-white rounded-md shadow-md hover:${loading ? 'bg-gray-400' : 'bg-green-600'} transition-colors duration-300`} disabled={loading}>
                                    {loading ? 'Sending...' : 'Send'}
                                </button>
                                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition-colors duration-300">
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

export default Send;
