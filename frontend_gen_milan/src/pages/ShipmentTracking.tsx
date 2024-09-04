import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ShipmentTracking = () => {
    const { t } = useTranslation("global");
    const [tid, setTid] = useState("");

    const handleTracking = () => {
        if (tid) {
            window.location.href = `/track-shipment/${tid}`;
        } else {
            toast(t("shipment_tracking.Please enter a tracking ID"));
        }
    }

    return (
        <div className="w-full p-4 px-4 md:pl-[84px] sm:pl-0 text-white">
            <label htmlFor="trackingId" className="py-1 text-grey">{t("shipment_tracking.Tracking ID")}</label>
            <div className="w-full md:h-[50vh] sm: h-[30vh] flex flex-col justify-center items-center rounded overflow-hidden mt-1 border-grey-300">
                <div className="md:w-[calc(100%-100px)] sm: w-full ">
                    <input 
                        type="text" 
                        id="trackingId" 
                        value={tid} 
                        onChange={(e) => { setTid(e.target.value) }} 
                        className="w-full  text-white border border-gray-500 rounded bg-black bg-opacity-25 px-4 py-4 my-10 outline-none" 
                        placeholder={t("shipment_tracking.enter tracking number")} 
                    />
                </div>
                <button 
                    type="submit" 
                    onClick={handleTracking} 
                    className=" text-white bg-black bg-opacity-25 p-3 px-5 rounded  w-[100px]"
                >
                    {t("shipment_tracking.Search")}
                </button>
            </div>
        </div>
    )
}

export default ShipmentTracking;
