import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '../features/auth/Authslice';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const userData = useSelector(selectUserData);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (userData) {
        setLoggedIn(true);
        setUserData(userData);
      } else {
        setLoggedIn(false);
        setUserData(null);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userData]); // Dependency array includes userData to update when it changes

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        setLoggedIn,
        setUserData,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
