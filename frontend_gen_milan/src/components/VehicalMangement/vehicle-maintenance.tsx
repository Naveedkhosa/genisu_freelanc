import { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import { toast } from "sonner";
import baseClient from '@/services/apiClient';

const VehicleMaintenance = () => {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
        vehicle_id: '',
        maintenance_date: '',
        details: '',
        cost: ''
    });
    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        // Fetch vehicles when the component mounts
        baseClient.get('all_vehicles')
            .then(response => {
                setVehicles(response.data);
            })
            .catch(error => {
                console.error('Error fetching vehicles:', error);
                toast.error('Failed to fetch vehicles');
            });
    }, []);

    const handleChange = (e:any) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleVehicleChange = (value:any) => {
        setFormData({
            ...formData,
            vehicle_id: value
        });
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        baseClient.post('vehicle-maintenance', formData)
            .then(_ => {
                toast.success('Maintenance record saved successfully');
                // Reset form or perform any additional actions
                setFormData({
                    vehicle_id: '',
                    maintenance_date: '',
                    details: '',
                    cost: ''
                })
                setPopoverOpen(false);
                setTimeout(() => {
                    window.location.reload();
                },2000);
            })
            .catch(error => {
                console.error('Error saving maintenance record:', error);
                toast.error('Failed to save maintenance record');
            });
    };

    return (
        <div className='flex text-black'>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button className='flex gap-1  text-white bg-black bg-opacity-25'>
                        <PlusIcon size={15} />
                        <span className='text-xs md:text-base'>Vehicle Maintenance</span>
                    </Button>
                </PopoverTrigger>
                <div className='flex justify-center w-full h-full'>
                    <PopoverContent className="lg:w-[700px] w-[300px] popup-for-rocket-user bg-white p-4">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="vehicle_id">Vehicle ID</Label>
                                <Select value={formData.vehicle_id} onValueChange={handleVehicleChange}>
                                    <SelectTrigger className="w-[140px] outline-none border focus:outline-none active:outline-none">
                                        <SelectValue placeholder="Select vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Vehicle</SelectLabel>
                                            {vehicles.map((vehicle :any) => (
                                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.vehicle_number}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="maintenance_date">Maintenance Date</Label>
                                <Input
                                    id="maintenance_date"
                                    type="date"
                                    className="h-8 col-span-2"
                                    value={formData.maintenance_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="details">Details</Label>
                                <Input
                                    id="details"
                                    className="h-8 col-span-2"
                                    value={formData.details}
                                    onChange={handleChange}
                                    placeholder="Enter maintenance details"
                                />
                            </div>

                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="cost">Cost</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    step="0.01"
                                    className="h-8 col-span-2"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    placeholder="Enter cost"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => {
                                    setPopoverOpen(false);
                                }}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </PopoverContent>
                </div>
            </Popover>
        </div>
    );
};

export default VehicleMaintenance;
