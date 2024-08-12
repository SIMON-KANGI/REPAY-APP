import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMessages, addMessage } from '../../features/messages/messageSlice';
import io from 'socket.io-client';
import { selectUserData } from '../../features/auth/Authslice';
import { selectCurrentMessages,selectCurrentStatus, selectMessagesState } from '../../features/messages/messageSlice';
import useFetch from '../../hooks/UseFetch';
const socket = io('http://127.0.0.1:5555');

function MessageList() {
    const dispatch = useDispatch();
    const user = useSelector(selectUserData);
    const messages = useSelector(selectCurrentMessages);
    const messageStatus = useSelector(selectCurrentStatus);

   
    const {data:users}= useFetch(`http://127.0.0.1:5555/user/users`)
    const error = useSelector(state => state.message?.error);
    console.log("message state", messages)
    useEffect(() => {
        const pollMessages = () => {
            dispatch(fetchMessages());
        };

        // Initial fetch
        pollMessages();

        // Poll every 10 seconds
        const intervalId = setInterval(pollMessages, 10000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [dispatch]);

    useEffect(() => {
        socket.on('receive_message', (newMessage) => {
            dispatch(addMessage(newMessage));
        });

        return () => {
            socket.off('receive_message');
        };
    }, [dispatch]);

    if (messageStatus === 'loading') return <div>Loading...</div>;
    if (messageStatus === 'failed') return <div>Error: {error}</div>;

    const filteredMessages = messages?.filter(message => {
        const userMessages = message.senderId === user?.id;
        const receivedMessages = message.ownerId === user?.id;
        return userMessages || receivedMessages;
    });
    return (
        <div className='my-6 border shadow-md w-full h-full'>
        <h1 className='text-center text-2xl font-bold text-emerald-700'>My Chats</h1>
            {filteredMessages?.length > 0 ? (
                filteredMessages.map(message => {
                     return (
                        <Link to={`/messages/${message.id}`} state={{ message }} key={message.id}>
                            <div className="p-4 border-b w-full border-stone-600 flex items-center  text-stone-950 m-3 rounded-md">
                            <img src={message.profile} className="rounded-full w-16 h-16" />
                            <div className='p-3'> 
                            <h1 className='text-xl font-bold'>{message.senderId === user.id ? message.receiverName : message.senderName}</h1>
                                <p>{message.body}</p></div>
                               
                            </div>
                        </Link>
                    );
                })
            ) : (
                <p className='text-center text-gray-600'>No messages available</p>
            )}
        </div>
    );
}

export default MessageList;
