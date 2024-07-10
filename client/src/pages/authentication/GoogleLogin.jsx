import React from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/Authslice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginMutation } from '../../features/auth/Authapi';
import { FcGoogle } from "react-icons/fc";
import { useToast } from '@chakra-ui/react';

const LoginGoogle = () => {
  const toast=useToast()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const googleLogin = useGoogleLogin({
      onSuccess: async (response) => {
        console.log('login success',response.profileObj)
        const {email,name,googleId, imageUrl}= response.profileObj
        try {
          // const { access_token } = response;
          const res = await axios.post('https://repay-app.onrender.com/login/authorized',{token:access_token});
  
          const { data } = res;
          const { access_token: access_token, refresh_token, user } = data;
  
          localStorage.setItem('access', access_token);
          localStorage.setItem('refresh', refresh_token);
  
          dispatch(setCredentials({ accessToken:access_token, user }));
  
          toast({
            title: `Welcome ${user.username}`,
            position: "top-center",
            status: "success",
            isClosable: true,
          })
          navigate('/my-dashboard', { replace: true });
        } catch (error) {
          toast({
            title: `An error occured ${error}`,
            position: "top-center",
            status: "success",
            isClosable: true,
          })
        }
      },
      onError: () => {
        toast({
          title: `An error occured ${error}`,
          position: "top-center",
          status: "success",
          isClosable: true,
        })
      },
    });
  
    return (
        <div className="block w-full mt-4 relative p-4">
            <button onClick={() => googleLogin()} className=" py-3 flex justify-center w-96 text-center text-stone-900 border border-gray-700 rounded-md">
            <FcGoogle fontSize={'1.3rem'}/>
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