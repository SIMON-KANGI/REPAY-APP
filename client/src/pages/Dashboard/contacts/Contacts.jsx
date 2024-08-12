import React,{useCallback, useEffect,useState} from 'react'
import CreateContacts from './createContacts'

import TopNav from '../TopNav'
import SideBar from '../SideBar'
import axios from 'axios'
import { selectUserData } from '../../../features/auth/Authslice'
import { addContacts } from '../../../features/contacts/contactSlice';
import { useSelector } from'react-redux'
import ContactList from './ContactList'
import { useToast } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
function Contacts() {
  const user=useSelector(selectUserData)
  const dispatch = useDispatch();
  const toast=useToast()
  const [formData, setFormData]= useState(
    {
      name:'',
      phone:'',
      email:'',
      account:'',
      user_id:user?.id
    }
  )
  const [loading, setLoading] = useState(false);

  
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
        const res = await axios.post('http://127.0.0.1:5555/contacts', formData);

        if (res.status === 200) {
            dispatch(addContacts(res.data));
            setLoading(false);
            toast({
                title: "Contact list updated",
                position: 'top-center',
                status: 'success',
                isClosable: true,
            });
        } 
    } catch (e) {
        console.error(e);
        setLoading(false);
        toast({
            title: "Error occurred",
            position: 'top-center',
            status: 'error',
            isClosable: true,
        });
    }
}, [formData, dispatch, toast]);


  return (
    <div className='flex'>
    <SideBar/>
    <section className='w-full'>
      <TopNav/>
      <CreateContacts handleSubmit={handleSubmit} handleChange={handleChange} isLoading={loading}/>
      <h1 className='text-center text-3xl text-green-400 font-bold'>My Contacts</h1>
  <ContactList/>
      </section>
     
      
    </div>
  )
}

export default Contacts
