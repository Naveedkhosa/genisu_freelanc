

import { DataTable } from '@/components/user/data-table';
import { useEffect, useState } from 'react';
import baseClient from '@/services/apiClient';
import { Vehicle, VehicleColumns } from '@/components/VehicalMangement/columns';
import VehicleHeader from '@/components/VehicalMangement/vehicle-header';
async function getData(): Promise<Vehicle[]> {
    const response = await baseClient.get('/vehicles')
      
    const data = response.data.map((vehicle) => ({
      ...vehicle,
      driver: vehicle.driver?.name || ''
    }));
    return data;
}
const VehicleMangement =  () => {
    const [vehicle, setVehicle] = useState<Vehicle[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData();
            setVehicle(data);
        };

        fetchData();
    }, []);


  return (
    <div className='flex flex-col w-full px-2 md:pl-[84px] sm:pl-0'>
      <VehicleHeader/>
      <div className="mt-4">
        <DataTable columns={VehicleColumns} data={vehicle} />
      </div>
    </div>
  )
}

export default VehicleMangement


