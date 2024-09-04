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

const AddTruckBodyType = () => {
    const { t } = useTranslation("global"); // Initialize useTranslation
    const [name, setName] = useState('');
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const data = {
            name,
        };

        try {
            await baseClient.post('/truck-body-types', data);
            toast.success(t('add_truck_body_type.Truck Body Type added successfully'));
            setPopoverOpen(false);
            setName(''); // Reset the input field after successful submission
            setTimeout(() => {
                window.location.reload(); // Reload the page after 1.5 seconds
            }, 1500); // 1.5 seconds delay
        } catch (error) {
            console.error('Error adding truck body type:', error);
            toast.error(t('add_truck_body_type.Failed to add truck body type'));
        }
    };

    return (
        <div className='flex text-black'>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button className='flex gap-1 text-white bg-black bg-opacity-25'><PlusIcon size={15} /> <span>{t('add_truck_body_type.Add Truck Body Type')}</span></Button>
                </PopoverTrigger>
                <div className='flex justify-center w-full h-full'>
                    <PopoverContent className="w-[700px] popup-for-rocket-user  bg-primary-200 text-white">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-4">
                            <div className="grid items-center grid-cols-3 gap-4">
                                <Label htmlFor="name">{t('add_truck_body_type.Name')}</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-8 col-span-2"
                                    placeholder={t('add_truck_body_type.Enter Truck Body Type Name')}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button className='bg-white text-red-400'  type="button" variant="outline" onClick={() => {
                                    setPopoverOpen(false);
                                }}>
                                    {t('add_truck_body_type.Cancel')}
                                </Button>
                                <Button  className='bg-white text-green-400'  type="submit">
                                    {t('add_truck_body_type.Save')}
                                </Button>
                            </div>
                        </form>
                    </PopoverContent>
                </div>
            </Popover>
        </div>
    )
}

export default AddTruckBodyType;
