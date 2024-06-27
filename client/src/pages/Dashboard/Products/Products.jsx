import React from 'react'
import TopNav from '../TopNav'
import SideBar from '../SideBar'
import AddProducts from './AddProducts'
import ProductsList from './productsList'
function Products() {
  return (
    <div className='flex'>
      <SideBar/>
      <section className='w-full'>
        <TopNav/>
        <AddProducts/>
        <h1>Products</h1>
        <ProductsList/>
      </section>
    </div>
  )
}

export default Products
