import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import io from 'socket.io-client';
import { useToast } from '@chakra-ui/react';
import { IoSend } from "react-icons/io5";
import SideBar from '../Dashboard/SideBar';
import TopNav from '../Dashboard/TopNav';
import { selectUserData, selectCurrentToken } from '../../features/auth/Authslice';
import { addReply, fetchMessages } from '../../features/messages/messageSlice';
import MessageList from './messageList';

// Adjust the port as necessary for your backend
const socket = io('http://127.0.0.1:5555');

function MessageDetails() {
    const currMessage = useLocation();
    const user = useSelector(selectUserData);
    const token = useSelector(selectCurrentToken);
    const toast = useToast();
    const dispatch = useDispatch();
    
    const message = currMessage.state?.message;
    
    const [replies, setReplies] = useState(message?.replies || []);
    const [formData, setFormData] = useState({
        body: '',
        senderId: user?.id,
        ownerId: message?.senderId,
        message_id: message?.id,
    });

    const messagesEndRef = useRef(null);

    // real-time replies using WebSocket
    useEffect(() => {
        socket.on('receive_reply', (newReply) => {
            if (newReply.message_id === message.id) {
                dispatch(addReply({ messageId: message.id, reply: newReply }));
                setReplies(prevReplies => [...prevReplies, newReply]);
            }
        });

        return () => {
            socket.off('receive_reply');
        };
    }, [dispatch, message?.id]);

    // Scroll to the bottom when replies change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [replies]);

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
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.status === 200 || 201) {
                setFormData({
                    body: '',
                    senderId: user?.id,
                    ownerId: message?.senderId,
                    message_id: message.id,
                });

                // Dispatch the new reply to Redux
                dispatch(addReply({ messageId: message.id, reply: res.data }));
                
                // Optionally refetch all messages to ensure state consistency
                dispatch(fetchMessages());

                // Emit the reply to the server via WebSocket
                socket.emit('send_reply', res.data);

                // Show success toast
                toast({
                    title: "Message sent",
                    position: 'top-center',
                    status: 'success',
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error sending reply', error);
            toast({
                title: "Error sending message",
                position: 'top-center',
                status: 'error',
                isClosable: true,
            });
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
        <div className="flex h-screen">
            <SideBar />
            <div className="w-full flex flex-col">
                <TopNav />
                <section className="flex h-full container">
                   
                    <div className="w-full flex flex-col">
                        <div className="bg-stone-600 shadow-md flex items-center p-4">
                            <img src={message.profile} alt="user" className="rounded-full w-16 h-16" />
                            <div className="ml-4">
                                <h1 className="text-lg text-white font-bold">
                                    {user.username === message.receiverName ? message.senderName : message.receiverName}
                                </h1>
                                <p className="text-sm text-stone-300">{message.date}</p>
                            </div>
                        </div>
                        <section className="flex flex-col justify-between p-4 flex-1 overflow-y-auto">
                            <div>
                                <div className={`my-4 px-3 flex text-white py-2 w-fit ${message.senderId === user.id ? 'bg-emerald-600 rounded-md px-3 ml-auto' : 'bg-stone-600 rounded-full'}`}>
                                    <p>{message.body}</p>
                                    <p className='float-end text-gray-300 text-sm px-2 mt-2'>{message.time}</p>
                                </div>
                                <div className="mt-4">
                                    {replies?.map(reply => (
                                        <div
                                            key={reply.id}
                                            className={`my-4 px-3 rounded-md text-white py-2 w-fit flex ${reply.senderId === user.id ? 'bg-emerald-600 px-3 ml-auto' : 'bg-stone-600'}`}
                                        >
                                            <p>{reply.body}</p>
                                            <p className='float-end text-gray-300 text-sm px-2 mt-2'>{reply.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSubmit} className="bg-stone-600 sticky z-10 bottom-0 p-2 mt-auto">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        name="body"
                                        placeholder="Type your reply..."
                                        className="border-2 border-gray-900 text-slate-100 rounded-lg p-3 w-3/4"
                                        onChange={handleChange}
                                        value={formData.body}
                                    />
                                    {formData.body && (
                                        <button type="submit" className="p-3 ml-2">
                                            <IoSend fontSize={'2rem'} color='white' />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </section>    
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MessageDetails;
