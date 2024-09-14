import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/payment/data-table';
import { getTruckBodyColumns  } from '@/components/truck-body-type/columns';
import TruckBodyTypeHeader from '@/components/truck-body-type/truck-body-type-header';
import baseClient from '@/services/apiClient'; // Assuming you have a baseClient for API calls

async function getData() {
    try {
        const response = await baseClient.get('/truck-body-types'); // Adjust the endpoint if needed
        return response.data; // Assuming the API returns an array of truck body types in the data property
    } catch (error) {
        console.error('Error fetching truck body types:', error);
        return [];
    }
}

const TruckBodyType = () => {
    const [truckBodyTypes, setTruckBodyTypes] = useState([]);
    const { t } = useTranslation("global");
    const TruckBodyColumns = getTruckBodyColumns(t);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData();
            setTruckBodyTypes(data);
        };

        fetchData();
    }, []);

    return (
        <div className='md:pl-[84px] sm:pl-0'>
            <div className='flex flex-col w-full px-4 '>
                <TruckBodyTypeHeader />
            </div>
            <div className="px-4 mt-1">
                <DataTable columns={TruckBodyColumns} data={truckBodyTypes} />
            </div>
        </div>
    );
};

export default TruckBodyType;
