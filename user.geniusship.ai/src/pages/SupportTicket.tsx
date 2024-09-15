import { useEffect, useState } from 'react';
import { getSupportTicketColumns } from '@/components/support-ticket/columns';
import { DataTable } from '@/components/support-ticket/data-table';
import SupportHeader from '@/components/support-ticket/support-header';
import baseClient from '@/services/apiClient';
import { useTranslation } from "react-i18next";

async function getData() {
  const response = await baseClient.get('support-tickets');
  const data = response.data.map((support_ticket) => ({
    ...support_ticket,
    user: support_ticket.user?.name || ''
  }));
  return data;
}

const SupportTicketPage = () => {
  const { t } = useTranslation("global");
  const [support, setSupport] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setSupport(data);
    };

    fetchData();
  }, []);

  const columns = getSupportTicketColumns(t);  // Use translated columns

  return (
    <div className='flex flex-col w-full px-4 md:pl-[84px] sm:pl-0'>
      <SupportHeader />
      <div className="mt-4">
        <DataTable columns={columns} data={support} />
      </div>
    </div>
  )
}

export default SupportTicketPage;
