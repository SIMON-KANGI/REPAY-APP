import React from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/Authslice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;
        const res = await axios.post('http://127.0.0.1:5555/login/authorized', { access_token });

        const { data } = res;
        const { access_token: backendAccessToken, refresh_token, user } = data;

        localStorage.setItem('access', backendAccessToken);
        localStorage.setItem('refresh', refresh_token);

        dispatch(setCredentials({ accessToken: backendAccessToken, user }));

        toast.success(`Logged in as ${user.username}`, { position: 'top-right' });
        navigate('/', { replace: true });
      } catch (error) {
        toast.error('Login failed. Please try again.');
      }
    },
    onError: () => {
      toast.error('Login failed. Please try again.');
    },
  });

  return (
    <button onClick={() => googleLogin()}>
      Login with Google
    </button>
  );
};

const GoogleAuthProviderWrapper = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <GoogleLogin />
  </GoogleOAuthProvider>
);

export default GoogleAuthProviderWrapper;
