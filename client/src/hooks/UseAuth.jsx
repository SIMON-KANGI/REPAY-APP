import { useSelector } from 'react-redux';
import { selectUserData } from '../features/auth/Authslice';


const useAuth = (allowedRoles) => {
  const user = useSelector(selectUserData);
  if (!user) return false; // Not authenticated

  const { role} = user;
  return allowedRoles.includes(role) 
};

export default useAuth;
