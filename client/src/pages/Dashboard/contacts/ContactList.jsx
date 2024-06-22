import React, { useEffect, useState, useCallback } from 'react';
import { selectUserData } from '../../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaChevronDown } from 'react-icons/fa';
import { Menu, MenuButton, MenuItem, MenuList, Button } from '@chakra-ui/react';
import SendMoney from './SendMoney';
import { useDisclosure } from '@chakra-ui/react';
import useFetch from '../../../hooks/UseFetch';
function ContactList() {
  const { data:contacts, loading, error } = useFetch('http://127.0.0.1:5555/contacts');
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [selectedContact, setSelectedContact] = useState(null);
  const user = useSelector(selectUserData);

 

  const handleClick = useCallback((contact) => {
    setSelectedContact(contact);
    onOpen();
  }, [onOpen]);

  const filteredContacts = contacts?.filter(contact => contact.user_id === user.id);

  return (
    <div className='justify-center items-center'>
      <table className='m-8'>
        <thead className='border-2 border-gray-900'>
          <tr className='border-2 border-gray-900'>
            <th className='border-2 border-gray-900'>Name</th>
            <th className='border-2 border-gray-900'>Phone</th>
            <th className='border-2 border-gray-900'>Email</th>
            <th className='border-2 border-gray-900'>Account Number</th>
          </tr>
        </thead>
        <tbody className='border-2 border-gray-900'>
          {filteredContacts?.map(contact => (
            <tr key={contact.id} className='border-2 border-gray-900'>
              <td className='border-2 border-gray-900 p-4'>{contact.name}</td>
              <td className='border-2 border-gray-900'>{contact.phone}</td>
              <td className='border-2 border-gray-900'>{contact.email}</td>
              <td className='border-2 border-gray-900'>{contact.account}</td>
              <td className='border-2 border-gray-900'>
                <button onClick={() => handleClick(contact)} className='py-3 px-8 bg-green-800 text-white'>
                  Send Money
                </button>
              </td>
              <td className='border-2 border-gray-900'>
                <Menu>
                  <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                    Options
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      Message
                    </MenuItem>
                    <MenuItem>
                      Block
                    </MenuItem>
                    <MenuItem>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedContact && (
        <SendMoney
          onOpen={onOpen}
          isOpen={isOpen}
          onClose={onClose}
          contact={selectedContact}
        />
      )}
    </div>
  );
}

export default ContactList;
