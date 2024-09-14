import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import baseClient from '@/services/apiClient';

const AddRoute = () => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_location: '',
        end_location: '',
        distance_km: '',
        estimated_time_minutes: '',
        cost: ''
    });

    const handleChange = (e:any) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        baseClient.post('routes', formData)
        //@ts-ignore
            .then(response => {
                toast.success('Route added successfully');
                setPopoverOpen(false);
                // Reset form data if needed
                setFormData({
                    name: '',
                    description: '',
                    start_location: '',
                    end_location: '',
                    distance_km: '',
                    estimated_time_minutes: '',
                    cost: ''
                });
                setTimeout(() => {
                    window.location.reload();
                },2000);
            })
            .catch(error => {
                console.error('Error adding route:', error);
                toast.error('Failed to add route');
            });
    };

    return (
        <div className='flex text-black'>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button className='flex gap-1 bg-black bg-opacity-25 text-white'><PlusIcon size={15} /> <span>Add Route </span></Button>
                </PopoverTrigger>
                <div className='flex justify-center w-full h-full'>
                    <PopoverContent className="lg:w-[700px] w-[300px] popup-for-rocket-user bg-primary-200  text-white">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Add Route</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Set the details for the route.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 p-4">
                                    <div className="grid items-center grid-cols-3 gap-4">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            className="h-8 bg-black bg-opacity-25 col-span-2"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter route name"
                                        />
                                    </div>
                                    <div className="grid items-center grid-cols-3 gap-4">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            className="h-8 bg-black bg-opacity-25 col-span-2"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Description"
                                        />
                                    </div>

                                    <div className="grid items-center grid-cols-3 gap-4">
                                        <Label htmlFor="start_location">Start Location</Label>
                                        <Input
                                            id="start_location"
                                            className="h-8 bg-black bg-opacity-25 col-span-2"
                                            value={formData.start_location}
                                            onChange={handleChange}
                                            placeholder="Enter start location"
                                        />
                                    </div>

                                    <div className="grid items-center grid-cols-3 gap-4">
                                        <Label htmlFor="end_location">End Location</Label>
                                        <Input
                                            id="end_location"
                                            className="h-8 bg-black bg-opacity-25 col-span-2"
                                            value={formData.end_location}
                                            onChange={handleChange}
                                            placeholder="Enter end location"
                                        />
                                    </div>

                                    <div className="grid items-center grid-cols-3 gap-4">
                                        <Label htmlFor="distance_km">Distance (km)</Label>
                                        <Input
                                            id="distance_km"
                                            type="number"
                                            className="h-8 bg-black bg-opacity-25 col-span-2"
                                            value={formData.distance_km}
                                            onChange={handleChange}
                                            placeholder="Enter distance in kilometers"
                                        />
                                    </div>

                                    <div className="grid items-center grid-cols-3 gap-4">
                                        <Label htmlFor="estimated_time_minutes">Estimated Time (minutes)</Label>
                                        <Input
                                            id="estimated_time_minutes"
                                            type="number"
                                            className="h-8 bg-black bg-opacity-25 col-span-2"
                                            value={formData.estimated_time_minutes}
                                            onChange={handleChange}
                                            placeholder="Enter estimated time in minutes"
                                        />
                                    </div>

                                    <div className="grid items-center grid-cols-3 gap-4">
                                        <Label htmlFor="cost">Cost</Label>
                                        <Input
                                            id="cost"
                                            type="number"
                                            className="h-8 col-span-2 bg-black bg-opacity-25"
                                            value={formData.cost}
                                            onChange={handleChange}
                                            placeholder="Enter cost"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button  className='bg-white text-red-500 ' type="button" variant="outline" onClick={() => {
                                            setPopoverOpen(false);
                                        }}>
                                            Cancel
                                        </Button>
                                        <Button className='bg-white text-green-500' type="submit">
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </PopoverContent>
                </div>
            </Popover>
        </div>
    )
}

export default AddRoute;
