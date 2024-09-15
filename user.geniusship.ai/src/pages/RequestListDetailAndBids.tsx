import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import baseClient from "@/services/apiClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileBoxIcon, LocateIcon, Package } from "lucide-react";
import { AiFillPhone, AiFillTruck } from "react-icons/ai";
import { useState, useEffect } from "react";
import image from "@/assets/map.png";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CiLocationArrow1 } from "react-icons/ci";
import { MdProductionQuantityLimits } from "react-icons/md";
import truck_2 from "@/assets/truck_2.png";

const RequestListDetailAndBids: React.FC = () => {
    const { t } = useTranslation("global"); // Initialize useTranslation
    const [request_data, setRequestData] = useState<any>(null); // Initial state as null
    const { id } = useParams();

    const [offer_amount, setOfferAmount] = useState<number>(0);
    const [refreshComponent, setRefreshComponent] = useState(false);

    useEffect(() => {
        baseClient.get(`request/${id}`)
            .then((response) => {
                console.log("Response data:", response.data); // Log the response data to ensure it's being received
                setRequestData(response.data);
            })
            .catch((error: any) => {
                console.error("Error fetching requests:", error); // Log any errors during the fetch
            });
    }, [refreshComponent]);

    const sendOffer = () => {
        if (offer_amount > 0) {
            baseClient.post('bids', {
                bid_amount: offer_amount,
                shipment_id: id
            })
                .then((response) => {
                    if(response?.data?.success){
                        toast.success(t("request_list_detail_and_bids.Bid offer sent successfully"));
                    }
                    setRefreshComponent(true);
                })
                .catch((error: any) => {
                    toast.error(t("request_list_detail_and_bids.error while sending bid offer") + ": " + error);
                });
        } else {
            toast.error(t("request_list_detail_and_bids.Please fill a valid bid offer amount"));
        }
    };

    return (
        <div className="w-full mt-4 px-4 pl-[84px]">
            {!request_data ? (
                <p className="text-white">{t("request_list_detail_and_bids.Loading or no data available")}</p> // Fallback message while data is loading or if there's no data
            ) : (
                <Tabs defaultValue="Detail" className="w-full py-3">
                    <TabsList className="w-full py-4 flex justify-start bg-transparent gap-4">
                        <TabsTrigger value="Detail" className="border w-[140px] data-[state=active]:bg-primary-200 data-[state=active]:text-white">
                            {t("request_list_detail_and_bids.Detail")}
                        </TabsTrigger>
                        <TabsTrigger value="Bids" className="border w-[140px] data-[state=active]:bg-primary-200 data-[state=active]:text-white">
                            {t("request_list_detail_and_bids.Bids")}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="Detail">
                        <div className="flex flex-col p-2 py-4 pl-4 border border-gray-500 bg-black bg-opacity-25 shadow-md rounded-xl">
                            <h4 className="text-gray-200 mb-3 ">{t("request_list_detail_and_bids.Request Details")}</h4>
                            <h2 className="mb-2 text-2xl font-bold uppercase text-green-300">{request_data?.expected_price} USD</h2>
                            <div className="flex items-center space-x-* ">
                      <div className="w-full flex items-center gap-2">
                         <h4 className="text-gray-100 text-sm font-bold">{t('request_list_card.Truck Type')}:</h4>
                         <p className="text-gray-300 text-xs">{request_data?.truck_type}</p>
                       </div>
                       <img className="w-[100px]" src={truck_2} alt="" />
                    </div>
                            <div className="grid grid-cols-1 gap-6 mt-2">
                                <div className="flex items-center">
                                <Calendar className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                                    <h2 className="text-xs font-bold text-gray-300">{t("request_list_detail_and_bids.Pickup")} : </h2>
                                    <p className="text-sm text-gray-300">{request_data?.pickup_date}</p>
                                </div>
                                <div className="flex items-center">
                                <Calendar className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                                    <h2 className="text-xs font-bold text-gray-300">{t("request_list_detail_and_bids.Drop")}:</h2>
                                    <p className="text-sm text-gray-300">{request_data?.destination_date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                <CiLocationArrow1 className="mr-0 p-1 bg-green-300 rounded-full text-blue-500" size={26} />
                                    <h4 className="text-sm font-bold text-gray-300">{t("request_list_detail_and_bids.From")}:</h4>
                                    <p className="text-sm text-gray-300">{request_data?.pickup_address}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                <LocateIcon className="mr-0 p-1 bg-red-300 rounded-full text-blue-500" size={26} />
                                    <h2 className="text-sm font-bold text-gray-300">{t("request_list_detail_and_bids.To")}:</h2>
                                    <p className="text-sm text-gray-300">{request_data?.destination_address}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                <MdProductionQuantityLimits className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                                    <h4 className="text-xs font-bold text-gray-300">{t("request_list_detail_and_bids.Quantity")}</h4>
                                    <p className="text-sm text-gray-300">{request_data?.shipment_packages[0].quantity}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                <Package className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                                    <h2 className="text-xs font-bold text-gray-300">{t("request_list_detail_and_bids.Type of Package")}:</h2>
                                    <p className="text-sm text-gray-300">Wood box</p>
                                </div>
                               
                                <div className="flex items-center gap-2">
                                <FileBoxIcon className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                                    <h2 className="text-sm font-bold text-gray-300">{t("request_list_detail_and_bids.Body Type")}:</h2>
                                    <p className="text-sm text-gray-300">{request_data?.truck_body_type}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                <AiFillPhone className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                                    <h4 className="text-sm font-bold text-gray-300">{t("request_list_detail_and_bids.Drop Contact")}:</h4>
                                    <p className="text-sm text-gray-300">{request_data?.drop_contact_phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                <AiFillPhone className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                                    <h2 className="text-sm font-bold text-gray-300">{t("request_list_detail_and_bids.Pickup Contact")}:</h2>
                                    <p className="text-sm text-gray-300">{request_data?.pickup_contact_phone}</p>
                                </div>
                            </div>
                            {request_data?.my_bid.length !== 0 && (
                                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap mt-6">
                                    <p className="text-gray-300">{t("request_list_detail_and_bids.You have already bid on this shipment")}</p>
                                </div>
                            )}
                            {request_data?.my_bid.length === 0 && (
                                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap mt-6">
                                    <Input 
                                        type="number" 
                                        value={offer_amount} 
                                        onChange={(e) => setOfferAmount(parseInt(e.target.value))} 
                                        placeholder={t("request_list_detail_and_bids.Enter your bid amount here")} 
                                        className="w-full sm:w-[300px]" 
                                    />
                                    <Button className="bg-primary-200 w-full sm:w-fit text-white" onClick={sendOffer}>
                                        {t("request_list_detail_and_bids.Send My Offer")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="Bids">
                        <div className="py-4 p-2 border border-gray-500 bg-black bg-opacity-25 pl-4 shadow-md rounded-xl">
                            <h2 className="font-bold text-xl text-green-400">{t("request_list_detail_and_bids.Your Bid")}</h2>
                            <div className="grid grid-cols-1 mt-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {request_data?.my_bid.length === 0 && (
                                    <p className="text-grey py-2 w-full text-sm text-gray-400">{t("request_list_detail_and_bids.You have not placed bid yet")}</p>
                                )}
                                {request_data?.my_bid.length !== 0 && (
                                    <div className="flex border border-gray-600 bg-black bg-opacity-25 p-3 justify-between rounded-md ">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 border relative rounded-full overflow-hidden">
                                                <img src={image} alt="d" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="font-bold text-gray-300">{request_data?.my_bid[0]?.bidder?.name}</h2>
                                                <p className="font-thin text-gray-500 text-sm">bid at: {request_data?.my_bid[0]?.created_at}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <p className="font-bold text-gray-300 text-xl">{request_data?.my_bid[0]?.bid_amount} USD</p>
                                            <h2 className="font-bold text-gray-500">{t("request_list_detail_and_bids.Amount")}</h2>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h2 className="mt-2 font-bold text-xl text-red-400">{t("request_list_detail_and_bids.Others Bids")}</h2>
                            <div className="grid grid-cols-1 mt-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {request_data.bids.length === 0 && (
                                    <p className="text-gray-300 py-2 w-full text-sm">{t("request_list_detail_and_bids.There is no other bid")}</p>
                                )}
                                {request_data.bids.map((bid: any, index: any) => (
                                    <div className="flex border  border-gray-600 bg-black bg-opacity-25 p-3 justify-between rounded-md " key={index}>
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 border relative rounded-full overflow-hidden">
                                                <img src={image} alt="d" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="font-bold text-gray-300">{bid?.bidder?.name}</h2>
                                                <p className="font-thin text-gray-500 text-sm">bid at: {bid.created_at}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col text-center">
                                            <p className="font-bold text-gray-300 text-xl">{bid?.bid_amount} USD</p>
                                            <h2 className="font-bold text-gray-500">{t("request_list_detail_and_bids.Amount")}</h2>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};

export default RequestListDetailAndBids;
