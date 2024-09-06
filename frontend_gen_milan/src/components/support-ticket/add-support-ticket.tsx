import { useState, useEffect } from 'react';
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
import { toast } from "sonner";
import baseClient from '@/services/apiClient';
import { useTranslation } from "react-i18next";

const AddSupportTicket = () => {
    const { t } = useTranslation("global");
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Open');
    const [userId, setUserId] = useState(null);
    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
            setUserId(user.id);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error(t('support_ticket.User not found'));
            return;
        }

        const data = {
            user_id: userId,
            subject,
            description,
            status,
        };

        baseClient.post('support-tickets', data)
            .then(_ => {
                toast.success(t('support_ticket.Support ticket added successfully'));
                setSubject('');
                setDescription('');
                setStatus('Open');
                setPopoverOpen(false);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch(error => {
                console.error('Error adding support ticket:', error);
                toast.error(t('support_ticket.Failed to add support ticket'));
            });
    };

    return (
        <div className='flex text-black'>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button className='flex gap-1 bg-black bg-opacity-25 text-white'>
                        <PlusIcon size={15} /> <span>{t('support_ticket.Add Support Ticket')}</span>
                    </Button>
                </PopoverTrigger>
                <div className='flex justify-center w-full h-full'>
                    <PopoverContent className="md:-[700px] popup-for-rocket-user bg-primary-200 sm: w-full">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-4">
                            <div className="md:grid text-white w-full  md:items-center grid-cols-3 gap-4 sm: flex flex-col items-start">
                                <Label htmlFor="subject">{t('support_ticket.Subject')}</Label>
                                <Input
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (/^[a-zA-Z\s]*$/.test(newValue)) { // Allows only letters and spaces
                                            setSubject(newValue);
                                        }
                                    }}
                                    className="h-8 col-span-2 bg-black bg-opacity-25 text-white"
                                    placeholder={t("support_ticket.Enter subject")}
                                />

                            </div>

                            <div className="md:grid text-white w-full  md:items-center grid-cols-3 gap-4 sm: flex flex-col items-start">
                                <Label htmlFor="description">{t('support_ticket.Description')}</Label>
                                <Textarea
                                    placeholder={t("support_ticket.Type your message here.")}
                                    id="description"
                                    value={description}
                                    className="h-8 col-span-2 bg-black bg-opacity-25 text-white"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button className='bg-white text-red-600' type="button" variant="outline" onClick={() => {
                                    setPopoverOpen(false);
                                }}>
                                    {t('support_ticket.Cancel')}
                                </Button>
                                <Button className='bg-white' type="submit">
                                    {t('support_ticket.Save')}
                                </Button>
                            </div>
                        </form>
                    </PopoverContent>
                </div>
            </Popover>
        </div>
    )
}

export default AddSupportTicket;
