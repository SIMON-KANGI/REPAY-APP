import { DrawerContent, DrawerOverlay,Drawer, DrawerBody, DrawerFooter, DrawerHeader, useDisclosure } from '@chakra-ui/react'
import React from 'react'

function CreateInvoice() {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
    <button onClick={onOpen}>Create an Invoice</button>
      <Drawer isOpen={isOpen} onClose={onClose} size={'xl'}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader className='text-center text-2xl'>Create Invoice</DrawerHeader>
            <DrawerBody>
            <form>
                <div className='flex flex-col'>
                <label className="font-bold">Customer Email</label>
                    <input type="text" name="customer-email" placeholder='Account' className='w-full p-2 border-2 rounded-md' />
                </div>
                <div className='flex flex-col'>
                <label className="font-bold">Customer Phone</label>
                    <input type="text" name="customer-email" placeholder='Account' className='w-full p-2 border-2 rounded-md' />
                </div>
                <div className='flex flex-col'>
                <label className="font-bold">Account</label>
                    <input type="number" name="account" placeholder='ksh 10000' className='w-full p-2 border-2 rounded-md' />
                </div>

                <div className='flex flex-col'>
                <label className="font-bold">Amount</label>
                    <input type="number" name="charged amount" placeholder='ksh 10000' className='w-full p-2 border-2 rounded-md' />
                </div>
                <div className='flex flex-col'>
                <label className="font-bold">Amount in Words</label>
                    <input type="text" name="amountWords" placeholder='Ten Thousand Shillings' className='w-full p-2 border-2 rounded-md' />
                </div>
                <div className='flex flex-col'>
                <label className="font-bold">Description</label>
                    <textarea name='description' type='text' placeholder='Bought 13 bags of sugar' className='w-full p-2 border-2 rounded-md'/>
                </div>
            </form>
            </DrawerBody>
            <DrawerFooter>
            </DrawerFooter>
        </DrawerContent>
        </Drawer>
    </div>
  )
}

export default CreateInvoice
