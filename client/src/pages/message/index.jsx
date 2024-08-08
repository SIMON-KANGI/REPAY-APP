import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SideBar from '../Dashboard/SideBar';
import TopNav from '../Dashboard/TopNav';
import CreateMessage from './createMessage';
import { selectCurrentToken, selectUserData } from '../../features/auth/Authslice';
import { useToast } from '@chakra-ui/react';
import MessageList from './messageList';

function Messages() {
    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectUserData);
    const toast = useToast();
    const [formData, setFormData] = useState({
        contact: '',
        message: '',
        user_id:user?.id,
       
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:5555/chat/messages', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                toast({
                    title: res.data,
                    position: 'top-center',
                    status:'success',
                    isClosable: true,
                })
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex">
            <SideBar />
            <section className="w-full">
                <TopNav />
                <h1 className="text-center text-2xl font-bold">My Inbox</h1>
                <div className='flex flex-col'>
                   <CreateMessage
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    formData={formData}
                />  
                </div>
               
                <MessageList/>
            </section>
        </div>
    );
}

export default Messages;
