import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { selectUserData } from '../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/UseAuth';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import DeleteAccount from './DeleteAccount';
function EditUser() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useSelector(selectUserData);
    const [locations, setLocations] = useState([]);
    const toast=useToast()
    const { isUser } = useAuth('user');
    const [file, setFile] = useState(null);
    const [values, setValues] = useState({
        username: user?.username,
        email: user?.email,
        phone:user?.phone,
        location: user?.location,
        password:'',
        confirmPassword: '',
        account_type: user?.account_type,
        profile: user?.profile
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    function handleChange(e) {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (values.password && values.password !== values.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('location', values.location);
        formData.append('phone', values.phone);
        if (values.password) formData.append('password', values.password);
        formData.append('account_type', values.account_type);
        formData.append('profile', values.profile);
        if (file) formData.append('file', file);

        try {
            const response = await axios.put(`http://127.0.0.1:5555/users/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
           
            toast({
                title: 'Profile updated successfully',
                position: 'top-right',
                duration: 5000,
                isClosable: true,
            })
            onClose();
        } catch (err) {
            setError('Failed to update profile. Please try again.');
            console.error('Error:', err.response ? response.error : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={onOpen} className='p-3 w-full shadow-md items-center text-slate-200'>Edit Profile</button>
            <Drawer isOpen={isOpen} onClose={onClose} size={'lg'}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Edit Profile</DrawerHeader>
                    <DrawerBody>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className='justify-between flex'>
                                <h1>Edit Profile</h1>
                                <button type="submit" className={`bg-black rounded-full text-slate-200 px-6 py-2 ${loading ? 'opacity-50' : ''}`} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
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
                                        <div className='relative'>
                                            <img src={values.profile} alt="profile" className='rounded-full' />
                                            <h3 className='absolute z-50 left-32 bottom-8'>Edit</h3>
                                        </div>
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
                            <h1 className='text-center font-bold text-xl'>Personal Details</h1>
                            <div className='grid shadow-md'>
                                <div className="relative">
                                    <label className='font-bold'>Username</label>
                                    <input name="username" className='border-2 border-gray-900 relative rounded-md p-4 w-full' onChange={handleChange} value={values.username} />
                                </div>
                                <div className="relative">
                                    <label className='font-bold'>Email</label>
                                    <input name="email" className='border-2 border-gray-900 relative rounded-md p-4 w-full' onChange={handleChange} value={values.email} />
                                </div>
                                <div className="relative">
                                    <label className='font-bold'>Phone Number</label>
                                    <input name="number" className='border-2 border-gray-900 relative rounded-md p-4 w-full' onChange={handleChange} value={values.phone} />
                                </div>
                                <div className="relative">
                                    <label className='font-bold'>Password</label>
                                    <input type="password" name="password" className='border-2 border-gray-900 relative rounded-md p-4 w-full' onChange={handleChange} value={values.password} />
                                </div>
                                <div className="relative">
                                    <label className='font-bold'>Confirm Password</label>
                                    <input type="password" name="confirmPassword" className='border-2 border-gray-900 relative rounded-md p-4 w-full' onChange={handleChange} value={values.confirmPassword} />
                                </div>
                            </div>
                            <div className="w-full flex flex-col p-3">
                                <label htmlFor="location" className='font-bold'>Location</label>
                                <select name="location" className='m-3 text-black w-full p-2 rounded-md border-gray-700 border-2' onChange={handleChange} value={values.location}>
                                    <option value="">{values.location}</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.name}>{location.name}</option>
                                    ))}
                                </select>
                            </div>
                            <hr />
                            <h1 className='text-center font-bold text-xl'>Select Preferences</h1>
                            {isUser && (
                                <div className='p-3 shadow-md mt-3'>
                                    <h1 className='font-bold'>Change Account Type</h1>
                                    <select name="account_type" onChange={handleChange} value={values.account_type} className="px-6 py-2">
                                        <option value=''>{user.account_type}</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                </div>
                            )}
                            <div className='p-3 shadow-md mt-3'>
                                    <h1 className='font-bold'>Change Account Type</h1>
                                    <select name="account_type" onChange={handleChange} value={values.account_type} className="px-6 py-2">
                                        <option value=''>{user?.account_type}</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Business">Business</option>
                                    </select>
                                </div>
                        </form>
                        <DeleteAccount />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default EditUser;
