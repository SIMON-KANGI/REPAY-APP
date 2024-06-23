import React from 'react';
import useFetch from '../../hooks/UseFetch';
import { CardBody, Card, CardHeader, Tooltip } from '@chakra-ui/react';
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { selectUserData } from '../../features/auth/Authslice';
import { useSelector } from'react-redux';
function NotificationList() {
  const { data: notifications, loading, error, reFetch } = useFetch('http://127.0.0.1:5555/notifications');
const user=useSelector(selectUserData)
  function handleDelete(id) {
    axios.delete(`http://127.0.0.1:5555/notifications/${id}`)
      .then(() => {
        reFetch(); // Refresh the notifications list after deletion
      })
      .catch(err => {
        console.error('Error deleting notification:', err);
      });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
const filterNotifications=notifications.filter(notification=>notification.user_id===user.id)
  return (
    <div className='overflow-y-scroll'>
      {filterNotifications?.map(notification => (
        <Card key={notification.id}  className='shadow-md my-4'>
          <CardHeader className='font-bold text-xl text-rose-800'>{notification.sender}</CardHeader>
          <CardBody>
            <div className='justify-between flex'>
              <p className='text-green-800 font-bold'>{notification.message}</p>
              <Tooltip label="delete">
                <button onClick={() => handleDelete(notification.id)}>
                  <MdDelete fontSize={'1.5rem'} />
                </button>
              </Tooltip>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default NotificationList;
