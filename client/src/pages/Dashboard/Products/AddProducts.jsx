import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../../features/auth/Authslice';
import axios from 'axios';
import ProductsList from './productsList';
function AddProducts({handleChange, handleFileChange, handleSubmit, formData, file, onClose, onOpen, isOpen}) {
    
    const user = useSelector(selectUserData);
   
    return (
        <div>
            <button onClick={onOpen} style={{ backgroundColor: 'midnightblue' }}  className='bg-gradient-to-r from-sky-800 to-blue-500 text-white flex items-center font-bold float-end rounded-md px-6 m-6 py-3'>Add Products</button>
            <Modal isOpen={isOpen} onClose={onClose} size={'lg'} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Products</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col my-2'>
                                <label className='font-bold'>Product Name</label>
                                <input type="text" name='name' onChange={handleChange} value={formData.name} placeholder='Product Name' className='p-2 rounded-md bg-stone-300' required />
                            </div>
                            <div className='flex flex-col my-2'>
                                <label className='font-bold'>Product Category</label>
                                <input type="text" name='category' onChange={handleChange} value={formData.category} placeholder='Product Category' className='p-2 rounded-md bg-stone-300' required />
                            </div>
                            <div className='flex flex-col my-2'>
                                <label className='font-bold'>Product Price</label>
                                <input type="number" name='price' onChange={handleChange} value={formData.price} placeholder='Product Price' className='p-2 rounded-md bg-stone-300' required />
                            </div>
                            <div className='flex flex-col my-2'>
                                <label className='font-bold'>Stock amount</label>
                                <input type="number" name='stock' onChange={handleChange} value={formData.stock} placeholder='Product stock' className='p-2 rounded-md bg-stone-300' required />
                            </div>
                            <div className='flex flex-col my-2'>
                                <label className='font-bold'>Description</label>
                                <textarea type="text" name='description' onChange={handleChange} value={formData.description} placeholder='Product Description' className='p-2 rounded-md bg-stone-300' required />
                            </div>
                            <div className="flex p-4 border-dotted border-2 relative rounded-md border-stone-800 my-3 justify-center items-center h-40 w-40 overflow-hidden">
                                <label className="drop-area cursor-pointer w-full h-full flex justify-center items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                        required
                                    />
                                    {!file && (
                                        <p className="w-fit flex p-2">
                                            <FaImage size={30} />
                                        </p>
                                    )}
                                    {file && file.type.startsWith("image/") && (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover rounded-md"
                                        />
                                    )}
                                </label>
                            </div>
                            <button style={{ backgroundColor: 'midnightblue' }} className='w-full text-white rounded-md my-3 py-3'>Add</button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default AddProducts;
