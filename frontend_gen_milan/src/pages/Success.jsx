import { useEffect, useState } from "react";
import baseClient from '@/services/apiClient';
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Success() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const [response, setResponse] = useState();
    const [is_processing, setIs_processing] = useState(true);

    useEffect(() => {
        if (token) {
            baseClient.post('/checkout/success', {
                token: token,
            }).then((response) => {
                setIs_processing(false);
                setResponse(response.data);
                if ('success' in response?.data && response?.data?.success) {
                    toast.success(response?.data?.message);
                }

                if ('error' in response?.data && response?.data?.error) {
                    toast.error(response?.data?.message);
                }

            }).then(error => {
                setIs_processing(false);
                console.log("error :", error);
            });
        } else {
            setIs_processing(false);
            toast.error("No detail was found!!");
        }
    }, [token])
    return (
        <>
            {is_processing && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}

            {!is_processing && (
                <div className="md:pl-[66px] sm:pl-0 flex flex-col items-center py-5">

                    {response?.success && (
                        <div className="px-2 text-center bg-white rounded mb-2">
                            <h2 className="text-sm text-green-500 p-2">
                                {response?.message}
                            </h2>
                        </div>
                    )}

                    {response?.error && (
                        <div className="px-2 text-center bg-white rounded mb-2">
                            <h2 className="text-sm text-red-500 p-2">
                                {response?.message}
                            </h2>
                        </div>
                    )}


                    <div className="flex items-center justify-center">
                        <Link to="/dashboard" className="text-sm text-gray-200 mx-2 hover:text-gray-900">
                            Dashboard
                        </Link>
                        <span className="mx-4 text-white">|</span>
                        <Link to="/track-shipment" className="text-sm text-gray-200 mx-2 hover:text-gray-900">
                            Track Shipment
                        </Link>
                        <span className="mx-4 text-white">|</span>
                        <Link to="/live-chat" className="text-sm text-gray-200 mx-2 hover:text-gray-900">
                            Help
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default Success