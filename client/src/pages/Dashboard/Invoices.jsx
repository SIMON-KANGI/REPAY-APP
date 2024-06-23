import React from 'react';
import SideBar from './SideBar';
import TopNav from './TopNav';
import CreateInvoice from './CreateInvoice';
import useFetch from '../../hooks/UseFetch';
import { Document, Page, pdfjs } from 'react-pdf';
import { Link } from 'react-router-dom';
import { IoMdDownload } from "react-icons/io";
import { Card, CardBody } from '@chakra-ui/react';
// Configure the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Invoices() {
  const { data: invoices } = useFetch('http://127.0.0.1:5555/invoices');

  return (
    <div className='flex'>
      <SideBar />
      <section className='w-full'>
        <TopNav />
        <div>
          <CreateInvoice />
        </div>
        <div className='flex'>
          {invoices.map((invoice) => {
            return (
              <Card key={invoice.id} className="my-4 p-6 w-fit mx-8 shadow-md">
              <CardBody>
                 <Link className='bg-sky-700 flex items-center rounded-md text-blue-100 font-bold w-fit py-3 px-8' to="http://res.cloudinary.com/doifxgf1h/raw/upload/v1719140784/rno32dp6sehoiirpzpeq">
              <IoMdDownload />
                Download Invoice
              </Link>
               
                <div>
                <h1>Customer Phone:{invoice.CustomerPhone}</h1>
                  <h1>Company name:{invoice.name}</h1>
                  <h1>Company Account:{invoice.account}</h1>
                  <h1>Date: {invoice.created_at.slice(0,16)}</h1>
                </div>
              </CardBody>
             
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Invoices;
