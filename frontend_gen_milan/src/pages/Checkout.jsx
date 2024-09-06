import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import baseClient, { app_url } from '@/services/apiClient';



function Checkout() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [payment_data, setPaymentData] = useState();

    const [is_processing, setIs_processing] = useState(false);

    function createOrder() {
        setIs_processing(true);
        baseClient.post('/orders', {
            bid_id: id,
            return_url: `${app_url}success`,
            cancel_url: `${app_url}failure`
        }).then((response) => {
            if(response.data?.url){
                window.location.href = response.data?.url;
            }
            setIs_processing(false);
        });
     
        
    }

    const initialOptions = {
        clientId: "test",
        currency: "USD",
        intent: "capture",
    };


    useEffect(() => {
        baseClient.post(`/checkout/process`, {
            bid_id: id
        }).then((response) => {
            console.log("response : ", response.data);
            if (response?.data?.error) {
                toast.error(response.data.error);
            } else {
                setPaymentData(response.data);
            }
            setIsLoading(false);
        });


    }, [id])

    return (
        <div className="md:pl-[66px] sm:pl-0 flex flex-col">
            {isLoading && (
                <div className="spinner text-white w-full text-center py-3">Loading...</div>
            )}

            {!isLoading && (
                <div className="px-4 py-4 w-[30%] overflow-hidden">
                    <div className="bg-white p-6 max-lg:-order-1">
                        <h3 className="text-lg font-bold text-gray-800">Order Summary</h3>
                        <ul className="text-gray-800 mt-6 space-y-3">
                            <li className="flex flex-wrap py-1 text-sm">Shiping amount <span className="ml-auto font-bold">${payment_data?.shipping_amount}</span></li>
                            <li className="flex flex-wrap py-1 text-sm">Transaction Fee <span className="ml-auto font-bold">${payment_data?.transaction_fee}</span></li>
                            <li className="flex flex-wrap py-1 text-sm">Tax <span className="ml-auto font-bold">${payment_data?.tax}</span></li>
                            <hr className='my-3' />
                            <li className="flex flex-wrap gap-4 text-base font-bold">Total <span className="ml-auto">${payment_data?.sub_total}</span></li>
                        </ul>
                        <button disabled={is_processing} onClick={(e) => { createOrder() }} className='w-full rounded bg-blue-500 mt-3 text-white text-center py-1'>
                            {is_processing && (<>Processing...</>)}
                            {!is_processing && (<>Pay Now</>)}
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Checkout