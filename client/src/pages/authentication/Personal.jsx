import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { FaImage } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { setCredentials } from '../../features/auth/Authslice';

function Personal() {
  const [file, setFile] = useState(null);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5555/locations');
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error('Failed to fetch locations');
      }
    };
    
    fetchLocations();
  }, []);

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
    account_type: 'Personal',
    profile: 'image',
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

      if (response.status !== 200) {
        return toast.error(response.data.error || "An error occurred. Please try again later.");
      }

      const { access_token, username, role, content } = response.data;

      localStorage.setItem('access', access_token);
      localStorage.setItem('username', username);
      
      dispatch(setCredentials({ accessToken: access_token, username: username, role: role, user: content }));

      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error(error.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <section>
      <NavBar/>
      <div className='flex justify-center my-8 text-stone-900'>
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
              
              <div className="flex p-4 border-dotted border-2 relative rounded-full border-stone-800 my-3 justify-center items-center h-40 w-40 overflow-hidden">
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
                <Field name="username" placeholder="Full Name" className="w-full p-2 rounded-md border-gray-700 border" />
                <ErrorMessage name="username" component="div" className="text-red-600" />
              </div>

              <div className="flex flex-col w-full relative p-4">
                <label className='font-bold'>Email</label>
                <Field type="email" name="email" placeholder="Email" className="w-full p-2 rounded-md border-gray-700 border" />
                <ErrorMessage name="email" component="div" className="text-red-600" />
              </div>

              <div className="flex flex-col w-full font-bold relative p-4">
                <label className='font-bold'>Phone Number</label>
                <Field type="text" name="phone" placeholder="phone number" className="w-full p-2 rounded-md border-gray-700 border" />
                <ErrorMessage name="phone" component="div" className="text-red-600" />
              </div>

              <div className="w-full flex flex-col p-3">
                <label htmlFor="location" className='font-bold'>Location</label>
                <Field as="select" name="location" className='m-3 text-black w-full p-2 rounded-md border-gray-700 border-2'>
                  <option value="">Choose location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.name}>{location.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="location" component="div" className="text-red-600" />
              </div>

              <div className="flex flex-col w-full relative p-4">
                <label className='font-bold'>Password</label>
                <Field type="password" name="password" placeholder="password" className="w-full p-2 rounded-md border-gray-700 border" />
                <ErrorMessage name="password" component="div" className="text-red-600" />
              </div>

              <div className="flex flex-col w-full relative p-4">
                <label className='font-bold'>Confirm Password</label>
                <Field type="password" name="confirmPassword" placeholder="confirm password" className="w-full p-2 rounded-md border-gray-700 border" />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-600" />
              </div>

              <button type="submit" disabled={isSubmitting} className="p-2 mt-3 w-full bg-green-900 text-white">
                Create Account
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <Footer/>
    </section>
  );
}

export default Personal;
