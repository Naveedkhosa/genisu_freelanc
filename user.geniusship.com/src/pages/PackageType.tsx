import { useEffect, useState } from 'react';
import { DataTable } from '@/components/payment/data-table';
import { useTranslation } from 'react-i18next';
import { getPackageColumns } from '@/components/package-type/columns';
import PackageHeader from '@/components/package-type/package-type-header';
import baseClient from '@/services/apiClient'; // Adjust the import path as needed

async function getData() {
    try {
        const response = await baseClient.get('/package-types'); // Adjust the API endpoint if needed
        return response.data;
    } catch (error) {
        console.error('Error fetching package types:', error);
        return [];
    }
}

const PackageType = () => {
    const [packages, setPackages] = useState([]);
    const { t } = useTranslation("global");
    const PackageColumns = getPackageColumns(t);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData();
            setPackages(data);
        };

        fetchData();
    }, []);

    return (
        <div className='md:pl-[84px] sm:pl-0'>
            <div className='flex flex-col w-full px-4 '>
                <PackageHeader />
            </div>
            <div className="px-4 mt-1">
                <DataTable columns={PackageColumns} data={packages} />
            </div>
        </div>
    );
};

export default PackageType;
