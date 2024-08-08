import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMessages, addMessage } from '../../features/messages/messageSlice';
import io from 'socket.io-client';
import { selectUserData } from '../../features/auth/Authslice';

const socket = io('http://127.0.0.1:5555');

function MessageList() {
    const dispatch = useDispatch();
    const user = useSelector(selectUserData);
    const messages = useSelector(state => state.message?.messages || []);
    const messageStatus = useSelector(state => state.message?.status);
    const error = useSelector(state => state.message?.error);

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
        <div className='m-6'>
            {filteredMessages?.length > 0 ? (
                filteredMessages?.map(message => (
                    <Link to={`/messages/${message.id}`} state={{ message }} key={message.id}>
                        <div className="p-4 bg-slate-500 text-white m-3 rounded-md">
                            <h1 className='text-xl'>{message.receiverName || 'Receiver Name'}</h1>
                            <p>{message.body}</p>
                        </div>
                    </Link>
                ))
            ) : (
                <p className='text-center text-gray-600'>No messages available</p>
            )}
        </div>
    );
}

export default MessageList;
