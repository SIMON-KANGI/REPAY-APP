import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/Authslice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation } from '../../features/auth/Authapi';
import { toast } from 'react-toastify'; // Ensure you have this library installed and configured

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [login, { isLoading }] = useLoginMutation();
    
    const formSchema = yup.object().shape({
        email: yup.string().required('Must enter an email').email('Invalid email format'),
        password: yup.string().required('Must enter a password').min(8, 'Password must be at least 8 characters'),
    });
    
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await login({ email: values.email, password: values.password }).unwrap();
            const { access_token, user } = result;
            localStorage.setItem('access', access_token);
            dispatch(setCredentials({ accessToken: access_token, user }));
            toast.success(`Logged in as ${user.username}`, { position: 'top-right' });
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.data?.message || 'An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <div>
            <h1>Login</h1>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="block">
                        <div className="block m-4 relative p-4">
                            <label className="absolute -top-6">Email*</label>
                            <Field type="email" name="email" className="w-3/4 p-2 border-gray-700 border-2" />
                            <ErrorMessage name="email" component="div" className="text-red-600" />
                        </div>

                        <div className="m-4 relative p-4">
                            <label className="absolute -top-6">Password*</label>
                            <Field type="password" name="password" className="w-3/4 p-2 border-gray-700 border-2" />
                            <ErrorMessage name="password" component="div" className="text-red-600" />
                        </div>

                        <button className="bg-blue-600 py-3 w-3/4 text-center text-white rounded-md" type="submit" disabled={isSubmitting || isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        <p className="text-sm mt-2">Don't have an account? <Link to="/register" className="text-blue-600">Register here</Link></p>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Login;
