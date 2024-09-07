import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import { toast } from "sonner";
import baseClient from '@/services/apiClient';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const AddTruckType = () => {
    const { t } = useTranslation("global"); // Initialize useTranslation
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const data = {
            name,
            capacity
        };

        baseClient.post('/truck-types', data)
            .then(_ => {
                toast.success(t('add_truck_type.Truck Type added successfully'));
                setPopoverOpen(false);
                setName(''); // Reset the input field after successful submission
                setTimeout(() => {
                    window.location.reload();
                }, 1500); // Reload the page after 1.5 seconds
            })
            .catch(error => {
                console.error('Error adding truck type:', error);
                toast.error(t('add_truck_type.Failed to add truck type'));
            });
    };

    return (
        <div className='flex text-black'>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button className='flex gap-1  text-white bg-black bg-opacity-25'><PlusIcon size={15} /> <span>{t('add_truck_type.Add Truck Type')}</span></Button>
                </PopoverTrigger>
                <div className='flex justify-center w-full h-full'>
                    <PopoverContent className="w-[700px] popup-for-rocket-user bg-primary-200 text-white">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-4">
                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="name">{t('add_truck_type.Name')}</Label>
                                <Input
                                    id="name"
                                    style={{color: 'black'}}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-8 col-span-2"
                                    placeholder={t('add_truck_type.Enter Truck Type Name')}
                                />
                            </div>
                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="capacity">Truck Capacity</Label>
                                <Input
                                style={{color: 'black'}}
                                    id="capacity"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="h-8 col-span-2"
                                    placeholder={t('add_truck_type.Enter Truck Capacity')}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button className='bg-white text-red-400'  type="button" variant="outline" onClick={() => {
                                    setPopoverOpen(false);
                                }}>
                                    {t('add_truck_type.Cancel')}
                                </Button>
                                <Button  className='bg-white text-green-400'  type="submit">
                                    {t('add_truck_type.Save')}
                                </Button>
                            </div>
                        </form>
                    </PopoverContent>
                </div>
            </Popover>
        </div>
    )
}

export default AddTruckType;
