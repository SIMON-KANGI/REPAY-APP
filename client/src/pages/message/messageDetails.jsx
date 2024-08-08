import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../Dashboard/SideBar';
import TopNav from '../Dashboard/TopNav';
import { IoSend } from "react-icons/io5";
import { selectUserData, selectCurrentToken } from '../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import io from 'socket.io-client';
import { useMessage } from '../../context/messageContext';
import { useToast } from '@chakra-ui/react';
const socket = io('http://127.0.0.1:5555'); // Adjust the port as necessary

function MessageDetails() {
    const currMessage = useLocation();
    const user = useSelector(selectUserData);
    const token = useSelector(selectCurrentToken);
    const toast= useToast()
    const message = currMessage.state?.message;
    const { handleMessage } = useMessage(); // Get handleMessage from context
    const [replies, setReplies] = useState(message?.replies || []);
    const [formData, setFormData] = useState({
        body: '',
        senderId: user?.id,
        ownerId: message?.senderId,
        message_id: message.id
    });

    useEffect(() => {
        // Listen for new messages and replies
        socket.on('receive_message', (newMessage) => {
            if (newMessage.id === message.id) {
                setReplies(prevReplies => [...prevReplies, newMessage]);
            }
        });

        socket.on('receive_reply', (newReply) => {
            if (newReply.message_id === message.id) {
                setReplies(prevReplies => [...prevReplies, newReply]);
            }
        });

        return () => {
            socket.off('receive_message');
            socket.off('receive_reply');
        };
    }, [message.id]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:5555/chat/replies', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 200 || 201) {
                // Reset the form data
                setFormData({
                    body: '',
                    senderId: user?.id,
                    ownerId: message?.senderId,
                    message_id: message.id
                });
                // Emit the new reply to the server
                socket.emit('send_reply', res.data);
                // Update context with the new reply
                handleMessage(res.data);
                toast({
                    title: "Message sent",
                    position: 'top-center',
                    status:'success',
                    isClosable: true,
                })
            }
        } catch (error) {
            console.error('Error sending reply', error);
        }
    }

    if (!message) {
        return (
            <div className="flex">
                <SideBar />
                <div className="w-full">
                    <TopNav />
                    <h1 className="text-center text-2xl text-rose-600">Message error</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex overflow-hidden">
            <SideBar />
            <div className="w-full relative">
                <TopNav /> 
                <div className="w-full bg-stone-300 shadow-md flex items-center p-4">
                    <img src={message.profile} alt="user" className='rounded-full w-16 h-16' />
                    <div className="ml-4">
                        <h1 className="text-lg font-bold">{message.senderName}</h1>
                        <p className="text-sm">{message.date}</p>
                    </div>
                </div>
                <section className="flex justify-center items-center h-screen">
                    <div className="align-middle p-4 shadow-md w-full h-full relative">
                        <div className={`my-4 px-3 py-2 w-3/4 ${message.senderId === user.id ? 'bg-emerald-300 text-black rounded-full px-3 ml-auto' : 'bg-white rounded-full'}`}>
                            <p>{message.body}</p>
                        </div>
                        <div className="mt-4">
                            {replies.map(reply => (
                                <div 
                                    key={reply.id} 
                                    className={`my-4 px-3 py-2 w-3/4 ${reply.senderId === user.id ? 'bg-emerald-300 text-black rounded-full px-3 ml-auto' : 'bg-white rounded-full'}`}
                                >
                                    <p>{reply.body}</p>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit} className="absolute bottom-16 w-full p-4">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="body"
                                    placeholder="Type your reply..."
                                    className="border-2 border-gray-900 rounded-md p-3 w-full mt-2"
                                    onChange={handleChange}
                                    value={formData.body}
                                />
                                <button type="submit" className="p-3 ml-2">
                                    <IoSend fontSize={'2rem'} />
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MessageDetails;
