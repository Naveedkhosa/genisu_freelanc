import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TruckShipmentImage from "@/assets/truck-shipment.png";
import { Separator } from "@/components/ui/separator";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import NewShipmentDetailsPage from "@/pages/NewShipmentDetail.tsx";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import { Package } from "lucide-react";
import baseClient from "@/services/apiClient";

const statusStyles = {
  pending: "bg-yellow-500",
  order_confirmed: "bg-blue-500",
  pickup: "bg-grey-500",
  in_transit: "bg-red-500",
  delivered: "bg-green-500",
};

const NewShipment = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [status, setStatus] = useState(""); // Default to empty string
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    baseClient
      .get("shipments")
      .then((response) => {
        // console.log(response);
        
        setShipments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shipments:", error);
      });
  }, []);

  useEffect(() => {
    const currentStatus = searchParams.get("status") || "";
    setStatus(currentStatus);
  }, [searchParams]);

  useEffect(() => {
    setFilteredShipments(
      status === ""
        ? shipments
        : shipments.filter((shipment) => shipment.status === status)
    );
  }, [shipments, status]);

  const handleCardClick = (shipmentId) => {
    const selectedShipmentFilter = filteredShipments.find((s) => s.id === shipmentId);
    setSelectedShipment(selectedShipmentFilter);
    if (width < 1024) {
      navigate(`/new-shipment/${shipmentId}`);
    }
  };

  const handleTabClick = (newStatus) => {
    searchParams.set("status", newStatus);
    navigate(`?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col w-full px-2 md:pl-[84px] sm:pl-0">
      <div className="flex overflow-hidden overflow-x-scroll justify-between bg-gray-800 bg-opacity-25 mt-2 rounded-lg">
      <div className="flex space-x-4 p-4 ">
        {["pending", "order_confirmed", "pickup", "in_transit", "delivered"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={clsx("px-4 py-2 rounded-lg text-white", {
              "bg-green-500": status === tab,
              "bg-gray-600": status !== tab,
            })}
          >
            {tab.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
          </button>
        ))}
      </div>
      <Link to="/create-request" className="px-6 py-2 my-auto mx-4 font-semibold text-center text-white rounded  bg-black bg-opacity-25">
          Create Request
      </Link>
      </div>
      <main className="flex-1 flex flex-col lg:flex-row lg:items-start">
        <div className="w-full lg:w-1/2 p-4 grid grid-cols-1 gap-1 lg:gap-6 lg:grid-cols-2">
          {filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="bg-black bg-opacity-25 shadow-md p-4 rounded-lg mb-4 cursor-pointer hover:bg-opacity-50"
              onClick={() => handleCardClick(shipment.id)}
            >
              <div
                className={`text-xs text-white mb-1 w-fit px-2 py-1 rounded ${statusStyles[shipment.status]}`}
              >
                {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
              </div>
              <div className="flex mb-1 items-center justify-between">
                <div className="flex flex-col">
                  <h5 className="text-sm font-semibold text-gray-400">Shipment number</h5>
                  <h3 className="text-lg font-semibold text-gray-200">{shipment.tracking_number}</h3>
                </div>
                <img src={TruckShipmentImage} alt="truck" className="w-20" />
              </div>
              <Separator className="my-2" />
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4'>
                  <div className='bg-green-100 rounded-full w-10 h-10 flex items-center justify-center'>
                    <ArrowUpRight className='text-green-400'/>
                  </div>
                  <div className='flex flex-col'>
                    <h3 className="text-lg font-semibold text-gray-200">{getTextAfterSecondLastComma(shipment.pickup_address)[0]}</h3>
                    <h5 className='text-sm text-gray-400'>{getTextAfterSecondLastComma(shipment.pickup_address)[1]}</h5>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-4 mt-2 mb-1'>
                <div className='flex gap-4'>
                  <div className='bg-rose-100 rounded-full w-10 h-10 flex items-center justify-center'>
                    <ArrowDownLeft className='text-rose-400'/>
                  </div>
                  <div className='flex flex-col'>
                    <h3 className="text-lg font-semibold text-gray-200 ">{getTextAfterSecondLastComma(shipment.destination_address)[0]}</h3>
                    <h5 className='text-sm text-gray-400'>{getTextAfterSecondLastComma(shipment.destination_address)[1]}</h5>
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
              <p className="text-gray-300 text-sm">Customer</p>
              <p className="text-gray-200 font-bold">{shipment.customer.name}</p>
              <p className="text-gray-300 text-sm">LTD industries</p>
            </div>
          ))}
        </div>
        <div className="w-full hidden lg:block lg:w-1/2 p-4">
          {selectedShipment ? (
            <NewShipmentDetailsPage shipment={selectedShipment} />
          ) : (
            <div className="flex mt-6 flex-col items-center justify-center h-full text-gray-500">
              <Package className="w-10 h-10 mb-2 text-gray-400" />
              <p className="text-lg font-semibold">Select a shipment to see details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewShipment;

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

function getTextAfterSecondLastComma(address) {
  const parts = address.split(',').map(part => part.trim());
  if (parts.length < 3) {
    throw new Error('Address must contain at least two commas.');
  }
  return parts.slice(-2); 
}
