import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import SideBar from '../Dashboard/SideBar';
import TopNav from '../Dashboard/TopNav';
import CreateMessage from './createMessage';
import { selectCurrentToken, selectUserData } from '../../features/auth/Authslice';
import { useToast } from '@chakra-ui/react';
import MessageList from './messageList';
import { addMessage, fetchMessages } from '../../features/messages/messageSlice';
import io from 'socket.io-client';
import MessageDetails from './messageDetails';
import ContactListMessage from './contactList';

const socket = io('http://127.0.0.1:5555');
function Messages() {
    
    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectUserData);
    const dispatch = useDispatch();
    const toast = useToast();
    const [formData, setFormData] = useState({
        contact: '',
        message: '',
        user_id: user?.id,
    });
    useEffect(() => {
        socket.on('receive_message', (newMessage) => {
            dispatch(addMessage(newMessage));
        });
    
        return () => {
            socket.off('receive_message');
        };
    }, [dispatch]);
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:5555/chat/messages', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 200) {
                dispatch(addMessage(res.data));
                dispatch(fetchMessages())
                socket.emit('send_message', res.data);  // Emit the message event
                toast({
                    title: "Message sent",
                    position: 'top-center',
                    status: 'success',
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: "Error sending message",
                description: error.message,
                position: 'top-center',
                status: 'error',
                isClosable: true,
            });
        }
    }
    

    return (
        <div className="flex overflow-hidden">
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
                <ContactListMessage/>
                </div>
                <h1 className='text-center text-2xl font-bold text-emerald-700'>Recent conversations</h1>
                <MessageList/>
                
                
            </section>
        </div>
    );
}

export default Messages;
