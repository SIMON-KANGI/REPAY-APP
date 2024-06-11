import { Tooltip } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { IoNotifications } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { selectUserData } from '../../features/auth/Authslice';
import { useSelector } from 'react-redux';

function TopNav() {
    const user = useSelector(selectUserData);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, []);

    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className='w-full flex justify-between items-center h-fit p-4 bg-stone-200 shadow-md'>
            <h1 className='text-xl text-emerald-900 font-bold'>{user.account_type} Account</h1>
            <h1 className='text-xl text-stone-950 font-bold'>{formatTime(currentTime)}</h1>
            <nav className='text-right mx-4'>
                <ul>
                    <div className='flex items-center'>
                        <Tooltip label='messages'>
                            <Link to="/notifications">
                                <IoNotifications fontSize={'1.5rem'} />
                            </Link>
                        </Tooltip>
                        <div className='w-10 h-10 border-4 mx-4 border-stone-300 rounded-full overflow-hidden'>
                            <img src={user.profile} alt={user.username} className='rounded-full w-10 h-10' />
                        </div>
                        <h1 className='text-xl font-bold'>{user.username}</h1>
                    </div>
                </ul>
            </nav>
        </div>
    );
}

export default TopNav;
