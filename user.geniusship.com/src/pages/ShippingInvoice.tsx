import React, { useRef } from 'react';
import Truck from '@/assets/truck.png';

function ShippingInvoice({ shipment }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=900,height=650');
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (err) {
          return '';
        }
      })
      .join('');
  
    windowPrint.document.write(`
      <html>
        <head>
          <title>Shipping Invoice</title>
          <style>
            ${styles}
            table, th, td {
              border: 1px solid black;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              text-align: left;
              color: white; /* Set text color to white */
            }
            body {
              color: white; /* Ensure body text color is white */
              background-color: black; /* Ensure background is black */
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
  
    windowPrint.document.close();
    windowPrint.onload = () => {
      windowPrint.focus();
      windowPrint.print();
      windowPrint.onafterprint = () => {
        windowPrint.close();
      };
    };
  };
  
 
  return (
    <div>
      <div ref={printRef} className="max-w-[1000px] w-full border border-gray-500 mt-3 mx-auto p-8 text-gray-200 rounded-md bg-black bg-opacity-25">
        {/* Title */}
        <div className='flex items-center gap-3 mb-8'>
          <div className='overflow-hidden rounded-full w-14 h-14 '>
            <img src={Truck} alt="logo" className="object-cover w-full" />
          </div>
          <h2 className="text-2xl font-bold lg:text-3xl">Shipping Invoice</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* From Section */}
          <div>
            <h3 className="text-xl font-semibold">Pickup From</h3>
            <p>{shipment.pickup_contact_name}</p>
            <p>{shipment.pickup_contact_phone}</p>
            <p>{shipment.pickup_address}</p>
          </div>

          {/* Bill To Section */}
          <div>
            <h3 className="text-xl font-semibold">Bill to</h3>
            <p>{shipment.drop_contact_name}</p>
            <p>{shipment.drop_contact_phone}</p>
            <p>Track #: {shipment.tracking_number}</p>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Ship to</h3>
              <p>{shipment.destination_address}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="flex justify-between mt-8">
          <div>
            <p>Invoice no: <span className="font-semibold">{Math.ceil(Math.random() * 1000000000)}</span></p>
            <p>Invoice date: <span className="font-semibold">{new Date().toISOString().split("T")[0]}</span></p>
          </div>
          <div>
            <p>Due: <span className="font-semibold">{shipment.destination_date}</span></p>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border border-collapse border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Shipment</th>
                <th className="px-4 py-2 border border-gray-300">Shipment Fare</th>
                <th className="px-4 py-2 border border-gray-300">Shipment Tax</th>
                <th className="px-4 py-2 border border-gray-300">Shipment Fee</th>
                <th className="px-4 py-2 border border-gray-300">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border border-gray-300">{shipment.tracking_number}</td>
                <td className="px-4 py-2 border border-gray-300">${shipment.expected_price}</td>
                <td className="px-4 py-2 border border-gray-300">$0</td>
                <td className="px-4 py-2 border border-gray-300">$0</td>
                <td className="px-4 py-2 border border-gray-300">{shipment.expected_price}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    <div className="flex justify-center">
      <button onClick={handlePrint} className="mt-4 px-7 py-2 bg-blue-950 text-white rounded">
        Print Invoice
      </button>
    </div>
    </div>
  );
}

export default ShippingInvoice;
