import React, { useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { FaCheck } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { Button, Menu, MenuItem, MenuButton, MenuList } from '@chakra-ui/react';
import { BsChevronBarDown } from 'react-icons/bs';
import UpdateStock from './UpdateStock';
import DeleteProduct from './DeleteProduct';

function ProductsList({ products, onClose, onOpen, isOpen }) {
  const [submitting, setSubmitting] = useState(false);
  const [stock, setStock] = useState({ id: null, stock: '' });
  const [productsList, setProductsList] = useState(products || []);

  useMemo(() => {
    setProductsList(products);
  }, [products]);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      setSubmitting(true);
      const result = await axios.patch(`http://127.0.0.1:5555/products/${updatedProduct.id}`, updatedProduct);
      if (result.status === 200) {
        setSubmitting(false);
        setProductsList(productsList.map(product => product.id === updatedProduct.id ? updatedProduct : product));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = useCallback(async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5555/products/${id}`);
      if (response.status === 200) {
        console.log('Product deleted successfully');
        setProductsList(productsList.filter(p => p.id !== id));
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  }, [productsList, onClose]);

  return (
    <div className='p-4'>
      <table className='min-w-full table-auto'>
        <thead className='p-4'>
          <tr>
            <th className='px-4 py-2'>ProductId</th>
            <th className='px-4 py-2'>Product</th>
            <th className='px-4 py-2'>Name</th>
            <th className='px-4 py-2'>Price</th>
            <th className='px-4 py-2'>Category</th>
            <th className='px-4 py-2'>Stock</th>
            <th className='px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productsList?.map(product => (
            <tr key={product?.id} className='bg-white border-b items-center'>
              <td className='px-4 py-2 text-center'>{product?.id}</td>
              <td className='px-4 py-2 justify-center items-center flex'>
                <img src={product?.profile} className='justify-center rounded-full w-16 h-16' alt={product?.name} />
              </td>
              <td className='px-4 py-2 text-center'>{product?.name}</td>
              <td className='px-4 py-2 text-center'>{product?.price}</td>
              <td className='px-4 py-2 text-center'>{product?.category}</td>
              <td className='px-4 py-2 flex items-center justify-center '>
                {product?.stock}
                <span className='px-2'>
                  {product?.stock < 20 ? <CgDanger color='red' /> : <FaCheck color="green" />}
                </span>
              </td>
              <td>
                <Menu>
                  <MenuButton as={Button} rightIcon={<BsChevronBarDown />}>
                    Choose
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <UpdateStock
                        handleUpdate={handleUpdate}
                        handleChange={handleChange}
                        stock={stock}
                        product={product}
                      />
                    </MenuItem>
                    <MenuItem>
                      <DeleteProduct handleDelete={() => handleDelete(product.id)} />
                    </MenuItem>
                  </MenuList>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsList;
