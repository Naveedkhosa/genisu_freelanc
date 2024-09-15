import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import baseClient from "@/services/apiClient";
import { toast } from "sonner";
import image from "@/assets/map.png";
import { useTranslation } from "react-i18next";

const SupportTicketOpening = () => {
    const { t } = useTranslation("global");
    const { id } = useParams();
    const [ticket, setTicket] = useState<any>(null);
    const [newMessage, setNewMessage] = useState("");

    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await baseClient.get(`/support-tickets/${id}`);
                setTicket(response.data);
            } catch (error) {
                toast(t('support_ticket_opening.Failed to load ticket'));
            }
        };

        fetchTicket();
    }, [id, t]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await baseClient.post(`/support-tickets/${id}/messages`, { message: newMessage });
            setTicket((prevTicket:any) => ({
                ...prevTicket,
                messages: [...prevTicket.messages, response.data]
            }));
            setNewMessage("");
            toast(t('support_ticket_opening.Message sent'));
        } catch (error) {
            toast(t('support_ticket_opening.Failed to send message'));
        }
    };

    if (!ticket) return <div>{t('support_ticket_opening.Loading')}</div>;

    return (
        <div className="w-full pb-8 px-4 pl-[84px]">
            <h2 className="my-4 text-2xl font-bold lg:my-6 text-gray-300">{t('support_ticket_opening.Support Ticket Opening')}</h2>
            <h4 className="mt-4 text-base font-semibold text-gray-300">{t('support_ticket_opening.Subject')}: {ticket.subject}</h4>
            <h6 className="mt-4 text-base font-semibold text-gray-300">{t('support_ticket_opening.Description')}: {ticket.description}</h6>
            <div className="flex flex-col gap-8 mt-6 lg:flex-row">
                <div className="flex-1 order-2 lg:order-1">
                    {ticket.messages.map((message:any) => {
                        let isTicketOwner = true;
                        if(message.user){
                            isTicketOwner = message.user?.id === ticket.user_id;
                        }else{
                            isTicketOwner = loggedInUser?.id === ticket.user_id;
                        }
                        return (
                            <div 
                                key={message.id} 
                                className={`mb-6 flex ${isTicketOwner ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                <div className={`flex items-center gap-2 lg:gap-4 ${isTicketOwner ? '' : 'flex-row-reverse'}`}>
                                    <div className="relative w-10 h-10 overflow-hidden border rounded-full lg:w-12 lg:h-12">
                                        <img src={image} alt={message.user?.name || loggedInUser.name} className="object-cover w-full h-full"/>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="font-semibold text-gray-800">{message.user?.name || loggedInUser.name}</h2>
                                        <p className="text-xs font-thin text-gray-500 lg:text-sm">{new Date(message.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className={`w-full p-4 mt-2 mx-2 text-sm font-normal bg-gray-100 rounded-md lg:mt-4 lg:text-base ${isTicketOwner ? 'text-left' : 'text-right'}`}>{message.message}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="order-1 lg:order-2 lg:w-[300px] w-full flex flex-col gap-4 border rounded-md p-4 bg-white shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <h4 className="font-semibold">{t('support_ticket_opening.Ticket ID')}</h4>
                        <p>{ticket.id}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <h4 className="font-semibold">{t('support_ticket_opening.Customer')}</h4>
                        <p>{ticket.user.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <h4 className="font-semibold">{t('support_ticket_opening.Status')}</h4>
                        <p className="px-2 py-1 text-center text-white bg-blue-500 rounded-xl">{ticket.status}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <h4 className="font-semibold">{t('support_ticket_opening.Created')}</h4>
                        <p>{new Date(ticket.created_at).toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <h4 className="font-semibold">{t('support_ticket_opening.Last Activity')}</h4>
                        <p>{new Date(ticket.updated_at).toLocaleString()}</p>
                    </div>
                </div>
            </div>
            {ticket.status === 'open' && (
                <div className="mt-6">
                    <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                        <Input
                            placeholder={t('support_ticket_opening.Write Your reply')}
                            className="flex-grow w-full p-2 border rounded-md sm:w-auto"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button className="w-full px-4 py-2 text-white bg-blue-500 rounded-md sm:w-auto" onClick={handleSendMessage}>
                            {t('support_ticket_opening.Reply')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportTicketOpening;
