import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditAccountPopup from '@/components/wallet/edit-account-popup';
import SelectAccountPopup from '@/components/wallet/select-account-popup';
import axios from 'axios';
import { useEffect } from 'react';
// import { Edit } from 'lucide-react';
const paypalIcon = "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg";

const WalletPage = () => {

    useEffect(()=>{
        axios.post('https://flipbackend.bitcoincash.network/v1/flipstarter-data-from-url/',{
            "url": "https://flipstarter2.mobazha.info/"
        }).then((response)=>{
            console.log("response : ",response);
        }).then((error)=>{
            console.log(error);
        })
    },[])

    return (
        <div className='flex flex-col w-full px-4 '>
            <div className='flex flex-col w-full md:flex-row'>
                <div className='flex flex-col md:w-[50%] w-full'>
                    <h2 className='my-8 text-xl font-bold text-primary-200'>Wallet</h2>
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-4xl font-bold'>2000 USD</h1>
                        <h3 className='mt-3 font-semibold'>Available Balance</h3>
                        <SelectAccountPopup />
                        <div className="flex items-center gap-2 p-3 mt-8 border rounded">
                            <div className='flex items-center gap-4'>
                                <img src={paypalIcon} alt="PayPal" className="w-12 h-12" />
                                <div className='flex flex-col'>
                                    <span className='text-sm font-semibold'>PayPal</span>
                                    <span className='text-sm font-semibold'>BialToor@gmail.com</span>
                                </div>
                                <EditAccountPopup />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col md:w-[50%] xl:max-w-[400px] w-full'>
                    <h1 className='my-8 text-xl font-bold text-primary-200'>Transactions</h1>
                    <Tabs defaultValue="pending" className="w-full">
                        <TabsList className=' w-full md:w-[400px]'>
                            <TabsTrigger value="pending" className='w-1/2'>Pending</TabsTrigger>
                            <TabsTrigger value="paid" className='w-1/2'>Paid</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending">
                            <ul>
                                <li className='flex flex-col justify-between px-4 py-2 border shadow-lg rounded-2xl'>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-primary-200'>Payment Method</span>
                                        <span className='text-sm text-primary-200'>Paypal</span>

                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-primary-200'>Payment Amount</span>
                                        <span className='text-sm text-primary-200'>2000 USD</span>

                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-primary-200'>Date</span>
                                        <span className='text-sm text-primary-200'>12/12/2021</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-primary-200'>Transaction ID</span>
                                        <span className='text-sm text-primary-200'>+1245145662</span>
                                    </div>
                                    <Button variant='outline' className=' w-[180px] my-2 text-white bg-primary-200 '>PayOut</Button>
                                </li>
                            </ul>
                        </TabsContent>
                        <TabsContent value="paid" className='flex flex-col'>
                            <ul>
                                <li className='flex flex-col justify-between px-4 py-2 border shadow-lg rounded-2xl'>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-primary-200'>Payment Method</span>
                                        <span className='text-sm text-primary-200'>Paypal</span>

                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-primary-200'>Payment Amount</span>
                                        <span className='text-sm text-primary-200'>2000 USD</span>

                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-primary-200'>Date</span>
                                        <span className='text-sm text-primary-200'>12/12/2021</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm text-primary-200'>Transaction ID</span>
                                        <span className='text-sm text-primary-200'>+1245145662</span>
                                    </div>
                                    <Button variant='outline' className='w-[180px] bg-gray-200 my-2 ' disabled>Paid</Button>
                                </li>
                            </ul>
                        </TabsContent>
                    </Tabs>

                </div>
            </div>
        </div>
    )
}

export default WalletPage

