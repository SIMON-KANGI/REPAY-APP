import React from 'react';
import { selectUserData } from '../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMessage } from '../../context/messageContext';

function MessageList() {
  const user = useSelector(selectUserData);
  const { messages } = useMessage();

  return (
    <div className='m-6'>
      {messages.length > 0 ? (
        messages.map(message => (
          <Link to={`/messages/${message.id}`} state={{ message }} key={message.id}>
            <div className="p-4 bg-slate-500 text-white m-3 rounded-md">
              <h1 className='text-xl'>{message.receiver || 'Receiver Name'}</h1>
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
