import React, { useEffect } from 'react';
import { Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react';
import { selectUserData } from '../../features/auth/Authslice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContacts, selectContacts } from '../../features/contacts/contactSlice';
import { Link } from 'react-router-dom';

function ContactListMessage() {
    const { onClose, isOpen, onOpen } = useDisclosure();
    const dispatch = useDispatch();
    const user = useSelector(selectUserData);
    const contacts = useSelector(selectContacts); // Fetching contacts from Redux store

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    const filterContacts = contacts?.filter(contact => contact.user_id === user?.id);

    return (
        <div>
            <button onClick={onOpen} className='bg-gradient-to-r from-green-700 to-green-500 text-white flex items-center font-bold float-end rounded-md px-6 m-6 py-3'>Start a Chat</button> 
            <Drawer isOpen={isOpen} onClose={onClose} placement='left' size={'xs'}>
                <DrawerContent>
                    <DrawerHeader className='text-center text-2xl'>New Chat</DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody className='bg-stone-950 overflow-y-auto'>
                        <h1 className='text-center text-emerald-500 text-2xl'>MY CONTACTS</h1>
                        {filterContacts?.length > 0 ? (
                            filterContacts.map(contact => (
                                <Link key={contact.id} to={`/chat/${contact.id}`}>
                                    <div className='flex border-b border-stone-600 w-full p-3 items-center'>
                                        <img src={contact.profile} alt={contact.name} className='w-12 h-12 mx-2 rounded-full' />
                                        <div>
                                            <h1 className='font-bold text-lg text-slate-100'>{contact.name}</h1>
                                            <p className='text-stone-300'>{contact.phone}</p>
                                        </div>
                                    </div>   
                                </Link>
                            ))
                        ) : (
                            <p className='text-center text-stone-300'>No contacts available</p>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default ContactListMessage;
