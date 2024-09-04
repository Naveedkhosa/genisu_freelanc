import AddSupportTicket from "./add-support-ticket";
import { useTranslation } from "react-i18next";

const SupportHeader = () => {
    const { t } = useTranslation("global");

    return (
        <div className='flex justify-between w-full my-5'>
            <div className='flex items-center gap-3'>
                <h2 className='mr-3 text-xl font-bold text-gray-300'>{t('support_ticket.Support Tickets')}</h2>
            </div>
            <div className='flex gap-2'>
                <AddSupportTicket />
            </div>
        </div>
    )
}

export default SupportHeader;
