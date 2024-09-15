import baseClient from "@/services/apiClient";
import { Calendar, FileBoxIcon, FormInputIcon, LocateIcon, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { AiFillPhone, AiFillTruck } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import Pusher from 'pusher-js';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import truck_2 from "@/assets/truck_2.png";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaTruckPickup } from "react-icons/fa";
import { TbLocationDiscount } from "react-icons/tb";
import { CiLocationArrow1 } from "react-icons/ci";


const RequestListCard = () => {
  const { t } = useTranslation('global'); // Initialize translation function with 'global' namespace
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [requests, setRequests] = useState<any>([]);
  const [refreshComponent, setRefreshComponent] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    baseClient
      .get("requests")
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
      });
  }, [refreshComponent]);

  useEffect(() => {
    const pusher = new Pusher('dfe96704a38961067cf1', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('driver-channel');
    channel.bind('notification', function (data:any) {
      if (data.type == "shipment") {
        setRefreshComponent(true);
      }
    });
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsDialogOpen(location.pathname !== "/request-list");
    } else {
      setIsDialogOpen(false);
    };
  }, [location.pathname, isMobile]);

  return (
    <>
      {requests.length === 0 && (
        <h1 className="text-center w-[100%] py-3">
          {t('request_list_card.No request was found')}
        </h1>
      )}
      <div className="flex flex-col w-full h-full lg:flex-row ">
        <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 2xl:grid-cols-2 xl:w-[100%] lg:grid-cols-2 lg:[80%] w-full gap-4">

          {requests.length > 0 && (
            requests.map((request:any) => (
              <Link to={`/request-list/${request.id}`} key={request.id}>
                <div className="flex flex-col p-2 py-4 pl-2 border border-gray-400 bg-black bg-opacity-25 shadow-md rounded-xl">
                  <h4 className="text-gray-200">{t('request_list_card.Request Details')}</h4>
                  <div className="flex items-center space-x-* ">
                      <div className="w-full flex items-center gap-2">
                         <h4 className="text-gray-100 text-sm font-bold">{t('request_list_card.Truck Type')}:</h4>
                         <p className="text-gray-300 text-xs">{request.truck_type}</p>
                       </div>
                       <img className="w-[100px]" src={truck_2} alt="" />
                    </div>
                  <h2 className="mb-2 text-2xl font-bold text-green-400 uppercase">{request.expected_price} USD</h2>
                 
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex text-gray-200 items-center">
                      <Calendar className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-gray-200 text-sm font-bold">{t('request_list_card.Pickup')}:</h2>
                      <p className="text-gray-400 text-sm">{request.pickup_date}</p>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-gray-200 text-sm font-bold">{t('request_list_card.Drop')}:</h2>
                      <p className="text-gray-400 text-sm">{request.destination_date}</p>
                    </div>
                 
                   
                    <div className="flex items-center gap-2">
                    <MdProductionQuantityLimits className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h4 className=" text-gray-200 text-sm font-bold">{t('request_list_card.Quantity')}</h4>
                      <p className="text-gray-400 text-sm">{request.shipment_packages[0].quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <Package className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-gray-200 text-sm font-bold">{t('request_list_card.Type of Package')}:</h2>
                      <p className="text-gray-400 text-sm">Wood box</p>
                    </div>
                  
                    <div className="flex items-center gap-2">
                      <FileBoxIcon className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-gray-200 text-xs font-bold">{t('request_list_card.Body Type')}:</h2>
                      <p className="text-gray-400 text-sm">{request.truck_body_type}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <AiFillPhone className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h4 className="text-gray-200 text-xs font-bold">{t('request_list_card.Drop Contact')}:</h4>
                      <p className="text-gray-400 text-sm">{request.drop_contact_phone}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <AiFillPhone className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-gray-200 text-xs font-bold">{t('request_list_card.Pickup Contact')}:</h2>
                      <p className="text-gray-400 text-sm">{request.pickup_contact_phone}</p>
                    </div>
                    
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CiLocationArrow1 className="mr-0 p-1 bg-green-300 rounded-full text-blue-500" size={26} />
                      <h4 className="text-gray-200 text-sm font-bold">{t('request_list_card.From')}:</h4>
                      <p className="text-gray-400 text-sm">{request.pickup_address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <LocateIcon className="mr-0 p-1 bg-red-300 rounded-full text-blue-500" size={26} />
                      <h2 className="text-gray-200 text-sm font-bold">{t('request_list_card.To')}:</h2>
                      <p className="text-gray-400 text-sm">{request.destination_address}</p>
                    </div>
                </div>
              </Link>
            ))
          )}

        </div>
      </div>
    </>
  );
};

export default RequestListCard;
