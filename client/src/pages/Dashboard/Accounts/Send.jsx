import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent, Tooltip, ModalFooter, ModalCloseButton, useDisclosure, ModalOverlay } from '@chakra-ui/react';

function Send() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [values, setValues] = useState([]);
    const [formData, setFormData] = useState({
        account_name: '',
        amount: '',
        account: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues([...values, formData]);
        onClose(); // Close the modal after submitting
    };

    return (
        <div className="flex justify-center items-center h-full">
            <Tooltip label="Send Money" aria-label="Send Money Tooltip">
                <button onClick={onOpen} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300">
                    Send Money
                </button>
            </Tooltip>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody className="p-6">
                        <h2 className="text-center text-2xl font-bold mb-4">Send Money</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium" htmlFor="account_name">Account Name</label>
                                <select name="account_name" className="p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.account_name}>
                                    <option value=''>Select Account</option>
                                    <option value="KCB">KCB</option>
                                    <option value="Equity">Equity</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium" htmlFor="amount">Amount</label>
                                <input type="text" name="amount" placeholder="Enter Amount" className="p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.amount} />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium" htmlFor="account">Account Number</label>
                                <input type="number" name="account" placeholder="Enter Phone Number/account" className="p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.account} />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium" htmlFor="password">Password</label>
                                <input type="password" name="password" placeholder="Enter your password" className="p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.password} />
                            </div>
                            <ModalFooter className="flex w-full justify-around p-4">
                                <button type="submit" className="px-4 py-2 mx-4 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors duration-300">
                                    Send
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
