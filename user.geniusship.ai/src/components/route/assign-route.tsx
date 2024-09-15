import { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
    SelectValue
} from "@/components/ui/select";
import { FaCalendarAlt } from 'react-icons/fa';
import { toast } from "sonner";
import baseClient from '@/services/apiClient';

const AssignRoute = () => {
    const [routes, setRoutes] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [transporter, setTransporter] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedDriver, setSelectedDriver] = useState('');
    
    // Load current user from localStorage
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser?.role === 'Transporter') {
            setTransporter(currentUser?.id);
        }
    }, []);
    
    useEffect(() => {
        
        baseClient.get(`transporter_drivers/${transporter}`)
            .then(response => {
                //@ts-ignore
                setDrivers(response.data); // Assuming only one driver per vehicle
            })
            .catch(error => {
                console.error('Error fetching driver:', error);
                toast.error('Failed to fetch driver');
            });


    }, [transporter]);

    useEffect(() => {
        // Fetch available routes
        baseClient.get('routes')
            .then(response => {
                setRoutes(response.data);
            })
            .catch(error => {
                console.error('Error fetching routes:', error);
                toast.error('Failed to fetch routes');
            });

        // Fetch available vehicles
        baseClient.get('vehicles')
            .then(response => {
                setVehicles(response.data);
            })
            .catch(error => {
                console.error('Error fetching vehicles:', error);
                toast.error('Failed to fetch vehicles');
            });
    }, []);

    const handleVehicleChange = (value:any) => {
        setSelectedVehicle(value);

        // Fetch driver based on selected vehicle
        // baseClient.get(`vehicles/${value}/driver`)
        //     .then(response => {
        //         //@ts-ignore
        //         setDrivers([response.data]); // Assuming only one driver per vehicle
        //     })
        //     .catch(error => {
        //         console.error('Error fetching driver:', error);
        //         toast.error('Failed to fetch driver');
        //     });
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        const data = {
            route_id: selectedRoute,
            vehicle_id: selectedVehicle,
            driver_id: selectedDriver
        };

        baseClient.post(`route-assignments/${selectedRoute}`, data)
            .then(_ => {
                toast.success('Route assigned successfully');
                // Reset form data if needed
                setSelectedRoute('');
                setSelectedVehicle('');
                setSelectedDriver('');
            })
            .catch(error => {
                console.error('Error assigning route:', error);
                toast.error('Failed to assign route');
            });
    };

    return (
        <div className='flex text-black'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className='flex gap-1 bg-black bg-opacity-25 text-white'><PlusIcon size={15} /> <span>Assign Route</span></Button>
                </PopoverTrigger>
                <div className='flex justify-center w-full h-full'>
                    <PopoverContent className="lg:w-[700px] w-[300px] popup-for-rocket-user text-white bg-primary-200">
                        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Assign Route</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set the details for the route.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid items-center grid-cols-3 gap-4">
                                    <Label htmlFor="route_id">Route ID</Label>
                                    <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                                        <SelectTrigger className="bg-black bg-opacity-25 relative w-[180px] outline-none border focus:outline-none active:outline-none pl-10">
                                            <FaCalendarAlt className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                                            <SelectValue placeholder="Select Route ID" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Routes</SelectLabel>
                                                {routes.map((route : any)=> (
                                                    <SelectItem key={route.id} value={route.id}>
                                                        {route.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid items-center grid-cols-3 gap-4">
                                    <Label htmlFor="vehicle_id">Vehicle ID</Label>
                                    <Select value={selectedVehicle} onValueChange={handleVehicleChange}>
                                        <SelectTrigger className=" bg-black bg-opacity-25 relative w-[180px] outline-none border focus:outline-none active:outline-none pl-10">
                                            <FaCalendarAlt className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                                            <SelectValue placeholder="Select Vehicle ID" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Vehicles</SelectLabel>
                                                {vehicles.map((vehicle :any )=> (
                                                    <SelectItem key={vehicle.id} value={vehicle.id}>
                                                        {vehicle.vehicle_number}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid items-center grid-cols-3 gap-4">
                                    <Label htmlFor="driver_id">Driver ID</Label>
                                    <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                                        <SelectTrigger className="bg-black bg-opacity-25 relative w-[180px] outline-none border focus:outline-none active:outline-none pl-10">
                                            <FaCalendarAlt className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                                            <SelectValue placeholder="Select Driver ID" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Drivers</SelectLabel>
                                                {drivers.map((driver:any) => (
                                                    <SelectItem key={driver.id} value={driver.id}>
                                                        {driver.name} {/* Assuming the driver has a name property */}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button   className='bg-white text-red-500 ' type="button" variant="outline" onClick={() => {/* Handle cancel */ }}>
                                        Cancel
                                    </Button>
                                    <Button className='bg-white text-green-500' type="submit">
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </PopoverContent>
                </div>
            </Popover>
        </div>
    );
}

export default AssignRoute;