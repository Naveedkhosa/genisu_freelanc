import AddTruckType from "./add-truck-type";
import { useTranslation } from 'react-i18next';

const TruckTypeHeader = () => {
    const { t } = useTranslation("global"); // Use translation function from i18next

    return (
        <div className='flex justify-between w-full my-5'>
            <div className='flex items-center'>
                <h2 className='mr-3 text-xl text-white font-bold'>{t('truck_type_header.Truck type')}</h2>
             </div>
             <AddTruckType/>
        </div>
    )
}

export default TruckTypeHeader;
