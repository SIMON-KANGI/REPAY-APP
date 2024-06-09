import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { FaImage } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';

function Personal() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Must enter email'),
    username: yup.string().required('Must enter a name').max(15),
    password: yup.string().required('Must enter a password').min(8),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Must confirm password'),
    phone: yup.string().required('Must enter a phone number'),
    location: yup.string().required('Must select a location'),
    account_type: yup.string().required('Must select an account type')
  });

  const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    account_type: 'personal',
    profile: 'image', // Assuming profile is always 'image' based on the backend code
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('username', values.username);
      formData.append('password', values.password);
      formData.append('phone', values.phone);
      formData.append('location', values.location);
      formData.append('account_type', values.account_type);
      formData.append('profile', 'image');
      if (file) {
        formData.append('file', file);
      } else {
        setSubmitting(false);
        return toast.error('File is required');
      }

      const response = await axios.post('http://127.0.0.1:5555/users', formData);
      
      if (!response.ok) {
        const errorMessage = await response.json();
        console.log(formData);
        setError(
          errorMessage.error || "An error occurred. Please try again later."
        );
      }

      const { access_token, username, role, content } = response.data;

      localStorage.setItem('access', access_token);
      localStorage.setItem('username', username);
      
      dispatch({ type: 'SET_CREDENTIALS', payload: { accessToken: access_token, username, role, user: content } });

      toast.success(`Logged in as ${username}`, { position: 'top-right' });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error(error.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
    console.log(formData)
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <section>
    <NavBar/>
      <div className='flex justify-center'>
      <Formik
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className='border border-slate-600 p-4 lg:w-1/2 w-full'>
            <div>
             <h1 className='text-center text-2xl font-bold'>Personal Account</h1>
            </div>

            
      <div className="flex p-4 border-dotted border-2 relative rounded-full border-slate-800 my-3 justify-center items-center h-40 w-40 overflow-hidden">
        <label className="drop-area cursor-pointer w-full h-full flex justify-center items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {!file && (
            <p className="w-fit flex p-2">
              <FaImage size={30} />
            </p>
          )}
          {file && file.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-full"
            />
          )}
        </label>
      </div>

            <div className="flex flex-col w-full relative p-4">
              <label className='font-bold'>Full Name</label>
              <Field name="username" placeholder="Full Name" className="w-full  p-2 rounded-md border-gray-700 border" />
              <ErrorMessage name="username" component="div" className="text-red-600" />
            </div>

            <div className="flex flex-col w-full  relative p-4">
              <label className='font-bold'>Email</label>
              <Field type="email" name="email" placeholder="Email" className="w-full p-2  rounded-md border-gray-700 border" />
              <ErrorMessage name="email" component="div" className="text-red-600" />
            </div>

            <div className="flex flex-col w-full font-bold  relative p-4">
              <label className='font-bold'>Phone Number</label>
              <Field type="text" name="phone" className="w-full p-2 rounded-md border-gray-700 border" />
              <ErrorMessage name="phone" component="div" className="text-red-600" />
            </div>

            <div className="w-full flex flex-col  p-3">
              <label htmlFor="location" className='text-black font-bold'>Location</label>
              <Field as="select" name="location" className='m-3 w-full p-2 rounded-md border-gray-700 border-2'>
                <option value="">Choose location</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Eldoret">Eldoret</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Muranga">Muranga</option>
                <option value="Turkana">Turkana</option>
              </Field>
              <ErrorMessage name="location" component="div" className="text-red-600" />
            </div>

            <div className="flex flex-col w-full relative p-4">
              <label className='font-bold'>Password</label>
              <Field type="password" name="password" className="w-full p-2 rounded-md border-gray-700 border" />
              <ErrorMessage name="password" component="div" className="text-red-600" />
            </div>

            <div className="flex flex-col w-full  relative p-4">
              <label className='font-bold'>Confirm Password</label>
              <Field type="password" name="confirmPassword" className="w-full p-2 rounded-md border-gray-700 border" />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-600" />
            </div>

            <button type="submit" disabled={isSubmitting} className="p-2 mt-3 w-full bg-green-900 text-white">
              Create Account
            </button>
          </Form>
        )}
      </Formik>
    </div>
    </section>
    
  );
}

export default Personal;
