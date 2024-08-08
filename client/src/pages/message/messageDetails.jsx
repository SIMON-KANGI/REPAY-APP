import { useState, useEffect } from 'react';
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
        message_id: message.id,
    });

    // Handle real-time replies using WebSocket
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
    }, [dispatch, message.id]);

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
        <div className="flex overflow-hidden">
            <SideBar />
            <div className="w-full relative">
                <TopNav />
                <div className="w-full bg-stone-300 shadow-md flex items-center p-4">
                    <img src={message.profile} alt="user" className="rounded-full w-16 h-16" />
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
