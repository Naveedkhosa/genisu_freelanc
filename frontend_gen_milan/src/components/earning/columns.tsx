import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';

// Define the DriverPaymentsIn interface
export interface PaymentsIn {
  id: number;
  driver_id: number;
  shipment_id: number;
  invoice_payment_id: number;
  amount: number;
  payment_date: string; // Consider using Date type if preferred
}

// Define the DriverPaymentsOut interface
export interface PaymentsOut {
  id: number;
  driver_id: number;
  amount: number;
  payment_date: string; // Consider using Date type if preferred
  payment_method: string;
  transaction?: string; // Optional field
}

// Define the columns for DriverPaymentsIn
export const PaymentsInColumns: ColumnDef<PaymentsIn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "driver_id",
    header: "Driver ID",
  },
  {
    accessorKey: "shipment_id",
    header: "Shipment ID",
  },
  {
    accessorKey: "invoice_payment_id",
    header: "Invoice Payment ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "payment_date",
    header: "Payment Date",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return format(new Date(value), 'MM/dd/yyyy, p'); // Format as needed
    },
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <Button className="bg-black text-white border shadow-sm w-[120px]">
  //         {payment.amount > 1000 ? 'High Payment' : 'Normal Payment'}
  //       </Button>
  //     );
  //   },
  // },
];

// Define the columns for DriverPaymentsOut
export const PaymentsOutColumns: ColumnDef<PaymentsOut>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "driver_id",
    header: "Driver ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "payment_date",
    header: "Payment Date",
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
    accessorKey: "transaction",
    header: "Transaction",
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <Button className="bg-black text-white border shadow-sm w-[120px]">
  //         {payment.payment_method === 'Credit Card' ? 'Credit Card Payment' : 'Other Payment'}
  //       </Button>
  //     );
  //   },
  // },
];
