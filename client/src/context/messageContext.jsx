import { createContext, useContext, useEffect, useCallback, useState } from "react";
import { useSelector } from 'react-redux';
import { selectUserData } from "../features/auth/Authslice";
import useFetch from "../hooks/UseFetch";
import io from 'socket.io-client';

const MessageContext = createContext();
const socket = io('http://127.0.0.1:5555'); // Adjust the URL as needed

export const useMessage = () => useContext(MessageContext);

function MessageProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const user = useSelector(selectUserData);
    const { data: allMessages, isLoading, isError } = useFetch('http://127.0.0.1:5555/chat/messages');

    useEffect(() => {
        if (allMessages) {
            const filteredMessages = allMessages?.filter(message => {
                const userMessages = message.senderId === user?.id;
                const receivedMessages = message.ownerId === user?.id;
                return userMessages || receivedMessages;
            });
            setMessages(filteredMessages);
        }
    }, [allMessages, user]);

    useEffect(() => {
        socket.on('receive_message', (newMessage) => {
            setMessages(prevMessages => {
                // Update or add new message to the list
                const updatedMessages = [...prevMessages.filter(msg => msg.id !== newMessage.id), newMessage];
                return updatedMessages;
            });
        });

        socket.on('receive_reply', (newReply) => {
            setMessages(prevMessages => {
                // Find the message that the reply is for and update it
                const updatedMessages = prevMessages.map(msg => 
                    msg.id === newReply.message_id ? { ...msg, replies: [...(msg.replies || []), newReply] } : msg
                );
                return updatedMessages;
            });
        });

        return () => {
            socket.off('receive_message');
            socket.off('receive_reply');
        };
    }, []);

    const handleMessage = useCallback((newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setTimeout(() => {
            setMessages(prevMessages => prevMessages.filter(msg => msg !== newMessage));
        }, 3000);
    }, []);

    return (
        <MessageContext.Provider value={{ messages, handleMessage }}>
            {children}
        </MessageContext.Provider>
    );
}

export default MessageProvider;
