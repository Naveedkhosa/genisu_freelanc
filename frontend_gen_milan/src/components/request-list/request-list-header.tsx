import { useTranslation } from 'react-i18next';

const RequestListHeader = () => {
    const { t } = useTranslation("global");
    
    return (
        <div className='flex justify-between w-full my-5'>
            <div className='flex items-center gap-3'>
                <h2 className='mr-3 text-white text-xl font-bold'>{t('request_list_header.All Requests')}</h2>
            </div>
        </div>
    )
}

export default RequestListHeader;