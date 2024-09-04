import { Button } from '@/components/ui/button';
import { Calendar, FileBoxIcon, LocateIcon, Package, Phone } from 'lucide-react';
import { MdEmail, MdProductionQuantityLimits } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiLocationArrow1 } from "react-icons/ci";
import { AiFillPhone } from "react-icons/ai";
import TruckShipmentImage from '@/assets/truck-shipment.png';
import React, { useEffect } from "react";
import mapImage from '@/assets/map-image.jpg'
import { useWindowSize } from './NewShipment';
import clsx from 'clsx';
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

export default function NewShipmentDetailsPage({ shipment }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();

    useEffect(() => {
        if (width >= 1024) {
            navigate('/new-shipment');
        }
    }, [width, navigate]);

    shipment = shipment || shipments.find((s) => s.id === parseInt(id, 10));
    console.log(shipment.loadCapacity);
    if (!shipment) {
        return <div>Shipment not found</div>;
    }

    return (
        <div className="pl-4 p-4">
            <div className="bg-black bg-opacity-25 text-gray-200 shadow-md p-4 rounded-lg">
                <div className='flex justify-between'>
                    <div>
                        <h2 className="text-2xl uppercase font-semibold">{shipment.number}</h2>
                    </div>
                    <div className='flex gap-4'>
                        <Button className='bg-black bg-opacity-60'>
                            <Phone size={16} className='mr-2 '/>
                            Phone
                        </Button>
                        <Button className='bg-black bg-opacity-60'>
                            <MdEmail size={16} className='mr-2 '/>
                            Email
                        </Button>
                    </div>
                </div>
                <Tabs defaultValue="information" className="w-full mt-4">
                    <TabsList className='bg-transparent gap-4 '>
                        <TabsTrigger
                            className='data-[state=active]:border-b-2 text-gray-300 data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-rose-400'
                            value="information">Information</TabsTrigger>
                        <TabsTrigger
                            className='data-[state=active]:border-b-2  text-gray-300 data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-rose-400'
                            value="Vehicle Info">Vehicle Info</TabsTrigger>
                        <TabsTrigger
                            className='data-[state=active]:border-b-2 text-gray-300 data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-rose-400'
                            value="Billing">Billing</TabsTrigger>
                    </TabsList>
                    <TabsContent value="information">
                        <div className="flex flex-col p-2 py-4">
                            <h4 className="flex items-center justify-between text-gray-300">
                                Request Details <span className="py-2 text-sm text-grey">Tracking ID: {shipment.number}</span>
                            </h4>
                            <div className="flex items-center space-x-* ">
                                <div className="w-full flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-gray-300">Truck Type:</h4>
                                    <p className="text-sm text-gray-300">Flatbed</p>
                                </div>
                                <img src={TruckShipmentImage} alt="truck" className="w-20"/>
                            </div>
                            <h2 className="mb-2 text-2xl font-bold uppercase text-gray-300">$ 1500</h2>
                            <div className="flex items-center gap-2 mb-2">
                                <CiLocationArrow1 className="mr-0 p-1 bg-green-300 rounded-full text-blue-500" size={26}/>
                                <h4 className="text-sm font-bold text-gray-300">From:</h4>
                                <p className="text-sm text-gray-300">Athens, GRC</p>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <LocateIcon className="mr-0 p-1 bg-red-300 rounded-full text-blue-500" size={26}/>
                                <h2 className="text-sm font-bold text-gray-300">To:</h2>
                                <p className="text-sm text-gray-300">Tallinn, EST</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Calendar className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500" size={24}/>
                                    <h2 className="text-xs font-bold text-gray-300">Pickup:</h2>
                                    <p className="text-sm text-gray-300">2023-10-01</p>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500" size={24}/>
                                    <h2 className="text-xs font-bold text-gray-300">Drop:</h2>
                                    <p className="text-sm text-gray-300">2023-10-05</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdProductionQuantityLimits className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24}/>
                                    <h4 className="text-xs font-bold text-gray-300">Quantity</h4>
                                    <p className="text-sm text-gray-300">10</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24}/>
                                    <h2 className="text-xs font-bold text-gray-300">Type of Package:</h2>
                                    <p className="text-sm text-gray-300">Wood box</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileBoxIcon className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24}/>
                                    <h2 className="text-xs font-bold text-gray-300">Body Type:</h2>
                                    <p className="text-sm text-gray-300">Open</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AiFillPhone className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24}/>
                                    <h4 className="text-xs font-bold text-gray-300">Drop Contact:</h4>
                                    <p className="text-sm text-gray-300">+1234567890</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AiFillPhone className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24}/>
                                    <h2 className="text-xs font-bold text-gray-300">Pickup Contact:</h2>
                                    <p className="text-sm text-gray-300">+0987654321</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="Vehicle Info">
                        <div className="space-y-4">
                            <div className="flex space-x-2">
                                <img src={TruckShipmentImage} alt="truck" className="rounded-lg w-16 h-16 object-contain"/>
                                <img src={TruckShipmentImage} alt="truck" className="rounded-lg w-16 h-16 object-contain"/>
                                <img src={TruckShipmentImage} alt="truck" className="rounded-lg w-16 h-16 object-contain"/>
                                <img src={TruckShipmentImage} alt="truck" className="rounded-lg w-16 h-16 object-contain"/>
                            </div>
                            <div className="p-4 rounded-lg">
                                <h3 className="text-lg text-gray-200 font-semibold">Load Capacity</h3>
                                <div className="relative w-full my-2">
                                    <img src={TruckShipmentImage} alt="truck" className="w-full"/>
                                    <div
                                        className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-60">
                                        <div
                                            className={clsx(
                                                'h-16 max-w-[300px] bg-green-500 text-white flex items-center justify-center rounded',
                                                {
                                                    [`w-[${shipment.loadCapacity}%]`]: shipment.loadCapacity
                                                }
                                            )}
                                        >
                                            {shipment.loadCapacity}% Load Capacity
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 mt-2 gap-4">
                                    <div className="flex flex-col bg-black bg-opacity-25 rounded p-2">
                                    <h4 className="text-sm font-semibold mb-1">Truck</h4>
                                        <p className='font-bold text-base'>Iveco 80E190</p>
                                    </div>
                                    <div className="flex flex-col bg-black bg-opacity-25 rounded p-2">
                                        <h4 className="text-sm font-semibold mb-1">Weight</h4>
                                        <p className='font-bold text-base'>7,340 kg</p>
                                    </div>
                                    <div className="flex flex-col bg-black bg-opacity-25 rounded p-2">
                                        <h4 className="text-sm font-semibold mb-1">Pallets</h4>
                                        <p className='font-bold text-base'>13/20</p>
                                    </div>
                                    <div className="flex flex-col bg-black bg-opacity-25 rounded p-2">
                                        <h4 className="text-sm font-semibold mb-1">Space</h4>
                                        <p className='font-bold text-base'>65\% / 35\%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg">
                                <h3 className="text-lg font-semibold">Route Map</h3>
                                <img src={mapImage} alt="Route Map" className="w-full h-[300px] rounded-lg"/>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="Billing">Change your billing Info here.</TabsContent>
                </Tabs>
            </div>
        </div>
    );
}