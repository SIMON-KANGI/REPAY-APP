import React, { useCallback, useState } from 'react';
import SideBar from '../SideBar';
import TopNav from '../TopNav';
import CreateInvoice from './CreateInvoice';
import useFetch from '../../../hooks/UseFetch';
import { Link } from 'react-router-dom';
import { IoMdDownload } from "react-icons/io";
import { pdfjs } from 'react-pdf';
import { Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import SearchInvoice from './SearchInvoice';
import FilterInvoice from './FilterInvoice';
import { MdDelete } from "react-icons/md";
import UpdateInvoice from './UpdateInvoice';
import { selectUserData } from '../../../features/auth/Authslice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Pagination from '../../../components/Pagination';

// Configure the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Invoices() {
  const { data: invoices, isLoading, error } = useFetch('https://repay-app.onrender.com/invoices');
  const [input, setInput] = useState('');
  const user = useSelector(selectUserData);
  const [pageNumber, setPageNumber]= useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const { onOpen, onClose, isOpen } = useDisclosure();
const toast= useToast()
  const handleClick = useCallback((invoice) => {
    setSelectedInvoice(invoice);
    onOpen();
  }, [onOpen]);

  const handleDelete = useCallback((id) => {
    axios.delete(`https://repay-app.onrender.com/invoices/${id}`)
      .then(() => {
        // Handle successful deletion
        alert('Invoice deleted successfully!');
        // Optionally, refetch invoices or filter them locally
      })
      .catch(error => {
        console.error("There was an error deleting the invoice!", error);
      });
  }, []);

  const filteredInvoices = invoices?.filter(invoice => {
    const userInvoice = invoice.user_id === user.id;
    const setInput = input === '' || invoice?.name.toUpperCase().startsWith(input.toUpperCase());
    const SelectedStatus = selectedStatus === null || invoice.status === selectedStatus;
    return userInvoice && setInput && SelectedStatus;
  });

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  function handleStatusChange(status) {
    setSelectedStatus(status);
  }

  const handleUpdate = useCallback((updatedInvoice) => {
    axios.patch(`https://repay-app.onrender.com/invoices/${updatedInvoice.id}`, updatedInvoice)
      .then(() => {
        // Handle successful update
        toast({
          title: 'Invoice updated successfully',
          position: "top-right",
          status: "success",
          isClosable: true,
        });
        onClose();
        // Optionally, refetch invoices or update the local state
      })
      .catch(error => {
        console.error("There was an error updating the invoice!", error);
      });
  }, [onClose]);

  const indexOfLast= currentPage * pageNumber
  const indexOfFirst=indexOfLast-pageNumber
  const PaginateInvoices= filteredInvoices.slice(indexOfFirst, indexOfLast)
  const paginate=(pageNumber)=>setCurrentPage(pageNumber)
  return (
    <div className='flex'>
      <SideBar />
      <section className='w-full'>
        <TopNav />
        <div className='flex flex-col'>
          <CreateInvoice />
        </div>
        <div className="items-center">
          <FilterInvoice handleStatus={handleStatusChange} />
          <SearchInvoice handleChange={handleInputChange} value={input} />
        </div>

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
              {PaginateInvoices?.map((invoice) => (
                <tr key={invoice.id} className='bg-white border-b items-center'>
                  <td className='px-4 py-2 text-center'>{invoice.id}</td>
                  <td className='px-4 py-2 text-center'>{invoice.created_at.slice(0, 16)}</td>
                  <td className='px-4 py-2 text-center'>{invoice.name}</td>
                  <td className='px-4 py-2 text-center'>{invoice.CustomerPhone}</td>
                  <td className='px-4 py-2 text-center'>{invoice.account}</td>
                  <td className='px-4 py-2 text-center'>{invoice.amount}</td>
                  <td className='px-4 py-2 text-center items-center'>
                    <Tooltip label="update">
                      <button onClick={() => handleClick(invoice)} className={invoice.status === 'Pending' ? 'bg-rose-600 text-white rounded-md px-4 py-2 font-bold' : 'bg-green-700 rounded-md px-4 py-2 text-white font-bold'}>
                        {invoice.status}
                      </button>
                    </Tooltip>
                  </td>
                  <td className='px-4 py-2 text-center items-center'>
                    <button style={{ backgroundColor: "midnightblue" }} className='text-white px-2 py-1 rounded'>
                      <Link to={invoice.description}>
                        <IoMdDownload />
                      </Link>
                    </button>
                    <button onClick={() => handleDelete(invoice.id)} className='mx-2'>
                      <MdDelete fontSize={'1.5rem'} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedInvoice && (
            <UpdateInvoice
              isOpen={isOpen}
              onClose={onClose}
              invoice={selectedInvoice}
              handleUpdate={handleUpdate}
              handleChange={(e) => setSelectedInvoice({ ...selectedInvoice, status: e.target.value })}
            />
          )}
          <Pagination numberPerpage={pageNumber} totalItems={filteredInvoices.length} paginate={paginate}/>
        </div>
      </section>
    </div>
  );
}

export default Invoices;
