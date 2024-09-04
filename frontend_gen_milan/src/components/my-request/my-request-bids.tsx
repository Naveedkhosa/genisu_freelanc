import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import baseClient from "@/services/apiClient";
import { useEffect, useState } from "react";

const MyRequestBids = () => {
    const { id } = useParams(); // Request ID
    const [bids, setBids] = useState([]);

   
    
    const acceptOffer = (bidId) => {
        baseClient.get(`/accept-request-offer/${id}/${bidId}`)
            .then((response) => {
                // Update bids state after acceptance
                
                setBids((prevBids) =>
                    prevBids.map((bid) =>
                        

                        bid.id === bidId
                            
                            ? { ...bid, bid_status: 'Accepted' }
                            
                            : { ...bid, bid_status: 'Rejected' }
                    )
                );
                console.log('Offer accepted:', response.data);
            })
            .catch((error) => {
                console.error('Error accepting offer:', error);
            });
    };
    
    const rejectOffer = (bidId) => {
        baseClient.get(`/reject-request-offer/${id}/${bidId}`)
            .then((response) => {
                // Update bids state after rejection
                
                setBids((prevBids) =>
                    prevBids.map((bid) =>
                        
                        bid.id === bidId
                            
                            ? { ...bid, bid_status: 'Rejected' }
                            : bid
                    )
                );
                console.log('Offer rejected:', response.data);
            })
            .catch((error) => {
                console.error('Error rejecting offer:', error);
            });
    };

    return (
        // <div className="flex flex-col overflow-y-scroll w-fit">
        //     {bids.map((bid) => {
        //             
        //         const user = bid.driver || bid.transporter; // Assuming only one will be present
        //         const userName = user ? user.name : 'Unknown';
        //         const userImage = user ? `https://unsplash.com/random/300x300` : ''; // Replace with actual image if available

        //         return (
        //              
        //             <div className="w-[300px] p-2 border-b" key={bid.id}>
        //                 <div className="flex items-center gap-2">
        //                     <div className="relative w-12 h-12 overflow-hidden bg-gray-300 rounded-lg">
        //                         <img src={userImage} alt="" className="absolute object-cover w-full h-full rounded-lg" />
        //                     </div>
        //                     <div className="flex flex-col">
        //                        
        //                         <h2 className="text-2xl font-bold uppercase">{bid.bid_amount} USD</h2>
        //                         <p>{userName}</p>
        //                     </div>
        //                 </div>
        //                 <div className="grid grid-cols-2 gap-2 mt-2">
        //                         
        //                     {bid.bid_status === 'Pending' ? (
        //                         <>
        //                             <Button
        //                                 className="text-white bg-green-600"
        //                                
        //                                 onClick={() => acceptOffer(bid.id)}
        //                             >
        //                                 Accept
        //                             </Button>
        //                             <Button
        //                                 className="text-white bg-rose-700"
        //                                   
        //                                 onClick={() => rejectOffer(bid.id)}
        //                             >
        //                                 Reject
        //                             </Button>
        //                         </>
        //                     ) : (
        //                          
        //                         <span className={`text-lg ${bid.bid_status === 'Accepted' ? 'text-green-600' : 'text-rose-700'}`}>
        //                                 
        //                             {bid.bid_status}
        //                         </span>
        //                     )}
        //                 </div>
        //             </div>
        //         );
        //     })}
        // </div>
        <div className="flex flex-col overflow-y-scroll w-full">
            <div className="lg:w-[300px] w-full p-2 border-b" key="1">
                <div className="flex items-center gap-2">
                    <div className="relative w-12 h-12 overflow-hidden bg-gray-300 rounded-lg">
                        <img src="https://unsplash.com/random/300x300" alt="" className="absolute object-cover w-full h-full rounded-lg" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold uppercase">100 USD</h2>
                        <p>John Doe</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button className="text-white bg-green-600">Accept</button>
                    <button className="text-white bg-rose-700">Reject</button>
                </div>
            </div>
            <div className="lg:w-[300px] w-full p-2 border-b" key="2">
                <div className="flex items-center gap-2">
                    <div className="relative w-12 h-12 overflow-hidden bg-gray-300 rounded-lg">
                        <img src="https://unsplash.com/random/300x300" alt="" className="absolute object-cover w-full h-full rounded-lg" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold uppercase">150 USD</h2>
                        <p>Jane Smith</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button className="text-white bg-green-600">Accept</button>
                    <button className="text-white bg-rose-700">Reject</button>
                </div>
            </div>
            <div className="lg:w-[300px] w-full p-2 border-b" key="3">
                <div className="flex items-center gap-2">
                    <div className="relative w-12 h-12 overflow-hidden bg-gray-300 rounded-lg">
                        <img src="https://unsplash.com/random/300x300" alt="" className="absolute object-cover w-full h-full rounded-lg" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold uppercase">200 USD</h2>
                        <p>Bob Johnson</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button className="text-white bg-green-600">Accept</button>
                    <button className="text-white bg-rose-700">Reject</button>
                </div>
            </div>
        </div>
    );
};

export default MyRequestBids;
