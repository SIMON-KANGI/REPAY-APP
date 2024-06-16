import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay,useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { selectUserData } from '../../features/auth/Authslice';
import { useSelector } from 'react-redux';
function EditUser() {
const { isOpen, onOpen, onClose } = useDisclosure();
const user=useSelector(selectUserData)
  return (
    <div>
      <Drawer>
      <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader>
Edit 
            </DrawerHeader>
            <DrawerBody>
            <form onSubmit={handleSubmit}>
                        <div className='justify-between flex'>
                            <h1>Edit Profile</h1>
                           
                            <button type="submit"  className='bg-black rounded-full text-slate-200 px-6 py-2'>Save</button>
                        </div>
                        <img src="https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg" alt="name" className='rounded-full w-24 h-24' />
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
                                    <label className='font-bold'>Password</label>
                                    <input type="password" name="password" className='border-2 border-gray-900 relative rounded-md p-4 w-full' onChange={handleChange} value={values.password} />
                                </div>
                                <div className="relative">
                                    <label className='font-bold'>Confirm Password</label>
                                    <input type="password" name="confirmPassword" className='border-2 border-gray-900 relative rounded-md p-4 w-full' onChange={handleChange} value={values.confirmPassword} />
                                </div>
                            </div>
                            <hr />
                            <h1 className='text-center font-bold text-xl'>Select Preferences</h1>
                            <div className='grid shadow-md p-3'>
                               <div className='p-1 '>
                                <input type="checkbox" name="category" onChange={handleChange}  value='frontend development' />
                <label className='p-1 font-montserrat font-medium'>Frontend Development</label>
              </div>
              <div className='p-1'>
                <input type="checkbox" name="category" onChange={handleChange}  value='backend development' />
                <label className='p-1 font-montserrat font-medium'>Backend Development</label>
              </div>
              <div className='p-1'>
                <input type="checkbox" name="category" onChange={handleChange}   value="FullStack Development" />
                <label className='p-1 font-montserrat font-medium'>FullStack Development</label>
              </div>
              <div className='p-1'>
                <input type="checkbox" />
                <label className='p-1 font-montserrat font-medium' onChange={handleChange}  name="category" value="devops">DevOps</label>
              </div>
              </div>
                            {isAdmin &&
                            <div className='p-3 shadow-md mt-3'>
                             <h1 className='font-bold'>Update Role</h1>
                                <select name="role" onChange={handleChange} value={values.role} className="px-6 py-2">
                                    <option value=''>{user.role}</option>
                                    <option value="admin">Admin</option>
                                    <option value="staff">Staff</option>
                                    <option value="student">Student</option>
                                </select>
                              
                               
                            </div>  }
                            
                        </form>
            </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default EditUser
