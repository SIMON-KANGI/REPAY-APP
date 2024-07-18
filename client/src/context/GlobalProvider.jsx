import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromStorage, selectCurrentToken, setCredentials } from '../features/auth/Authslice';
import axios from 'axios';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          dispatch(setCredentials({ accessToken: storedToken }));
        }

        const res = await axios.get('https://repay-app.onrender.com/user/token', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        const data=res.data
        if (data === storedToken) {
          dispatch(setCredentials({ accessToken: access_token, username:data.username, role:role, user: data.content }));
          setLoggedIn(true);
          setUserData(data.content);
        } else {
          setLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setLoggedIn,
        userData,
        setUserData,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
