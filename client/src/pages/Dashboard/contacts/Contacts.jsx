import React,{useCallback, useEffect,useState} from 'react'
import CreateContacts from './createContacts'

import TopNav from '../TopNav'
import SideBar from '../SideBar'
import axios from 'axios'
import { selectUserData } from '../../../features/auth/Authslice'
import { useSelector } from'react-redux'
import ContactList from './ContactList'
import { useToast } from '@chakra-ui/react'
function Contacts() {
  const user=useSelector(selectUserData)
  const toast=useToast()
  const [formData, setFormData]= useState(
    {
      name:'',
      phone:'',
      email:'',
      account:'',
      user_id:user.id
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
  const handleSubmit=useCallback((event)=>{
event.preventDefault();
    setLoading(true);
    try{
          axios.post('https://repay-app.onrender.com/contacts', formData)
          .then(res=>{
            console.log(res.data);
            setLoading(false);
            toast({
              title:"Contact list updated",
              position: 'top-center',
              status:'success',
              isClosable: true,

            })
          })
    }catch(e){
      console.error(e);
      setLoading(false);
      toast({
        title:"Error occured",
        position: 'top-center',
        status:'error',
        isClosable: true,

      })
      
    }


  }, [formData])

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
