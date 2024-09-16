import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ShipmentHeader = () => {
  const { t } = useTranslation("global");  // Use the translation hook
  const user = localStorage.getItem("user");
  const current_user = user ? JSON.parse(user) : null;



  return (
    <div className="flex justify-between w-full my-5">
      <div className="flex items-center gap-3">
        <h2 className="mr-3 text-xl font-bold text-white">{t('shipment_header.Shipments')}</h2>
      </div>
      <div className="flex gap-2">
        <Link to="/create-request" className="px-2 py-2 text-xs font-semibold text-center text-white rounded  bg-black bg-opacity-25">
          {t('shipment_header.Create Request')}
        </Link>
        {current_user?.role == "Driver" && (
          <Link to="/multi-pickup" className="px-2 py-2 text-xs font-semibold text-center text-white rounded  bg-black bg-opacity-25">
            {t('shipment_header.Multi Pickup')}
          </Link>
        )}
        <Link to="/shipping-invoice" className="px-4 py-2 text-sm font-semibold text-center text-white rounded  bg-black bg-opacity-25">
          {t('shipment_header.Shipping Invoice')}
        </Link>
      </div>
    </div>
  );
};

export default ShipmentHeader;
