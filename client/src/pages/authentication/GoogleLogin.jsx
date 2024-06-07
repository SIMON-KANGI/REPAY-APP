import React from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/Authslice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginMutation } from '../../features/auth/Authapi';
const LoginGoogle = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
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
        <div>
            <button onClick={() => googleLogin()}>
        Sign with Google
      
      </button>
        </div>
      
    );
  };
  
  const GoogleAuthProviderWrapper = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <LoginGoogle />
    </GoogleOAuthProvider>
  );
  

export default GoogleAuthProviderWrapper;

// function LoginGoogle(){
// const onSuccess=res=>{
//     console.log('Login successful')
// }
// const onFailure=res=>{
//     console.log('Login failed')
// }
//     return(
//         <GoogleOAuthProvider>
//             <GoogleLogin
//         clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
//         buttonTitle="Login"
//         onSuccess={onSuccess}
//         onFailure={onFailure}
//         isSignedIn={true}
//         cookiePolicy={'single_host_origin'}


//         />
//         </GoogleOAuthProvider>
        
//     )

// }
// export default LoginGoogle