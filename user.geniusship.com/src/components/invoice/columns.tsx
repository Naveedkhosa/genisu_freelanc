import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import PayNowPopup from "./paynow-popup";

export interface Invoice {
  id: number;
  shipment_id: number;
  bid_id: number;
  customer_id: number;
  amount: number;
  status: 'Pending' | 'Paid' | 'Cancelled';
  due_date: string; // Consider using Date type if preferred
  created_at: string; // Consider using Date type if preferred
  payment_method: string;
}

export const InvoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "shipment_id",
    header: "Shipment ID",
  },
  {
    accessorKey: "bid_id",
    header: "Bid ID",
  },
  {
    accessorKey: "customer_id",
    header: "Customer ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(new Date(value), 'MM/dd/yyyy'); // Format as needed
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <Button className={`bg-black text-white border shadow-sm w-[120px] ${invoice.status==='Cancelled' && 'bg-red-300'}`} disabled={invoice.status==='Paid'}>
            { invoice.status === 'Pending' ? <PayNowPopup/> : invoice.status === 'Cancelled' ? 'Cancelled' : 'Paid' }
      </Button>
      );
    },
  },
];