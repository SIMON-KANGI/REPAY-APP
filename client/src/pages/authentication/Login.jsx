import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/Authslice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation } from '../../features/auth/Authapi';
import axios from 'axios';
import GoogleAuthProviderWrapper from './GoogleLogin';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Spinner, useToast } from '@chakra-ui/react';
import { useGlobalContext } from '../../context/GlobalProvider';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { setUserData, setLoggedIn } = useGlobalContext();
    const toast = useToast();
    const from = location.state?.from?.pathname || '/my-dashboard';
    const [login, { isLoading }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    function handleShowPassword() {
        setShowPassword(!showPassword);
    }

    const formSchema = yup.object().shape({
        email: yup.string().required('Must enter an email').email('Invalid email format'),
        password: yup.string().required('Must enter a password').min(8, 'Password must be at least 8 characters'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await login({
                email: values.email,
                password: values.password,
            });
            const { access_token } = response.data;
            if (access_token) {
                const res = await axios.get('http://127.0.0.1:5555/auth/user/token', {
                    headers: { Authorization: `Bearer ${access_token}` },
                });
                const [{token}]  = res.data;
                console.log("token", token)
                setLoggedIn(true);
                setUserData(token?.user);
                dispatch(setCredentials({ accessToken:access_token, username: token?.username, role: token?.role, user: token?.user }));
                toast({
                    title: `Welcome back ${token?.username}`,
                    position: "top-center",
                    status: "info",
                    isClosable: true,
                });
                navigate(from, { replace: true });
                console.log(token?.username);
            } else {
                console.log('Token not found');
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Login error",
                description: 'Error occurred',
                position: "top-center",
                status: "error",
                isClosable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="flex w-full h-screen">
            <div className="lg:w-3/4 w-0 lg:flex lg:flex-col justify-center items-center overflow-hidden">
                <Link to='/' className='text-green-700 text-4xl font-bold'>RE<span className='text-rose-600'>PAY</span></Link>
                <img src="/Money-Transfer.png" alt="placeholder" className="max-w-full max-h-full object-cover" />
            </div>
            <div className='flex flex-col my-6 py-16 px-4 items-center justify-center w-full'>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={formSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="block text-stone-900 p-20 border rounded-md border-slate-500">
                            <h1 className='text-center text-3xl font-bold'>Login to REPAY</h1>
                            <div className="block w-full mt-6 relative p-4">
                                <label className="absolute -top-2">Email<span className='text-rose-600'>*</span></label>
                                <Field type="email" name="email" placeholder="Email" className="w-96 p-2 text-black rounded-md border-gray-700 border" />
                                <ErrorMessage name="email" component="div" className="text-red-600" />
                            </div>

                            <div className="block w-full mt-6 relative p-4">
                                <label className="absolute -top-2 left-2">Password<span className='text-rose-600'>*</span></label>
                                <Field type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-96 text-black relative rounded-md p-2 border-gray-700 border" />
                                <ErrorMessage name="password" component="div" className="text-red-600" />
                                <button type="button" className='absolute right-6 top-6' onClick={handleShowPassword}>
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            <div className="block w-full mt-4 relative p-4">
                                <button className="bg-emerald-600 py-3 w-96 text-center text-white rounded-md" type="submit" disabled={isSubmitting || isLoading}>
                                    {isLoading ? <Spinner /> : 'Login'}
                                </button>
                            </div>
                            <p className="text-sm mt-2">Don't have an account? <Link to="/account" className="text-blue-600">Register here</Link></p>
                        </Form>
                    )}
                </Formik>
                <hr />
                <p className="text-sm mt-2">or</p>
                <div className='items-center justify-center'>
                    <GoogleAuthProviderWrapper />
                </div>
            </div>
        </section>
    );
}

export default Login;
