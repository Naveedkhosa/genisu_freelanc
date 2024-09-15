import AddTruckBodyType from "./add-truck-body-type";
import { useTranslation } from 'react-i18next';

const TruckBodyTypeHeader = () => {
    const { t } = useTranslation("global"); // Use translation function from i18next

    return (
        <div className='flex justify-between w-full my-5'>
            <div className='flex items-center'>
                <h2 className='mr-3 text-xl font-bold text-white'>{t('truck_body_type_header.Truck Body type')}</h2>
             </div>
             <AddTruckBodyType/>
        </div>
    )
}

export default TruckBodyTypeHeader;
