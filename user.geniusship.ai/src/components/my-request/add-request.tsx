import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import baseClient from "@/services/apiClient";
import { toast } from "sonner";
import nextbillion, { NBMap } from "@nbai/nbmap-gl";
import "@nbai/nbmap-gl/dist/nextbillion.css";
import axios from "axios";

nextbillion.setApiKey("4497e6efb7ed4aba97da41643b621a5e");

const AddRequest = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [time, setTime] = useState("00:00");
  const [date, setDate] = useState<Date>();
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState({ lat: 0, lng: 0 });
  const [destinationCoordinates, setDestinationCoordinates] = useState({ lat: 0, lng: 0 });
  const [fare, setFare] = useState("");
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [destsuggestions, setDestSuggestions] = useState([]);
  const [locationStatus, setLocationStatus] = useState("unknown");
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<any>();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef<any>(null);
  const current_user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (dialogOpen && mapContainerRef.current && !mapRef.current) {
      const nbmap = new NBMap({
        container: mapContainerRef.current,
        zoom: 12,
        style: "https://api.nextbillion.io/maps/streets/style.json",
        center: { lat: 28.63243, lng: 77.21879 },
      });

      nbmap.on("load", () => {
        setMapLoaded(true);
        mapRef.current = nbmap; 
      });
    }
  }, [dialogOpen, position]);

  const fetchSuggestions = async (query, type) => {
    if (!query) {
      if (type === "pickup") {
        setSuggestions([]);
      } else {
        setDestSuggestions([]);
      }
      return;
    }

    try {
      const response = await axios.post("https://api.nextbillion.io/multigeocode/search?key=4497e6efb7ed4aba97da41643b621a5e", {
        query: query,
        at: { lat: position.lat, lng: position.lng },
        limit: 5,
        "country":"IND"
      });

      if (response.data && response.data.entities) {
        const newSuggestions = response.data.entities.map(entity => entity.place);
        if (type === "pickup") {
          setSuggestions(newSuggestions);
        } else {
          setDestSuggestions(newSuggestions);
        }
      } else {
        if (type === "pickup") {
          setSuggestions([]);
        } else {
          setDestSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      if (type === "pickup") {
        setSuggestions([]);
      } else {
        setDestSuggestions([]);
      }
    }
  };

  const onAddressInput = (query) => {
    setPickupAddress(query);
    fetchSuggestions(query, 'pickup');
  };

  const onDestAddressInput = (query) => {
    setDestinationAddress(query);
    fetchSuggestions(query, 'destination');
  };

  const handleSuggestionClick = (suggestion) => {
    setPickupAddress(suggestion.address);
    setPickupCoordinates(suggestion.geopoint);
    setSuggestions([]);
  };

  const handleDestSuggestionClick = (suggestion) => {
    setDestinationAddress(suggestion.address);
    setDestinationCoordinates(suggestion.geopoint);
    setDestSuggestions([]);
  };


  useEffect(() => {
    console.log("pickup coords : ", pickupCoordinates);
    console.log("destinationCoordinates : ", destinationCoordinates);
    if (pickupCoordinates.lat != 0 && pickupCoordinates.lng != 0) {
      addOrUpdateMarker(mapRef.current, pickupCoordinates, "Pickup Location", "pickup");
    }
    if (destinationCoordinates.lat != 0 && destinationCoordinates.lng != 0) {
      addOrUpdateMarker(mapRef.current, destinationCoordinates, "Destination", "destination");
    }

    if (pickupCoordinates.lat != 0 && pickupCoordinates.lng != 0 && destinationCoordinates.lat != 0 && destinationCoordinates.lng != 0) {
      drawRoute();
    }

  }, [destinationCoordinates, pickupCoordinates])


  useEffect(()=>{
    if(locationStatus!="accessed"){
      toast("Please allow location to see proper locations on map");
    }
  },[locationStatus])

 

  const addOrUpdateMarker = (nbmap, obj, title, type) => {
    if (markersRef.current[type]) {
      markersRef.current[type].setLngLat({ lat: obj.lat, lng: obj.lng });
    } else {
      // Create new marker
      const popup = new nextbillion.maps.default.Popup({
        offset: 25,
        closeButton: false,
      }).setText(title);

      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(/locicon.png)';
      el.style.backgroundSize = 'cover';
      el.style.width = '70px';
      el.style.height = '70px';

      const marker = new nextbillion.maps.default.Marker({
        element: el,
      })
        .setLngLat({ lat: obj.lat, lng: obj.lng })
        .setPopup(popup)
        .addTo(nbmap.map);

      markersRef.current[type] = marker;
      marker.togglePopup();
    }
  };

  const reverseGeocode = async (coords:any, type:any) => {
    try {
      const response = await axios.get("https://api.nextbillion.io/reverse-geocode", {
        params: {
          key: "4497e6efb7ed4aba97da41643b621a5e",
          lat: coords.lat,
          lng: coords.lng,
        },
      });

      if (response.data && response.data.features.length > 0) {
        const address = response.data.features[0].properties.formatted_address;
        if (type === "pickup") {
          setPickupAddress(address);
        } else {
          setDestinationAddress(address);
        }
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  

  const drawRoute = async () => {
    if (!pickupCoordinates || !destinationCoordinates || !mapRef.current) return;

    if (pickupCoordinates.lat === 0 && pickupCoordinates.lng === 0 || destinationCoordinates.lat === 0 && destinationCoordinates.lng === 0) {
      console.error("Invalid coordinates for drawing route");
      return;
    }

    try {
      const response = await axios.get("https://api.nextbillion.io/navigation/json", {
        params: {
          key: "4497e6efb7ed4aba97da41643b621a5e",
          origin: `${pickupCoordinates.lat},${pickupCoordinates.lng}`,
          destination: `${destinationCoordinates.lat},${destinationCoordinates.lng}`,
          mode: "truck",
          overview: "simplified",
        },
      });

      if (response.data.status === "Ok" && response.data.routes.length > 0) {
        const route = response.data.routes[0].geometry;
        console.log(route);
      }
    } catch (error) {
      console.error("Error drawing route:", error);
      toast("Failed to draw route");
    }
  };

  const handleSubmit = async () => {
    const data = {
      pickup_address: pickupAddress,
      destination_address: destinationAddress,
      pickup_coordinates: JSON.stringify(pickupCoordinates),
      destination_coordinates: JSON.stringify(destinationCoordinates),
      fare: parseFloat(fare),
      description,
      time,
      date: date?.toISOString().split("T")[0],
    };

    const response = await baseClient.post("/requests", data);

    if (response.status === 201) {
      toast("Request created successfully");
    } else {
      toast("Failed to create request");
    }
  };

  useEffect(() => {
    if (current_user?.role === "Customer") {
      if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
            setLocationStatus("accessed");
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setLocationStatus("denied");
                break;
              case error.POSITION_UNAVAILABLE:
                setLocationStatus("unknown");
                break;
              case error.TIMEOUT:
                setLocationStatus("error");
                break;
              default:
                setLocationStatus("error");
                break;
            }
          }
        );
      }
    }
  }, [current_user?.role]);

  return (
    <>
      {(current_user?.role === "Admin" || current_user?.role === "Customer") && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-white shadow-sm bg-primary-200 hover:bg-slate-700">
              Create Request
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-lg w-[94%] sm:w-full">
            <DialogHeader>
              <DialogTitle>Create a New Request</DialogTitle>
              <DialogDescription>Fill in the details below to create a new request.</DialogDescription>
            </DialogHeader>
            <div className="w-full h-52" ref={mapContainerRef} id="map"></div>
            <div className="grid grid-cols-2 gap-2 ">
              <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                <Label htmlFor="pickupCity">Pickup Address</Label>
                <div className="relative">
                  <Input
                    id="pickupCity"
                    className="h-8 col-span-2 px-3 py-5 border rounded-sm w-[100%]"
                    placeholder="Pickup City"
                    value={pickupAddress}
                    onChange={(e) => onAddressInput(e.target.value)}
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 left-0 flex flex-col gap-2 p-3 bg-gray-100 top-11 ">
                      {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                          {suggestion.address}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                <Label htmlFor="destinationCity">Destination Address</Label>
                <div className="relative">
                  <Input
                    id="destinationCity"
                    className="h-8 col-span-2 py-5 px-3 border rounded-sm w-[100%]"
                    placeholder="Destination City"
                    value={destinationAddress}
                    onChange={(e) => onDestAddressInput(e.target.value)}
                  />
                  {destsuggestions.length > 0 && (
                    <ul className="absolute z-10 left-0 flex flex-col gap-2 p-3 bg-gray-100 top-11 ">
                      {destsuggestions.map((suggestion:any, index:any) => (
                        <li key={index} onClick={() => handleDestSuggestionClick(suggestion)}>
                          {suggestion.address}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid items-center grid-cols-1 gap-2 mt-1">
                <Label htmlFor="fare">Fare</Label>
                <Input
                  id="fare"
                  className="h-8 col-span-2 py-5"
                  placeholder="Enter Fare ..."
                  value={fare}
                  onChange={(e) => setFare(e.target.value)}
                />
              </div>
              <div className="w-full mt-1">
                <Label htmlFor="description" className="sm:hidden">
                  Cargo Description
                </Label>
                <Textarea
                  id="description"
                  className="w-full h-8 col-span-2 outline-none ring-0 focus:ring-0 focus:outline-none active:outline-none active:ring-0 focus:ring-offset-0"
                  placeholder="Cargo Description here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="w-full mt-1">
                <Label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select time:
                </Label>
                <div className="relative">
                  <Input
                    type="time"
                    id="time"
                    className="text-sm leading-none text-gray-900 border border-gray-300 rounded bg-gray-50"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="w-full mt-1">
                <Label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select Date:
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <Button className="w-full bg-green-400 border hover:border-green-400" onClick={handleSubmit}>
                Create Request
              </Button>
              <Button className="w-full border border-rose-400 hover:bg-rose-400">
                Cancel Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddRequest;
