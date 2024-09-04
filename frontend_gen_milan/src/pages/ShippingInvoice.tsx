import Truck from '@/assets/truck.png'

function ShippingInvoice() {
    return (
        <div>
            <div className="max-w-[1000px] w-full border border-gray-500 mt-3 mx-auto p-8 text-gray-200 rounded-md bg-black bg-opacity-25">
                {/* Title */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='overflow-hidden rounded-full w-14 h-14 '>
                        <img src={Truck} alt="logo" className="object-cover w-full"/>
                    </div>
                    <h2 className="text-2xl font-bold lg:text-3xl ">Shipping Invoice</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* From Section */}
                    <div>
                        <h3 className="text-xl font-semibold">From</h3>
                        <p>Saldo Apps</p>
                        <p>John Smith</p>
                        <p>wiz@saldoapps.com</p>
                        <p>80296975957</p>
                        <p>saldoapps.com</p>
                        <p>First str, 28-32, Chicago, USA</p>

                    </div>

                    {/* Bill To Section */}
                    <div>
                        <h3 className="text-xl font-semibold">Bill to</h3>
                        <p>Shepard corp.</p>
                        <p>shepard@mail.com</p>
                        <p>80296975957</p>
                        <p>North str, 32, Chicago, USA</p>
                        <p>Track #: RO80296975957</p>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold">Ship to</h3>
                            <p>North str, 32, Chicago, USA</p>
                        </div>
                    </div>
                </div>

                {/* Ship To Section */}


                {/* Invoice Details */}
                <div className="flex justify-between mt-8">
                    <div>
                        <p>Invoice no.: <span className="font-semibold">001</span></p>
                        <p>Invoice date: <span className="font-semibold">Jul 13th, 2021</span></p>
                    </div>
                    <div>
                        <p>Due: <span className="font-semibold">Feb 13th, 2021</span></p>
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
                            <td className="px-4 py-2 border border-gray-300">Prototype</td>
                            <td className="px-4 py-2 border border-gray-300">$20,230.45</td>
                            <td className="px-4 py-2 border border-gray-300">$4,000.00</td>
                            <td className="px-4 py-2 border border-gray-300">$500.00</td>
                            <td className="px-4 py-2 border border-gray-300">$24,730.45</td>
                        </tr>
                        {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ShippingInvoice;