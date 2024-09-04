import  {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TruckShipmentImage from '@/assets/truck-shipment.png';
import { Separator } from '@/components/ui/separator';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import NewShipmentDetailsPage from "@/pages/NewShipmentDetail.tsx";
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Package } from 'lucide-react';
const shipments = [
    {
        id: 1,
        number: 'UA-145009BS',
        locations: ['Athens, GRC', 'Tallinn, EST'],
        buyer: 'Milton Hines',
        imageUrl: 'https://via.placeholder.com/64',
        loadCapacity: 40,
        status: 'pending'
    },
    {
        id: 2,
        number: 'MK-549893XC',
        locations: ['Yingkou, CHN', 'Abu Dhabi, UAE'],
        buyer: 'Gary Muncy',
        imageUrl: 'https://via.placeholder.com/64',
        loadCapacity: 70,
        status: 'intransit'
    },
    {
        id: 3,
        number: 'XY-123456AB',
        locations: ['New York, USA', 'London, UK'],
        buyer: 'John Doe',
        imageUrl: 'https://via.placeholder.com/64',
        loadCapacity: 55,
        status: 'completed'
    },
    {
        id: 4,
        number: 'CD-789012EF',
        locations: ['Berlin, GER', 'Paris, FRA'],
        buyer: 'Jane Smith',
        imageUrl: 'https://via.placeholder.com/64',
        loadCapacity: 80,
        status: 'closed'
    },
    // Add more shipment data...
];

const statusStyles = {
    pending: 'bg-yellow-500',
    intransit: 'bg-blue-500',
    completed: 'bg-green-500',
    closed: 'bg-red-500'
};


const NewShipment = () => {
    const [selectedShipment, setSelectedShipment] = useState(null);
    const navigate = useNavigate();
    const { width } = useWindowSize();

    const handleCardClick = (shipmentId) => {
        const shipment = shipments.find((s) => s.id === shipmentId);
        setSelectedShipment(shipment);
        if (width < 1024) {
            navigate(`/new-shipment/${shipmentId}`);
        }
    };

    return (
        <div className="flex flex-col w-full px-2 md:pl-[84px] sm:pl-0">
            <FilterTabs />
            <main className="flex-1 flex flex-col lg:flex-row lg:items-start">
                <div className="w-full lg:w-1/2 p-4 grid grid-cols-1 gap-1 lg:gap-6 lg:grid-cols-2 ">
                    {shipments.map((shipment) => (
                        <div
                            key={shipment.id}
                            className="bg-black bg-opacity-25 shadow-md p-4 rounded-lg mb-4 cursor-pointer hover:bg-opacity-50"
                            onClick={() => handleCardClick(shipment.id)}
                        >
                            <div
                                className={`text-xs text-white mb-1 w-fit px-2 py-1 rounded ${statusStyles[shipment.status]}`}>
                                {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                            </div>
                            <div className="flex mb-1 items-center justify-between">
                                <div className='flex flex-col'>
                                    <h5 className='text-sm font-semibold text-gray-400'>Shipment number</h5>
                                    <h3 className="text-lg font-semibold text-gray-200">{shipment.number}</h3>
                                </div>
                                <img src={TruckShipmentImage} alt="truck" className="w-20"/>
                            </div>
                            <Separator className='my-2'/>
                            <div className='flex flex-col gap-4'>
                                <div className='flex gap-4'>
                                    <div
                                        className='bg-green-100 rounded-full w-10 h-10 flex items-center justify-center'>
                                        <ArrowUpRight className='text-green-400'/>
                                    </div>
                                    <div className='flex flex-col'>
                                        <h3 className="text-lg font-semibold text-gray-200">{shipment.locations[0]}</h3>
                                        <h5 className='text-sm text-gray-400'>{shipment.locations[1]}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-4 mt-2 mb-1'>
                                <div className='flex gap-4'>
                                    <div
                                        className='bg-rose-100 rounded-full w-10 h-10 flex items-center justify-center'>
                                        <ArrowDownLeft className='text-rose-400'/>
                                    </div>
                                    <div className='flex flex-col'>
                                        <h3 className="text-lg font-semibold text-gray-200 ">{shipment.locations[0]}</h3>
                                        <h5 className='text-sm text-gray-400'>{shipment.locations[1]}</h5>
                                    </div>
                                </div>
                            </div>
                            <Separator className='my-2'/>
                            <p className="text-gray-300 text-sm">Customer</p>
                            <p className="text-gray-200 font-bold">{shipment.buyer}</p>
                            <p className="text-gray-300 text-sm">LTD industries</p>

                        </div>
                    ))}
                </div>
                <div className="w-full hidden lg:block lg:w-1/2 p-4">
                    {selectedShipment ? (
                        <NewShipmentDetailsPage shipment={selectedShipment} />
                    ) : (
                        <div className="flex mt-6 flex-col items-center justify-center h-full text-gray-500">
                            <Package className="w-10 h-10 mb-2 text-gray-400"/>
                            <p className="text-lg font-semibold">Select a shipment to see details</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NewShipment;


export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};


const FilterTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status') || 'pending';

    const handleTabClick = (newStatus) => {
        searchParams.set('status', newStatus);
        navigate(`?${searchParams.toString()}`);
    };

    return (
        <div className="flex space-x-4 p-4 bg-gray-800 bg-opacity-25 mt-2 rounded-lg">
            {['pending', 'intransit', 'completed','closed'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={clsx(
                        'px-4 py-2 rounded-lg text-white',
                        {
                            'bg-green-500': status === tab,
                            'bg-gray-600': status !== tab
                        }
                    )}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );
};

