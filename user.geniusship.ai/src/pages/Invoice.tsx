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
import FeedBackHeader from '@/components/feedback/feeback-header';
import { DataTable } from '@/components/feedback/data-table';
import { Invoice, InvoiceColumns } from '@/components/invoice/columns';

async function getData(): Promise<Invoice[]> {
  const data:  Invoice[] =  [
    {
      id: 1,
      shipment_id: 201,
      bid_id: 301,
      customer_id: 101,
      amount: 150.75,
      status: 'Pending',
      due_date: "2024-08-01",
      created_at: "2024-07-01T10:30:00Z",
      payment_method: "Credit Card",
    },
    {
      id: 2,
      shipment_id: 202,
      bid_id: 302,
      customer_id: 102,
      amount: 200.00,
      status: 'Paid',
      due_date: "2024-08-02",
      created_at: "2024-07-02T11:00:00Z",
      payment_method: "PayPal",
    },
    {
      id: 3,
      shipment_id: 203,
      bid_id: 303,
      customer_id: 103,
      amount: 320.50,
      status: 'Cancelled',
      due_date: "2024-08-03",
      created_at: "2024-07-03T14:45:00Z",
      payment_method: "Bank Transfer",
    },
    {
      id: 4,
      shipment_id: 204,
      bid_id: 304,
      customer_id: 104,
      amount: 75.00,
      status: 'Pending',
      due_date: "2024-08-04",
      created_at: "2024-07-04T16:20:00Z",
      payment_method: "Credit Card",
    },
    {
      id: 5,
      shipment_id: 205,
      bid_id: 305,
      customer_id: 105,
      amount: 50.25,
      status: 'Paid',
      due_date: "2024-08-05",
      created_at: "2024-07-05T09:30:00Z",
      payment_method: "PayPal",
    },
    {
      id: 6,
      shipment_id: 206,
      bid_id: 306,
      customer_id: 106,
      amount: 400.00,
      status: 'Cancelled',
      due_date: "2024-08-06",
      created_at: "2024-07-06T12:15:00Z",
      payment_method: "Bank Transfer",
    },
    {
      id: 7,
      shipment_id: 207,
      bid_id: 307,
      customer_id: 107,
      amount: 120.00,
      status: 'Pending',
      due_date: "2024-08-07",
      created_at: "2024-07-07T08:00:00Z",
      payment_method: "Credit Card",
    },
    {
      id: 8,
      shipment_id: 208,
      bid_id: 308,
      customer_id: 108,
      amount: 250.00,
      status: 'Paid',
      due_date: "2024-08-08",
      created_at: "2024-07-08T13:40:00Z",
      payment_method: "PayPal",
    },
    {
      id: 9,
      shipment_id: 209,
      bid_id: 309,
      customer_id: 109,
      amount: 95.00,
      status: 'Cancelled',
      due_date: "2024-08-09",
      created_at: "2024-07-09T15:50:00Z",
      payment_method: "Bank Transfer",
    },
    {
      id: 10,
      shipment_id: 210,
      bid_id: 310,
      customer_id: 110,
      amount: 180.00,
      status: 'Pending',
      due_date: "2024-08-10",
      created_at: "2024-07-10T11:25:00Z",
      payment_method: "Credit Card",
    },
  ];
  

  return data;
}

const InvoicePage = () => {
  const [invoice, setInvoice] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setInvoice(data);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col w-full px-4 '>
      <FeedBackHeader />
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
        <DataTable columns={InvoiceColumns} data={invoice} />
      </div>
    </div>
  )
}

export default InvoicePage

