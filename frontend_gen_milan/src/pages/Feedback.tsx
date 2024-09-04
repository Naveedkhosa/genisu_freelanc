import { useEffect, useState } from 'react';
import { Feedback, FeedbackColumns } from '@/components/feedback/columns';
import FeedBackHeader from '@/components/feedback/feeback-header';
import { DataTable } from '@/components/feedback/data-table';
import baseClient from '@/services/apiClient';

async function getData(): Promise<Feedback[]> {
  const response = await baseClient.get('feedback');
 
  const data = response.data.map((feedback) => ({
    ...feedback,
    user: feedback.user?.name || ''
  }));
  return data;
}

const FeedBackPage = () => {
  const [feedBack, setFeedBack] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setFeedBack(data);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col w-full px-4 '>
      <FeedBackHeader />
      {/* <div className='flex items-center justify-start gap-3 my-2 '>
        <div className='flex items-center justify-between my-2'>
          <Select>
            <SelectTrigger className="relative w-[180px] outline-none border focus:outline-none active:outline-none pl-10">
              <FaCalendarAlt className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
              <SelectValue placeholder="Last 30 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>All</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <GoDownload className='text-white bg-primary-300 w-[40px] rounded cursor-pointer h-[40px] px-2 py-2 text-2xl shadow-lg' />
      </div>
      <p className='mt-1 text-xs'>0 Orders for Last 30 days</p> */}
      <div className="mt-4">
        <DataTable columns={FeedbackColumns} data={feedBack} />
      </div>
    </div>
  )
}

export default FeedBackPage

