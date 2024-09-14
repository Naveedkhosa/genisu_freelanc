import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '../ui/button'
import { PlusIcon, UploadCloud } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import baseClient from '@/services/apiClient';
import { useState } from 'react';

const AddVehicle = () => {
    const [vehicle_number, set_vehicle_number] = useState('');
    const [model, set_model] = useState('');
    const [owner, set_owner] = useState('');
    const [year, set_year] = useState('');
    const [status, set_status] = useState('');
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (e : any) => {
                setFileContent(e.target?.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    const currentYear = new Date().getFullYear();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const vehicle_data = {
            vehicle_number,
            model,
            owner,
            year,
            status
        };
        try {
            const response = await baseClient.post('/vehicles', vehicle_data);
            toast('Vehicle created successfully:', response.data);
            // Reset form fields
            set_vehicle_number('');
            set_model('');
            set_owner('');
            set_year('');
            set_status('');
            // Close the Popover
            setPopoverOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            toast('Error creating Vehicle:');
            // Handle error
        }
    }

    return (
        <div className='flex text-black'>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button className='flex gap-1 text-white bg-black bg-opacity-25'>
                        <PlusIcon size={15} />
                        <span className='text-xs md:text-base'>Add Vehicle</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="lg:w-[700px] w-[300px] popup-for-rocket-user bg-primary-200 text-white p-4">
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="vehicle_number">Vehicle Number</Label>
                                <Input
                                    id="vehicle_number"
                                    className="h-8 col-span-2 bg-black bg-opacity-25"
                                    placeholder="Enter vehicle number"
                                    onChange={(e) => set_vehicle_number(e.target.value)}
                                />
                            </div>

                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="model">Model</Label>
                                <Input
                                    id="model"
                                    className="h-8 col-span-2 bg-black bg-opacity-25"
                                    placeholder="Enter vehicle model"
                                    onChange={(e) => set_model(e.target.value)}
                                />
                            </div>

                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="owner">Owner</Label>
                                <Input
                                    id="owner"
                                    className="h-8 col-span-2 bg-black bg-opacity-25"
                                    placeholder="Enter vehicle owner"
                                    onChange={(e) => set_owner(e.target.value)}
                                />
                            </div>
                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="owner">Year</Label>
                                <Select value={year} onValueChange={set_year}>
                                    <SelectTrigger className="w-[140px] outline-none bg-black bg-opacity-25 border focus:outline-none active:outline-none">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Year</SelectLabel>
                                            {Array.from({ length: currentYear - 1999 }, (_, index) => (
                                                // @ts-ignore
                                                <SelectItem key={index} value={currentYear - index}>
                                                    {currentYear - index}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="document">Upload Document</Label>
                                <label className="flex items-center gap-2 px-3 py-1 border rounded cursor-pointer w-[140px]">
                                    <UploadCloud size={16} />
                                    <span className="text-sm">Upload</span>
                                    <input type="file" id="document" onChange={handleFileChange} className="hidden" />
                                </label>

                                {file && (
                                    <div className="col-span-3">
                                        <p>File Name: {file.name}</p>
                                        <p>File Size: {(file.size / 1024).toFixed(2)} KB</p>
                                        {fileContent && (
                                            <div className='w-[300px] h-[200px] overflow-hidden relative mt-2'>
                                                <p>File Content:</p>
                                                <img src={fileContent as string} alt="file content" className="w-full h-full object-cover border" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="status">Status</Label>
                                <Select value={status} onValueChange={set_status}>
                                    <SelectTrigger className="w-[140px] bg-black bg-opacity-25 outline-none border focus:outline-none active:outline-none">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="Available">Available</SelectItem>
                                            <SelectItem value="In Maintenance">In Maintenance</SelectItem>
                                            <SelectItem value="Assigned">Assigned</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button className='bg-white text-red-500' type="button" variant="outline" onClick={() => {
                                    setPopoverOpen(false);
                                }}>
                                    Cancel
                                </Button>
                                <Button className='bg-white text-green-400' type="submit">
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default AddVehicle;
