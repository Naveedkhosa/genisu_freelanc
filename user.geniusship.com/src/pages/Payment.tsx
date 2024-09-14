import { useEffect, useState } from 'react';
import { DataTable } from '@/components/payment/data-table';
import { Payment, PaymentColumns } from '@/components/payment/columns';
import PaymentHeader from '@/components/payment/payment-header';

async function getData(): Promise<Payment[]> {
    const data: Payment[] = [
        {
            id: 1,
            name: 'Payment 1',
            slug: 'payment-1',
            image: 'image1.png',
            active: true,
            created_at: "2024-07-01T10:30:00Z",
        },
        {
            id: 2,
            name: 'Payment 2',
            slug: 'payment-2',
            image: 'image2.png',
            active: true,
            created_at: "2024-07-02T11:00:00Z",
        },
        {
            id: 3,
            name: 'Payment 3',
            slug: 'payment-3',
            image: 'image3.png',
            active: false,
            created_at: "2024-07-03T14:45:00Z",
        },
        {
            id: 4,
            name: 'Payment 4',
            slug: 'payment-4',
            image: 'image4.png',
            active: true,
            created_at: "2024-07-04T16:20:00Z",
        },
        {
            id: 5,
            name: 'Payment 5',
            slug: 'payment-5',
            image: 'image5.png',
            active: true,
            created_at: "2024-07-05T09:30:00Z",
        },
        {
            id: 6,
            name: 'Payment 6',
            slug: 'payment-6',
            image: 'image6.png',
            active: false,
            created_at: "2024-07-06T12:15:00Z",
        },
        {
            id: 7,
            name: 'Payment 7',
            slug: 'payment-7',
            image: 'image7.png',
            active: true,
            created_at: "2024-07-07T08:00:00Z",
        },
        {
            id: 8,
            name: 'Payment 8',
            slug: 'payment-8',
            image: 'image8.png',
            active: true,
            created_at: "2024-07-08T13:40:00Z",
        },
        {
            id: 9,
            name: 'Payment 9',
            slug: 'payment-9',
            image: 'image9.png',
            active: false,
            created_at: "2024-07-09T15:50:00Z",
        },
        {
            id: 10,
            name: 'Payment 10',
            slug: 'payment-10',
            image: 'image10.png',
            active: true,
            created_at: "2024-07-10T11:25:00Z",
        },
    ];


    return data;
}

const PaymentPage = () => {
    const [Payment, setPayment] = useState<Payment[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData();
            setPayment(data);
        };

        fetchData();
    }, []);

    return (
        <div className='px-2 md:pl-[84px] sm:pl-0'>
            <div className='flex flex-col w-full px-4 '>
                <PaymentHeader />
            </div>
            <div className="mt-1 px-4">
                {/* @ts-ignore */}
                <DataTable columns={PaymentColumns} data={Payment} />
            </div>
        </div>
    )
}

export default PaymentPage

