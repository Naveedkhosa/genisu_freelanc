import { useEffect, useState } from 'react';
import { GoDownload } from 'react-icons/go'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaCalendarAlt } from 'react-icons/fa'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from '@/components/feedback/data-table';
import EarningHeader from '@/components/earning/earning-header';
import { PaymentsIn, PaymentsInColumns, PaymentsOut, PaymentsOutColumns } from '@/components/earning/columns';
import PaymentOutForm from '@/components/earning/payment-out-form';

async function getDataOfPaymentIn(): Promise<PaymentsIn[]> {
    const data: PaymentsIn[] = [
        {
            id: 1,
            driver_id: 101,
            shipment_id: 201,
            invoice_payment_id: 301,
            amount: 500.00,
            payment_date: "2024-07-01T10:30:00Z",
        },
        {
            id: 2,
            driver_id: 102,
            shipment_id: 202,
            invoice_payment_id: 302,
            amount: 1200.00,
            payment_date: "2024-07-02T11:00:00Z",
        },
        {
            id: 3,
            driver_id: 103,
            shipment_id: 203,
            invoice_payment_id: 303,
            amount: 800.00,
            payment_date: "2024-07-03T14:45:00Z",
        },
        {
            id: 4,
            driver_id: 104,
            shipment_id: 204,
            invoice_payment_id: 304,
            amount: 1500.00,
            payment_date: "2024-07-04T16:20:00Z",
        },
        {
            id: 5,
            driver_id: 105,
            shipment_id: 205,
            invoice_payment_id: 305,
            amount: 900.00,
            payment_date: "2024-07-05T09:30:00Z",
        },
    ];


    return data;
}
async function getDataOfPaymentOut(): Promise<PaymentsOut[]> {
    const data: PaymentsOut[] = [
        {
            id: 1,
            driver_id: 101,
            amount: 700.00,
            payment_date: "2024-07-01T10:30:00Z",
            payment_method: "Credit Card",
            transaction: "TXN123456",
        },
        {
            id: 2,
            driver_id: 102,
            amount: 1500.00,
            payment_date: "2024-07-02T11:00:00Z",
            payment_method: "Bank Transfer",
            transaction: "TXN123457",
        },
        {
            id: 3,
            driver_id: 103,
            amount: 600.00,
            payment_date: "2024-07-03T14:45:00Z",
            payment_method: "Credit Card",
            transaction: "TXN123458",
        },
        {
            id: 4,
            driver_id: 104,
            amount: 1300.00,
            payment_date: "2024-07-04T16:20:00Z",
            payment_method: "PayPal",
            transaction: "TXN123459",
        },
        {
            id: 5,
            driver_id: 105,
            amount: 1000.00,
            payment_date: "2024-07-05T09:30:00Z",
            payment_method: "Credit Card",
            transaction: "TXN123460",
        },
    ];

    return data;
}
const EarningPage = () => {
    const [paymentIn, setPaymentIn] = useState<PaymentsIn[]>([]);
    const [paymentOut, setPaymentOut] = useState<PaymentsOut[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDataOfPaymentIn();
            setPaymentIn(data);
        };
        const fetchDataPaymentOut = async () => {
            const data = await getDataOfPaymentOut();
            setPaymentOut(data);
        };

        fetchData();
        fetchDataPaymentOut();
    }, []);

    return (
        <div className='flex flex-col w-full px-4 '>
            <EarningHeader />
            <div className='flex justify-start gap-3 items-center my-2 '>
                <div className='flex justify-between items-center my-2'>
                    <Select>
                        <SelectTrigger className="relative w-[180px] outline-none border focus:outline-none active:outline-none pl-10">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <SelectValue placeholder="Last 30 Days" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>All</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <GoDownload className='text-white bg-primary-300 w-[40px] rounded cursor-pointer h-[40px] px-2 py-2 text-2xl shadow-lg' />
            </div>
            <p className='text-xs mt-1'>0 Orders for Last 30 days</p>
            <div className="mt-4">
                {/* @ts-ignore */}
                <Tabs defaultValue="paymentIn" className="w-full">
                    <TabsList className='w-[400px]'>
                        <TabsTrigger value="paymentIn" className='w-1/2'>paymentIn</TabsTrigger>
                        <TabsTrigger value="paymentOut" className='w-1/2'>paymentOut</TabsTrigger>
                    </TabsList>
                    <TabsContent value="paymentIn">
                        <DataTable columns={PaymentsInColumns} data={paymentIn} />
                    </TabsContent>
                    <TabsContent value="paymentOut" className='flex flex-col'>
                        <PaymentOutForm />
                        <DataTable columns={PaymentsOutColumns} data={paymentOut} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default EarningPage

