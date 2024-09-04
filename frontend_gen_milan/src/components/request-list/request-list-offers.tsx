import { Calendar, Clock2Icon } from "lucide-react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { Button } from "@/components/ui/button";
// import markerIconPng from "leaflet/dist/images/marker-icon.png";
// import markerIconShadowPng from "leaflet/dist/images/marker-shadow.png";
// import logo from "./../../assets/bg.jpg";
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import baseClient from "@/services/apiClient";
// Create a custom icon
// const defaultIcon = L.icon({
//   iconUrl: markerIconPng,
//   shadowUrl: markerIconShadowPng,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

const RequestListOffers = () => {
//   const [request, setRequest] = useState();
//   const [position, setPosition] = useState<[number, number] | null>(null);
//   const [canApply, setCanApply] = useState(true); // State to control button enabled/disabled
//   const [bidAmount, setBidAmount] = useState(""); // State for bid amount
//   const { id } = useParams();
//   let user = localStorage.getItem("user");
//   user = user ? JSON.parse(user) : null;

//   useEffect(() => {
//     const getLocation = () => {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         setPosition([latitude, longitude]);
//       });
//     };
//     getLocation();
//   }, []);

//   useEffect(() => {
//     baseClient
//       .get(`/request/${id}`)
//       .then((response) => {
//         setRequest(response.data);
//       })
//       .catch((error) => {
//         toast("Error fetching request : "+error);
//       });
//   }, [id]);

//   useEffect(() => {
//     if (user && request) {
//       baseClient
//         
//         .get(`/current-user/${user.id}/${request.id}`)
//         .then((response) => {
//           console.log("Checking Response", response);
//           if (response.status === 200) {
//             setCanApply(true); // User can apply
//           } else {
//             setCanApply(false); // User has already applied
//           }
//         })
//         .catch((error) => {
//           setCanApply(false); // User has already applied
//           console.log("Error checking application status.", error);
//         });
//     }
//   }, [user, request]);

//   const handleSendOffer = () => {
//     if (!user) {
//       toast("No user data found in local storage.");
//       return;
//     }

//     // Check if the user has already applied
//     baseClient
//       
//       .get(`/current-user/${user.id}/${request.id}`)
//       .then((response) => {
//         if (response.status === 200) {
//           // User can apply, proceed with sending the bid
//           const bidData = {
//               
//             request_id: response.id,
//             bid_amount: parseFloat(bidAmount),
//               
//             [user.role === "Driver" ? "driver_id" : "transporter_id"]: user.id,
//           };

//           baseClient
//             .post("/bids", bidData)
//             .then(() => {
//               toast("Bid submitted successfully.");
//               // Optionally, handle success, e.g., show a success message
//             })
//             .catch((error) => {
//               toast("Error submitting bid : "+error);
//               // Optionally, handle error, e.g., show an error message
//             });
//         } else {
//           // Handle the case where the user has already applied
//           toast(response.data.message);
//         }
//       })
//       .catch(() => {
//         toast("You have already submitted the bid.");
//       });
//   };

//   if (!request) {
//     return <div>Loading...</div>;
//   }

//   const {
//     pickup_city,
//     pickup_address,
//     destination_city,
//     destination_address,
//     pickup_coordinates,
//     destination_coordinates,
//     fare,
//     time,
//     date,
//     user: requestUser,
//   } = request;

 
//   let pickupCoords, destinationCoords;
//   try {
//     pickupCoords = JSON.parse(pickup_coordinates);
//     destinationCoords = JSON.parse(destination_coordinates);
//   } catch (error) {
//     console.error("Error parsing coordinates:", error);
//   }

//   const path = [pickupCoords, destinationCoords];

//   console.log("canApply", canApply);

  return (
   {/**
     <div className="flex flex-col w-full overflow-y-scroll">
      <div className="flex flex-col p-2 py-4 pl-2 border shadow-md rounded-xl">
        <div className="p-8">
          {position && pickupCoords && destinationCoords && (
            <MapContainer
              center={pickupCoords}
              zoom={13}
              style={{ height: "250px", width: "100%" }}
              className="rounded-md"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={pickupCoords} icon={defaultIcon}>
                <Popup>Pickup Location</Popup>
              </Marker>
              <Marker position={destinationCoords} icon={defaultIcon}>
                <Popup>Destination Location</Popup>
              </Marker>
              {position && (
                <Marker position={position} icon={defaultIcon}>
                  <Popup>You are here!</Popup>
                </Marker>
              )}
              <Polyline positions={path} color="blue" />
            </MapContainer>
          )}
        </div>
        <h2 className="mt-2 text-2xl font-bold uppercase">{fare} USD</h2>
        <div className="flex items-center px-2 py-1 pl-1 text-white rounded bg-primary-200 w-fit">
          <Clock2Icon className="mr-1" size={16} />
          <span>{time}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2" size={16} />
          Pickup: {date}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-4 border-green-500 rounded-full"></div>
          <h4 className="text-base font-bold">From:</h4>
          <p>
            {pickup_city}, {pickup_address}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-4 border-blue-500 rounded-full"></div>
          <h2 className="text-base font-bold">To:</h2>
          <p>
            {destination_city}, {destination_address}
          </p>
        </div>
        <div className="flex items-center gap-2">
       
          <h4 className="bold">Customer: {requestUser.name} </h4>
          <div className="relative w-10 h-10 overflow-hidden rounded-full">
            <img src={logo} alt="User logo" />
          </div>
        </div>
        <div className="mt-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="bidAmount"
          >
            Enter your bid amount (USD):
          </label>
          <input
            type="number"
            id="bidAmount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="Enter your bid amount"
          />
        </div>
        {canApply && (
          <Button
            className="mt-2 text-white bg-primary-200"
            onClick={handleSendOffer}
          >
            Send My Offer
          </Button>
        )}
      </div>
    </div>
    */}
  );
};

export default RequestListOffers;
