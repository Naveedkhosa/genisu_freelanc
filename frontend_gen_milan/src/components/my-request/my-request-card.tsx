import { Calendar, FileBoxIcon, LocateIcon, Package } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import baseClient, { app_url } from "@/services/apiClient";
import { AiFillPhone, AiFillTruck } from "react-icons/ai";
import truck_2 from "@/assets/truck_2.png";
import { CiLocationArrow1 } from "react-icons/ci";
import { MdProductionQuantityLimits } from "react-icons/md";

const
  MyRequestCard = () => {
    const [refreshComponent, setRefreshComponent] = useState(false);
    const [shipment, setShipment] = useState<any>(null);
    const udata: any = localStorage.getItem('user');
    const user = JSON.parse(udata);
    const [order_by, setOrderBy] = useState<any>('asc');

    const { id } = useParams();


    useEffect(() => {
      if (['asc', 'desc'].includes(order_by)) {
        baseClient.get(`/shipments/${id}/${order_by}`).then((response) => {
          console.log("response : " + response.data);
          setShipment(response.data);
        }).then((error) => {
          console.log("error : " + error);
        });
      } else {
        baseClient.get(`/shipments/${id}`).then((response) => {
          console.log("response : " + response.data);
          setShipment(response.data);
        }).then((error) => {
          console.log("error : " + error);
        });
      }

    }, [refreshComponent, order_by]);



    const rejectBid = (bid: any) => {
      baseClient.get(`/reject-request-offer/${bid}`).then((response) => {
        console.log("response : " + response.data);
        setRefreshComponent(true);
      }).then((error) => {
        console.log("error : " + error);
      });
    }
    // const acceptBid = (bid: any) => {
    //     baseClient.get(`/accept-request-offer/${bid}`).then((response) => {
    //       console.log("response : " + response.data);
    //       setRefreshComponent(true);
    //     }).then((error) => {
    //       console.log("error : " + error);
    //     });
    // }

    let open_for_bid = true;

    if (shipment?.bids_count > 0) {
      shipment?.bids.forEach(bid => {
        if (open_for_bid) {
          if (bid.bid_status == 'Accepted') {
            open_for_bid = false;
          }
        }
      })
    }

    console.log('shipment', shipment);

    return (
      <>
        {!shipment && (
          <h1 className="text-center w-[100%] py-3 text-gray-300">
            Loading or no shipment was found
          </h1>
        )}
        {
          shipment && (
            <div className="flex flex-col w-full h-full lg:flex-row">
              <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 2xl:grid-cols-2 xl:w-[70%] lg:grid-cols-2 lg:[80%] w-full gap-4">


                <div className="flex flex-col p-2 py-4 pl-2 border bg-black bg-opacity-25 border-gray-500 shadow-md rounded-xl">
                  
                  <h4 className="flex items-center justify-between text-gray-300">Request Details <span className="py-2 text-sm text-grey">Tracking ID: {shipment.tracking_number}</span></h4>
                 

                    <div className="flex items-center space-x-* ">
                         <div className="w-full flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-300">Truck Type:</h4>
                          <p className="text-sm text-gray-300">{shipment?.truck_type}</p>
                        </div>
                       <img className="w-[100px]" src={truck_2} alt="" />
                    </div>

                  <h2 className="mb-2 text-2xl font-bold uppercase text-gray-300">$ {shipment?.expected_price}</h2>
                  <div className="flex items-center gap-2">
                      <CiLocationArrow1 className="mr-0 p-1 bg-green-300 rounded-full text-blue-500" size={26} />
                      <h4 className="text-sm font-bold text-gray-300">From:</h4>
                      <p className="text-sm text-gray-300">{shipment?.pickup_address}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                    <LocateIcon className="mr-0 p-1 bg-red-300 rounded-full text-blue-500" size={26} />
                      <h2 className="text-sm font-bold text-gray-300">To:</h2>
                      <p className="text-sm text-gray-300">{shipment?.destination_address}</p>
                    </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                     <Calendar className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-xs font-bold text-gray-300">Pickup:</h2>


                      <p className="text-sm text-gray-300">{shipment?.pickup_date}</p>
                    </div>
                    <div className="flex items-center">
                    <Calendar className="mr-1 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-xs font-bold text-gray-300">Drop:</h2>


                      <p className="text-sm text-gray-300">{shipment?.destination_date}</p>
                    </div>
                 
                    <div className="flex items-center gap-2">
                    <MdProductionQuantityLimits className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h4 className="text-xs font-bold text-gray-300">Quantity</h4>

                      <p className="text-sm text-gray-300">{shipment?.shipment_packages[0]?.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <Package className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-xs font-bold text-gray-300">Type of Pakage:</h2>

                      <p className="text-sm text-gray-300">Wood box</p>
                    </div>
                 
                    <div className="flex items-center gap-2">
                    <FileBoxIcon className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-xs font-bold text-gray-300">Body Type:</h2>
                      <p className="text-sm text-gray-300">{shipment?.truck_body_type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <AiFillPhone className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h4 className="text-xs font-bold text-gray-300">Drop Contact:</h4>
                      <p className="text-sm text-gray-300">{shipment?.drop_contact_phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <AiFillPhone className="mr-0 p-1 bg-blue-500 rounded-full text-yellow-500" size={24} />
                      <h2 className="text-xs font-bold text-gray-300">Pickup Contact:</h2>
                      <p className="text-sm text-gray-300">{shipment?.pickup_contact_phone}</p>
                    </div>
                  </div>
                </div>


                <div className="flex flex-col w-full overflow-y-scroll">

                  {/* bids select filter by low price and high price */}

                  {/* <div className="flex items-center gap-2 mt-4 mb-2">
                    <label htmlFor="bid-filter" className="text-gray-300">Sort by:</label>
                    <select onChange={(e) => { setOrderBy(e.target.value) }} id="bid-filter" className="px-2 py-1 border-2 border-gray-300 rounded-lg">
                      <option value="asc">Lowest Price</option>
                      <option value="desc">Highest Price</option>
                    </select>
                  </div> */}

<div className="flex items-center gap-2 mt-4 mb-2">

  <button
    onClick={() => setOrderBy('asc')}
    className={`px-2 py-1 border-2 rounded-lg ${order_by === 'asc' ? 'border-blue-500 bg-green-300 text-blue-500' : 'border-gray-500 text-gray-300  bg-black bg-opacity-25'}`}
  >
    Lowest Price
  </button>
  <button
    onClick={() => setOrderBy('desc')}
    className={`px-2 py-1 border-2 rounded-lg ${order_by === 'desc' ? 'border-blue-500 bg-green-300 text-blue-500' : 'border-gray-500 text-gray-300 bg-black bg-opacity-25'}`}
  >
    Highest Price
  </button>
</div>


                  {shipment?.bids_count == 0 && (
                    <p className="px-1 py-3 text-sm text-center text-grey">You have no bid yet</p>
                  )}

                  {shipment?.bids_count > 0 && (
                    shipment?.bids.map((bid: any) => {
                      return (
                        <div className="lg:w-[300px] w-full bg-black bg-opacity-25 p-2 border-b" key="1">
                          <div className="flex items-center gap-2">
                            <div className="relative w-12 h-12 overflow-hidden bg-gray-300 rounded-lg">
                              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&s" alt="" className="absolute object-cover w-full h-full rounded-lg" />
                            </div>
                            <div className="flex  flex-col">
                              <h2 className="text-2xl font-bold uppercase text-gray-300">$ {bid?.bid_amount}</h2>
                              <p className="text-gray-300">{bid.bidder.name}</p>
                            </div>
                          </div>
                          {
                            bid?.bid_status == "Accepted" && (
                              <div className="w-full mt-2 text-green-600">
                                {shipment?.customer?.name} accepted this offer
                              </div>
                            )
                          }
                          {
                            bid?.bid_status == "Rejected" && (
                              <div className="w-full mt-2 text-red-400">
                                {shipment?.customer?.name} rejected this offer
                              </div>
                            )
                          }

                          {
                            (open_for_bid && bid?.bid_status != "Accepted" && bid?.bid_status != "Rejected") && user.role === 'Customer' && (
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <Link to={`${app_url}checkout/${bid?.id}`} className="text-center text-white bg-green-600 rounded">Accept</Link>
                                <button className="text-white rounded bg-rose-700" onClick={() => { rejectBid(bid?.id) }}>Reject</button>
                              </div>
                            )
                          }

                        </div>
                      )
                    })
                  )}




                </div>

              </div>
            </div>
          )
        }
      </>
    );
  };

export default MyRequestCard;
