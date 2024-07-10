import React,{useState} from 'react'
import TopNav from '../TopNav'
import SideBar from '../SideBar'
import AddProducts from './AddProducts'
import ProductsList from './productsList'
import { useSelector } from 'react-redux';
import { selectUserData } from '../../../features/auth/Authslice';
function Products() {
  const user = useSelector(selectUserData);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
      name: '',
      description: "",
      stock: "",
      price: "",
      user_id: user.id,
      category: "",
      profile: 'image'
  });

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const formDataWithFile = new FormData();
          formDataWithFile.append('name', formData.name);
          formDataWithFile.append('description', formData.description);
          formDataWithFile.append('stock', formData.stock);
          formDataWithFile.append('price', formData.price);
          formDataWithFile.append('user_id', formData.user_id);
          formDataWithFile.append('category', formData.category);
          formDataWithFile.append('profile', 'image');

          if (file) {
              formDataWithFile.append('file', file);
          } else {
              throw new Error("No image selected.");
          }

          const response = await axios.post('https://repay-app.onrender.com/products', formDataWithFile, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });

          console.log(response.data); // Log or handle successful response

          onClose(); // Close modal after successful submission
      } catch (error) {
          console.error("Error adding product:", error.message);
          // Handle error state or display error message to user
      }
  };

  return (
    <div className='flex'>
      <SideBar/>
      <section className='w-full'>
        <TopNav/>
        <AddProducts 
        handleChange={handleChange}
         handleFileChange={handleFileChange} 
        handleSubmit={handleSubmit}
        formData={formData}  
        file={file}
        />
        <h1>Products</h1>
        <ProductsList/>
      </section>
    </div>
  )
}

export default Products
