import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileBoxIcon,
  LocateIcon,
  Package,
  Phone,
} from "lucide-react";
import { MdEmail, MdProductionQuantityLimits } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiLocationArrow1 } from "react-icons/ci";
import { AiFillPhone } from "react-icons/ai";
import TruckShipmentImage from "@/assets/truck-shipment.png";
import React, { useEffect, useState } from "react";
import mapImage from "@/assets/map-image.jpg";
import { useWindowSize } from "./NewShipment";
import clsx from "clsx";
import baseClient from "@/services/apiClient";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { base_url } from "@/services/apiClient";
import ShippingInvoice from "./ShippingInvoice";
// const shipments = [
//     {
//         id: 1,
//         number: 'UA-145009BS',
//         locations: ['Athens, GRC', 'Tallinn, EST'],
//         buyer: 'Milton Hines',
//         imageUrl: 'https://via.placeholder.com/64',
//         loadCapacity: 40,
//         status: 'pending'
//     },
//     {
//         id: 2,
//         number: 'MK-549893XC',
//         locations: ['Yingkou, CHN', 'Abu Dhabi, UAE'],
//         buyer: 'Gary Muncy',
//         imageUrl: 'https://via.placeholder.com/64',
//         loadCapacity: 70,
//         status: 'intransit'
//     },
//     {
//         id: 3,
//         number: 'XY-123456AB',
//         locations: ['New York, USA', 'London, UK'],
//         buyer: 'John Doe',
//         imageUrl: 'https://via.placeholder.com/64',
//         loadCapacity: 55,
//         status: 'completed'
//     },
//     {
//         id: 4,
//         number: 'CD-789012EF',
//         locations: ['Berlin, GER', 'Paris, FRA'],
//         buyer: 'Jane Smith',
//         imageUrl: 'https://via.placeholder.com/64',
//         loadCapacity: 80,
//         status: 'closed'
//     },
//     // Add more shipment data...
// ];

export default function NewShipmentDetailsPage({ shipment }) {
    // console.log(shipment);
    
  // const { id } = useParams();
  const [rating, setRating] = useState<number>(null);
  const [reasons, setReasons] = useState("");

  const [rresponse, setRResponse] = useState<any>();
//   console.log(rresponse);
  
  const [is_loading, setIsLoading] = useState(true);

  const [processing, setprocessing] = useState(false);
  const [refreshComponent, setRefreshComponent] = useState(false);
  const navigate = useNavigate();
  const { width } = useWindowSize();
//   console.log(shipment);
  const handleSubmit = (e: any) => {
    setprocessing(true);

    if (rating == null) {
      toast.error("Please select experience");
      return;
    }
    if (reasons.length < 10) {
      toast.error("Please write review reason upto 10 characters");
      return;
    }

    e.preventDefault();

    baseClient
      .post("feedback", {
        comments: reasons,
        shipment_id: shipment.id,
        rating: rating,
      })
      .then((response) => {
        setprocessing(false);
        if ("status" in response.data && response.data.status == false) {
          toast.error(response?.data?.message);
        }

        if ("status" in response.data && response.data.status == true) {
          toast.success(response?.data?.message);
        }

        setRefreshComponent(!refreshComponent);
      });
  };
  useEffect(() => {
    // console.log(shipment.id);
    
    baseClient.get(`shipment/${shipment.id}/review`).then((response) => {
    //   console.log("Review",response.data);
      setRResponse(response.data);
      setIsLoading(false);
      if ("status" in response.data && response.data.status == false) {
        toast.error(response?.data?.message);
      }
    });
  }, [shipment,refreshComponent]);
  const handleFeedback = () => {};
  function getTextAfterSecondLastComma(address) {
    const parts = address.split(",").map((part) => part.trim());
    if (parts.length < 3) {
      throw new Error("Address must contain at least two commas.");
    }
    const result = parts.slice(-2);
    return result;
  }
  useEffect(() => {
    if (width >= 1024) {
      navigate("/new-shipment");
    }
  }, [width, navigate]);

  // shipment = shipment || shipments.find((s) => s.id === parseInt(id, 10));
  // console.log(shipment.loadCapacity);
  if (!shipment) {
    return <div>Shipment not found</div>;
  }

  return (
    <div className="pl-4 p-4">
      <div className="bg-black bg-opacity-25 text-gray-200 shadow-md p-4 rounded-lg">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl uppercase font-semibold">
              {shipment.tracking_number}
            </h2>
          </div>
          <div className="flex gap-4">
            <Button className="bg-black bg-opacity-60">
              <Phone size={16} className="mr-2 " />
              Phone
            </Button>
            <Button className="bg-black bg-opacity-60">
              <MdEmail size={16} className="mr-2 " />
              Email
            </Button>
            {
                shipment.status != "pending" ? (<Link className="bg-blue-950 my-auto px-6 py-2 rounded-sm" to={'/chat/' + shipment?.chat_room?.id}>Chat</Link>) : null
            }
            
          </div>
        </div>
        <Tabs defaultValue="information" className="w-full mt-4">
          <TabsList className="bg-transparent gap-4 ">
            <TabsTrigger
              className="data-[state=active]:border-b-2 text-gray-300 data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-rose-400"
              value="information"
            >
              Information
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:border-b-2  text-gray-300 data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-rose-400"
              value="Vehicle Info"
            >
              Vehicle Info
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:border-b-2 text-gray-300 data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-rose-400"
              value="Billing"
            >
              Billing
            </TabsTrigger>
            {shipment.status == "delivered" ? (
              <TabsTrigger
                onClick={handleFeedback}
                className="data-[state=active]:border-b-2 text-gray-300 data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-rose-400"
                value="Feedback"
              >
                Leave Feedback
              </TabsTrigger>
            ) : null}
          </TabsList>
          <TabsContent value="information">
            <div className="flex flex-col p-2 py-4">
              <h4 className="flex items-center justify-between text-gray-300">
                Request Details{" "}
                <span className="py-2 text-sm text-grey">
                  Tracking ID: {shipment.tracking_number}
                </span>
              </h4>
              <div className="flex items-center space-x-* ">
                <div className="w-full flex items-center gap-2">
                  <h4 className="text-xs font-bold text-gray-300">
                    Truck Type:
                  </h4>
                  <p className="text-sm text-gray-300">{shipment.truck_type}</p>
                </div>
                <img src={TruckShipmentImage} alt="truck" className="w-20" />
              </div>
              <h2 className="mb-2 text-2xl font-bold uppercase text-gray-300">
                $ {shipment.expected_price}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <CiLocationArrow1
                  className="mr-0 p-1 bg-green-300 rounded-full text-blue-500"
                  size={26}
                />
                <h4 className="text-sm font-bold text-gray-300">From:</h4>
                <p className="text-sm text-gray-300">
                  {getTextAfterSecondLastComma(shipment.pickup_address).join(
                    ", "
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <LocateIcon
                  className="mr-0 p-1 bg-red-300 rounded-full text-blue-500"
                  size={26}
                />
                <h2 className="text-sm font-bold text-gray-300">To:</h2>
                <p className="text-sm text-gray-300">
                  {getTextAfterSecondLastComma(
                    shipment.destination_address
                  ).join(", ")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar
                    className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500"
                    size={24}
                  />
                  <h2 className="text-xs font-bold text-gray-300">Pickup:</h2>
                  <p className="text-sm text-gray-300">
                    {shipment.pickup_date}
                  </p>
                </div>
                <div className="flex items-center">
                  <Calendar
                    className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500"
                    size={24}
                  />
                  <h2 className="text-xs font-bold text-gray-300">Drop:</h2>
                  <p className="text-sm text-gray-300">
                    {shipment.destination_date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MdProductionQuantityLimits
                    className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500"
                    size={24}
                  />
                  <h4 className="text-xs font-bold text-gray-300">Quantity</h4>
                  <p className="text-sm text-gray-300">
                    {shipment?.shipment_packages[0]?.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Package
                    className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500"
                    size={24}
                  />
                  <h2 className="text-xs font-bold text-gray-300">
                    Type of Package:
                  </h2>
                  <p className="text-sm text-gray-300">
                    {shipment?.shipment_packages[0]?.type_of_package}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FileBoxIcon
                    className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500"
                    size={24}
                  />
                  <h2 className="text-xs font-bold text-gray-300">
                    Body Type:
                  </h2>
                  <p className="text-sm text-gray-300">
                    {shipment.truck_body_type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <AiFillPhone
                    className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500"
                    size={24}
                  />
                  <h4 className="text-xs font-bold text-gray-300">
                    Drop Contact:
                  </h4>
                  <p className="text-sm text-gray-300">
                    {shipment.drop_contact_phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <AiFillPhone
                    className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500"
                    size={24}
                  />
                  <h2 className="text-xs font-bold text-gray-300">
                    Pickup Contact:
                  </h2>
                  <p className="text-sm text-gray-300">
                    {shipment.pickup_contact_phone}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Vehicle Info">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <img
                  src={TruckShipmentImage}
                  alt="truck"
                  className="rounded-lg w-16 h-16 object-contain"
                />
                <img
                  src={TruckShipmentImage}
                  alt="truck"
                  className="rounded-lg w-16 h-16 object-contain"
                />
                <img
                  src={TruckShipmentImage}
                  alt="truck"
                  className="rounded-lg w-16 h-16 object-contain"
                />
                <img
                  src={TruckShipmentImage}
                  alt="truck"
                  className="rounded-lg w-16 h-16 object-contain"
                />
              </div>
              <div className="p-4 rounded-lg">
                <h3 className="text-lg text-gray-200 font-semibold">
                  Load Capacity
                </h3>
                <div className="relative w-full my-2">
                  <img
                    src={TruckShipmentImage}
                    alt="truck"
                    className="w-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-60">
                        <div
                            className={clsx(
                            "h-16 max-w-[300px] bg-green-500 text-white flex items-center justify-center rounded"
                            )}
                            style={{
                            width: `${(shipment.truckTotalCapacity * shipment.truckOccupiedCapacity) / 100}%`,
                            fontSize:"82%"
                            }}
                        >
                            {(shipment.truckTotalCapacity * shipment.truckOccupiedCapacity) / 100}% Load Capacity
                        </div>
                 </div>

                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 mt-2 gap-4">
                  <div className="flex flex-col bg-black bg-opacity-25 rounded p-2">
                    <h4 className="text-sm font-semibold mb-1">Truck</h4>
                    <p className="font-bold text-base">{shipment.truck_type}</p>
                  </div>
                  <div className="flex flex-col bg-black bg-opacity-25 rounded p-2">
                    <h4 className="text-sm font-semibold mb-1">Truck Total Capacity</h4>
                    <p className="font-bold text-base">{shipment.truckTotalCapacity} kg</p>
                  </div>
                  <div className="flex flex-col bg-black bg-opacity-25 rounded p-2">
                    <h4 className="text-sm font-semibold mb-1">Truck Occupied Weight</h4>
                    <p className="font-bold text-base">{shipment.truckOccupiedCapacity}</p>
                  </div>
                  <div className="flex flex-col bg-black bg-opacity-25 rounded p-2">
                    <h4 className="text-sm font-semibold mb-1">Shipment Weight</h4>
                    <p className="font-bold text-base">{shipment.total_weight}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Route Map</h3>
                <img
                  src={mapImage}
                  alt="Route Map"
                  className="w-full h-[300px] rounded-lg"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Billing">
            <ShippingInvoice shipment={shipment}/>
          </TabsContent>
          {
            shipment.status == "delivered" ? (
                <TabsContent value="Feedback">
            <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-6">
              {rresponse?.can_review && (
                <>
                  <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                    Give Feedback
                  </h2>
                  <p className="text-gray-600 mb-4">
                    How was your experience with{" "}
                    {rresponse?.shipment?.accepted_bid[0]?.bidder?.name}?
                  </p>

                  <div className="flex justify-between w-full mb-6 space-x-3">
                    {[
                      { label: "Terrible", emoji: "😨", value: 1 },
                      { label: "Bad", emoji: "😔", value: 2 },
                      { label: "Okay", emoji: "😐", value: 3 },
                      { label: "Good", emoji: "😊", value: 4 },
                      { label: "Amazing", emoji: "😆", value: 5 },
                    ].map((option, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer text-sm font-medium w-20 h-20
      ${
        rating === option.value
          ? "bg-blue-100 text-blue-900"
          : "bg-gray-200 text-gray-600"
      }
      hover:bg-blue-50`}
                        onClick={() => setRating(option.value)}
                      >
                        <span className="text-2xl">{option.emoji}</span>
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>

                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 mb-6"
                    placeholder="What are the main reasons for your rating?"
                    value={reasons}
                    onChange={(e) => setReasons(e.target.value)}
                  />

                  <div className="flex space-x-4">
                    <button
                      onClick={handleSubmit}
                      disabled={processing}
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {processing && <>please wait...</>}
                      {!processing && <>Submit</>}
                    </button>
                    <button className="bg-gray-500 text-white rounded-lg py-2 px-6 hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {!rresponse?.status && (
                <p className="text-red-600">{rresponse?.message}</p>
              )}

              {is_loading && <>Please wait...</>}

              {rresponse?.status && !rresponse?.can_review && (
                <>
                  <article>
                    <div className="flex items-center mb-4">
                      <div className="font-medium dark:text-white">
                        <p>
                          <time className="block text-sm text-gray-500 dark:text-gray-400">
                            {rresponse?.shipment?.reviews[0].created_at}
                          </time>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                      {rresponse?.shipment?.reviews[0].rating == 1 && (
                        <>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>

                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        </>
                      )}

                      {rresponse?.shipment?.reviews[0].rating == 2 && (
                        <>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>

                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        </>
                      )}

                      {rresponse?.shipment?.reviews[0].rating == 3 && (
                        <>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>

                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        </>
                      )}

                      {rresponse?.shipment?.reviews[0].rating == 4 && (
                        <>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>

                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        </>
                      )}

                      {rresponse?.shipment?.reviews[0].rating == 5 && (
                        <>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        </>
                      )}
                    </div>

                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {rresponse?.shipment?.reviews[0].comments}
                    </p>
                  </article>
                </>
              )}
            </div>
          </TabsContent>
            ) : null
          }
          
        </Tabs>
      </div>
    </div>
  );
}
