import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import ShipmentHeader from "@/components/shipment/shipment-header";
import { getShipmentColumns  } from "@/components/shipment/columns";
import { DataTable } from "@/components/shipment/data-table";
import baseClient from "@/services/apiClient";
import { Button } from "@/components/ui/button";
import { FiMapPin } from 'react-icons/fi';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import MapImg from '@/assets/map.png';
import { PhoneCall } from "lucide-react";

const user = localStorage.getItem("user");
const current_user = user ? JSON.parse(user) : null;

const ShipmentPage = () => {
  const { t, i18n } = useTranslation("global"); // Initialize useTranslation
  const [filter, setFilter] = useState("all_shipments"); // Default filter
  const [customShipments, setCustomShipments] = useState([]);

  const shipmentColumns = getShipmentColumns(t);

  useEffect(() => {
    baseClient.get(`shipments`)
      .then((response) => {
        let filteredShipments;

        if (filter === "all_shipments") {
          filteredShipments = response.data;
        } else {
          filteredShipments = response.data.filter((shipment) => shipment.status === filter);
        }
        const shipments = filteredShipments.map((shipment: any) => {
          const commonData = {
            chat_room: shipment?.chat_room?.id || "N/A",
            shipment_id: shipment.id,
            tracking_number: shipment.tracking_number,
            customer_name: shipment.customer.name,
            pickup_address: shipment.pickup_address,
            destination_address: shipment.destination_address,
            expected_price: shipment.expected_price,
            total_bids: shipment.bids_count,
            status: shipment.status,
            created_at: shipment.created_at,
            updated_at: shipment.updated_at,
          };

          if (current_user?.role === 'Driver' || current_user?.role === 'Transporter') {
            return {
              ...commonData,
              fare: shipment?.my_bid[0]?.bid_amount,
            };
          }

          return commonData;
        });

        setCustomShipments(shipments);

      })
      .catch((error) => {
        console.log("Oops Error Occurred:", error);
      });
  }, [filter]);

  return (
    <div className="flex flex-col w-full px-2 md:pl-[84px] sm:pl-0">
      <ShipmentHeader />
      <div className="mt-4">
        <div className="w-full">
          <div className="flex justify-start flex-shrink-0 w-full overflow-x-auto bg-transparent">
            <div className={`whitespace-nowrap border ${filter === "all_shipments" ? "bg-primary-200 text-white" : "border-white bg-gray-400 text-black"} px-3 py-1 cursor-pointer`} onClick={() => setFilter("all_shipments")}>
              {t("shipmentPage.All")}
            </div>
            <div className={`whitespace-nowrap border ${filter === "pending" ? "bg-primary-200 text-white" : "border-white bg-gray-400 text-black"} px-3 py-1 cursor-pointer`} onClick={() => setFilter("pending")}>
              {t("shipmentPage.Pending")}
            </div>
            <div className={`whitespace-nowrap border ${filter === "pickup" ? "bg-primary-200 text-white" : "border-white bg-gray-400 text-black"} px-3 py-1 cursor-pointer`} onClick={() => setFilter("pickup")}>
              {t("shipmentPage.Pickup")}
            </div>
            <div className={`whitespace-nowrap border ${filter === "in_transit" ? "bg-primary-200 text-white" : "border-white bg-gray-400 text-black"} px-3 py-1 cursor-pointer`} onClick={() => setFilter("in_transit")}>
              {t("shipmentPage.In Transit")}
            </div>
            <div className={`whitespace-nowrap border ${filter === "delivered" ? "bg-primary-200 text-white" : "border-white bg-gray-400 text-black"} px-3 py-1 cursor-pointer`} onClick={() => setFilter("delivered")}>
              {t("shipmentPage.Delivered")}
            </div>
          </div>
          <DataTable columns={shipmentColumns} data={customShipments} />
        </div>
      </div>
    </div>
  );
};

export default ShipmentPage;
