import React, { useMemo } from 'react';
import useFetch from '../hooks/UseFetch';
import { selectUserData } from '../features/auth/Authslice';
import { useSelector } from 'react-redux';

const CalculateBalance = () => {
  const user = useSelector(selectUserData);

  // Fetch accounts data
  const { data: accounts, loading, error } = useFetch('http://127.0.0.1:5555/account/accounts');

  // Filter accounts based on the current user's ID
  const filteredAccounts = useMemo(() => {
    if (accounts && user?.id) {
      return accounts.filter(account => account.user_id === user.id);
    }
    return [];
  }, [accounts, user]);

  // Calculate the total balance and format it with commas
  const balance = useMemo(() => {
    if (loading || error || !filteredAccounts.length) {
      return null;
    }

    const total = filteredAccounts.reduce((acc, cur) => acc + cur.balance, 0);
    return total.toLocaleString(); 
  }, [filteredAccounts, loading, error]);

  // Handle loading and error states
  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <h1 className="text-4xl font-extrabold">
      {balance !== null ? balance : 'No accounts found'}
    </h1>
  );
};

export default CalculateBalance;
