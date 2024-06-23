import {
    DrawerContent, DrawerOverlay, Drawer, DrawerBody, DrawerFooter, DrawerHeader, useDisclosure,
    Button, Input, FormLabel, FormControl
  } from '@chakra-ui/react';
  import React, { useState } from 'react';
  import { selectUserData } from '../../features/auth/Authslice';
  import { useSelector } from 'react-redux';
  import axios from 'axios';
  
  function CreateInvoice() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [file, setFile] = useState(null);
    const user = useSelector(selectUserData);
    const [formData, setFormData] = useState({
      customer_email: '',
      customer_phone: '',
      account: '',
      file: null,
      user_id: user.id
    });
  
    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFormData({ ...formData, file: selectedFile });
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const submissionData = new FormData();
        submissionData.append('customer_email', formData.customer_email);
        submissionData.append('customer_phone', formData.customer_phone);
        submissionData.append('account', formData.account);
        submissionData.append('file', formData.file);
        submissionData.append('user_id', formData.user_id);
  
        const response = await axios.post('http://127.0.0.1:5555/invoices', submissionData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        console.log(response.data);
        onClose();
        alert('Invoice created successfully');
      } catch (e) {
        console.log(e);
        alert('An error occurred while creating the invoice');
      }
    };
  
    return (
      <div>
        <Button onClick={onOpen}>Create an Invoice</Button>
        <Drawer isOpen={isOpen} onClose={onClose} size={'xl'}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader className='text-center text-2xl'>Create Invoice</DrawerHeader>
            <DrawerBody>
              <form onSubmit={handleSubmit}>
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
  