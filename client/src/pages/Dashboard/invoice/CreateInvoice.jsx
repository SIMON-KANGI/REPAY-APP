import {
    DrawerContent, DrawerOverlay, Drawer, DrawerBody, DrawerFooter, DrawerHeader, useDisclosure,
    Button, Input, FormLabel, FormControl,
    Select
  } from '@chakra-ui/react';
  import React, { useState } from 'react';
  import { selectUserData } from '../../../features/auth/Authslice';
  import { useSelector } from 'react-redux';
  import axios from 'axios';
  import { IoIosCreate } from "react-icons/io";
  import { useToast } from '@chakra-ui/react';
  function CreateInvoice() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [file, setFile] = useState(null);
    const user = useSelector(selectUserData);
    const toast=useToast()
    const [formData, setFormData] = useState({
      name:'',
      customer_email: '',
      customer_phone: '',
      account: '',
      amount:'',
      status:'',
      file: null,
      user_id: user.id
    });
  
    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFormData({  ...formData, file: selectedFile });
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({...formData, [name]: value  });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('customer_email', formData.customer_email);
        submissionData.append('customer_phone', formData.customer_phone);
        submissionData.append('account', formData.account);
        submissionData.append('amount', formData.amount);
        submissionData.append('status', formData.status);
        submissionData.append('file', formData.file);
        submissionData.append('user_id', formData.user_id);
  
        const response = await axios.post('https://repay-app.onrender.com/invoices', submissionData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        console.log(response.data);
        onClose();
        toast({
          title: 'Invoice created successfully',
          position: "top-right",
          status: "success",
          isClosable: true,
        });
      } catch (e) {
        console.log(e);
        alert('An error occurred while creating the invoice');
      }
    };
  
    return (
      <div>
        <button onClick={onOpen} className='bg-gradient-to-r from-green-700 to-green-500 text-white flex items-center font-bold float-end rounded-md px-6 m-6 py-3'>
        <IoIosCreate/>
        Create</button>
        <Drawer isOpen={isOpen} onClose={onClose} size={'lg'}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader className='text-center text-2xl'>Create Invoice</DrawerHeader>
            <DrawerBody>
              <form onSubmit={handleSubmit}>
              <FormControl className='flex flex-col mb-4'>
                  <FormLabel className="font-bold">Customer Name</FormLabel>
                  <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Customer Name' className='w-full p-2 border-2 rounded-md' required />
                </FormControl>
                <FormControl className='flex flex-col mb-4'>
                  <FormLabel className="font-bold">Customer Email</FormLabel>
                  <Input type="email" name="customer_email" value={formData.customer_email} onChange={handleChange} placeholder='Customer Email' className='w-full p-2 border-2 rounded-md' required />
                </FormControl>
                <FormControl className='flex flex-col mb-4'>
                  <FormLabel className="font-bold">Customer Phone</FormLabel>
                  <Input type="text" name="customer_phone" value={formData.customer_phone} onChange={handleChange} placeholder='Customer Phone' className='w-full p-2 border-2 rounded-md' required />
                </FormControl>
                <FormControl className='flex flex-col mb-4'>
                  <FormLabel className="font-bold">Account</FormLabel>
                  <Input type="number" name="account" value={formData.account} onChange={handleChange} placeholder='Account' className='w-full p-2 border-2 rounded-md' required />
                </FormControl>
                <FormControl className='flex flex-col mb-4'>
                  <FormLabel className="font-bold">Amount</FormLabel>
                  <Input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder='Amount' className='w-full p-2 border-2 rounded-md' required />
                </FormControl>
                <FormControl className='flex flex-col mb-4'>
                  <FormLabel className="font-bold">Account</FormLabel>
                  <Select onChange={handleChange} name="status" value={formData.status}>
                    <option value="">status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      
                   
                  </Select>
                </FormControl>
                <FormControl className='mb-4'>
                  <FormLabel className="font-bold">Upload File</FormLabel>
                  <Input type='file' accept='application/pdf' onChange={handleFileChange} name="file" className='w-full' required />
                  {!file && (
                    <p className='text-red-500'>Upload a PDF</p>
                  )}
                  {file && !file.type.endsWith('/pdf') && (
                    <p className='text-red-500'>Please upload a valid PDF file</p>
                  )}
                </FormControl>
                <Button type="submit" colorScheme="blue" disabled={!file || !file.type.endsWith('/pdf')}>Submit</Button>
              </form>
            </DrawerBody>
            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>Cancel</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }
  
  export default CreateInvoice;
  