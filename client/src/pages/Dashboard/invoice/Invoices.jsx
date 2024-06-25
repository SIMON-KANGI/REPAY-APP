import React from 'react';
import SideBar from '../SideBar';
import TopNav from '../TopNav';
import CreateInvoice from './CreateInvoice';
import useFetch from '../../../hooks/UseFetch';
import { Link } from 'react-router-dom';
import { IoMdDownload } from "react-icons/io";
import { pdfjs } from 'react-pdf';
import { Card, CardBody, Tooltip } from '@chakra-ui/react';
import SearchInvoice from './SearchInvoice';
import FilterInvoice from './FilterInvoice';
import { MdDelete } from "react-icons/md";
import UpdateInvoice from './UpdateInvoice';
import { useCallback,useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
// Configure the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Invoices() {
  const { data: invoices } = useFetch('http://127.0.0.1:5555/invoices');
  const [input, setInput]=useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null);
const {onOpen,onClose,isOpen}=useDisclosure()
  const handleClick = useCallback((invoice) => {
    setSelectedInvoice(invoice);
    onOpen();
  }, [onOpen]);

  const handleDelete=useCallback((id)=>{
    axios.delete(`http://127.0.0.1:5555/invoices/${id}`)
   .then(res=>{
  return res.json()
   })
  })
  const filtererInvoice=invoices.filter(invoice=>{
    const userInvoice=invoice.user_id ===user.id
    const input= input ===null || invoice.name.includes(input.value)
  })
   
  return (
    <div className='flex'>
      <SideBar />
      <section className='w-full'>
        <TopNav />
        <div className='flex flex-col'>
          <CreateInvoice />
          <SearchInvoice/>
        </div>
        <FilterInvoice/>
        <div className='p-4'>
          <table className='min-w-full table-auto'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='px-4 py-2'>Invoice Number</th>
                <th className='px-4 py-2'>Invoice Date</th>
                <th className='px-4 py-2'>Customer Name</th>
                <th className='px-4 py-2'>Customer Phone</th>
                <th className='px-4 py-2'>Account</th>
                <th className='px-4 py-2'>Amount</th>
                <th className='px-4 py-2'>Status</th>
                <th className='px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className='bg-white border-b items-center'>
                  <td className='px-4 py-2 text-center'>{invoice.id}</td>
                  <td className='px-4 py-2 text-center'>{invoice.created_at.slice(0, 16)}</td>
                  <td className='px-4 py-2 text-center'>{invoice.name}</td>
                  <td className='px-4 py-2 text-center'>{invoice.CustomerPhone}</td>
                  <td className='px-4 py-2 text-center'>{invoice.account}</td>
                  <td className='px-4 py-2 text-center'>{invoice.amount}</td>
                  <td className='px-4 py-2 text-center items-center'><Tooltip label="update">
                  <button onClick={()=>handleClick(invoice)} className={invoice.status==='Pending'?'bg-rose-600 text-white  rounded-md px-4 py-2 font-bold':'bg-green-700 rounded-md px-4 py-2 text-white font-bold'}>{invoice.status}</button>
                         </Tooltip></td>
                  <td className='px-4 py-2 text-center items-center'>
                  
                    <button style={{backgroundColor:"midnightblue"}} className=' text-white px-2 py-1 rounded'>
                      <Link to={invoice.description}>
                        <IoMdDownload />
                      </Link>
                    </button> 
               
                    
                    <button onClick={()=>handleDelete(invoice.id)} className='mx-2'>
                      <MdDelete fontSize={'1.5rem'}/>
                  </button>
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
          {selectedInvoice &&(
            <UpdateInvoice
              onOpen={onOpen}
              isOpen={isOpen}
              onClose={onClose}
              invoice={selectedInvoice}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default Invoices;
