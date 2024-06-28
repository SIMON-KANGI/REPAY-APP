import React,{useState} from 'react'
import useFetch from '../../../hooks/UseFetch'
import { FaCheck } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
function ProductsList() {
  const {data:products}=useFetch('http://127.0.0.1:5555/products')
const [stockQuantity, setStockQuantity]=useState(20)
  return (
    <div className='p-4'>
      <table className='min-w-full table-auto'>
        <thead className='p-4'>
          <tr>
          <th className='px-4 py-2'>ProductId</th>
          <th className='px-4 py-2'>Product</th>
            <th lassName='px-4 py-2'>Name</th>
          
            <th className='px-4 py-2'>Price</th>
             <th className='px-4 py-2'>Category</th>
            <th className='px-4 py-2'>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products?.map(product=>(
            <tr className='bg-white border-b items-center'>
            <td className='px-4 py-2 text-center'>{product.id}</td>
              <td className='px-4 py-2 justify-center'>
              <img src={product.profile} width="50px" height="50px" className='justify-center' alt={product.name} />
              </td>
              <td className='px-4 py-2 text-center'>{product.name}</td>
              <td className='px-4 py-2 text-center'>{product.price}</td>
              <td className='px-4 py-2 text-center'>{product.category}</td>
              <td className='px-4 py-2 flex text-center '>
                  {product.stock}
                  <span className='px-2'>
                    {product.stock<stockQuantity?<CgDanger color='red'/>:<FaCheck color="green"/>} 
                  </span> 
                 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductsList
