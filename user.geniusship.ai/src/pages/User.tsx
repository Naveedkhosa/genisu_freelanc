
import { useTranslation } from 'react-i18next';
import { User, getUserColumns  } from '@/components/user/columns';
import UserHeader from '@/components/user/user-header';
import { DataTable } from '@/components/user/data-table';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import baseClient from '@/services/apiClient';

async function getData(endpoint: string): Promise<User[]> {
  try {
    const response = await baseClient.get(endpoint);
      
    const data = response.data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.user_detail?.phone || '',
      address: user.user_detail?.address || '',
      company: user.user_detail?.company || '',
      license_number: user.user_detail?.license_number || '',
      transporter_name: user.user_detail?.transporter?.name || '',
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { type } = useParams();

  const { t } = useTranslation("global");

  const userColumns = getUserColumns(t);

  useEffect(() => {
    const fetchData = async () => {
      let endpoint = '';

      switch (type) {
        case 'customers':
          endpoint = '/all_customers';
          break;
        case 'transporter':
          endpoint = '/all_transporters';
          break;
        case 'driver':
          endpoint = '/all_drivers';
          break;
        default:
          console.error('Unknown user type:', type);
          return;
      }

      const data = await getData(endpoint);
      setUsers(data);
    };

    fetchData();
  }, [type]);

  return (
    <div className='flex flex-col w-full px-2 md:pl-[84px] sm:pl-0 '>
      <UserHeader type={type} />
      <div className="mt-1 px-4">
        <DataTable columns={userColumns} data={users} />
      </div>
    </div>
  );
}

export default UserPage;
