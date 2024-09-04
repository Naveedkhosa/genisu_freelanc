
import { Route, RouteColumns } from '@/components/route/columns';
import RouteHeader from '@/components/route/route-header';
import { DataTable } from '@/components/route/data-table';
import baseClient from '@/services/apiClient';
import { useEffect, useState } from 'react';

async function getData(): Promise<Route[]> {
  const response = await baseClient.get('/routes');

  return response.data;
}

const RoutePage = () => {
  const [route, setRoute] = useState<Route[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setRoute(data);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col w-full px-4 md:pl-[84px] sm:pl-0'>
      <RouteHeader />
      <div className="mt-4">
      
        <DataTable columns={RouteColumns} data={route} />
      </div>
    </div>
  )
}

export default RoutePage

