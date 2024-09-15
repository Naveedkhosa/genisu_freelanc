import { useEffect, useState } from 'react';
import { DataTable } from '@/components/payment/data-table';
import TruckTypeHeader from '@/components/truck-type/truck-type-header';
import { useTranslation } from 'react-i18next';
import { getTruckColumns  } from '@/components/truck-type/columns';
import baseClient from '@/services/apiClient'; // Assuming you have a baseClient for API calls

async function getData() {
    try {
        const response = await baseClient.get('/truck-types'); // Adjust the endpoint as needed
        return response.data; // Assuming the API returns an array of truck types in the data property
    } catch (error) {
        console.error('Error fetching truck types:', error);
        return [];
    }
}

const TruckType = () => {
    const [truckType, setTruckType] = useState([]);
    const { t } = useTranslation("global");
    const TruckColumns = getTruckColumns(t);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData();
            setTruckType(data);
        };

        fetchData();
    }, []);

    return (
        <div className='md:pl-[84px] sm:pl-0'>
            <div className='flex flex-col w-full px-4 '>
                <TruckTypeHeader />
            </div>
            <div className="px-4 mt-1">
                <DataTable columns={TruckColumns} data={truckType} />
            </div>
        </div>
    );
};

export default TruckType;
