import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
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
  const [pickupCoordinates, setPickupCoordinates] = useState({lat:0,lng:0});
  const [destinationCoordinates, setDestinationCoordinates] = useState({lat:0,lng:0});
  const [fare, setFare] = useState("");
  const [description, setDescription] = useState("");

  const current_user = JSON.parse(localStorage.getItem("user"));

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

  const getRoute = async (origin, destination) => {
    try {
      toast("Route fetched successfully");
    } catch (error) {
      console.error("Error fetching route:", error);
      toast("Failed to fetch route");
    }
  };

  const [suggestions, setSuggestions] = useState([]);
  const [destsuggestions, setDestSuggestions] = useState([]);



  // coppied
  const fetchSuggestions = async (query, type) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.post("https://api.nextbillion.io/multigeocode/search?key=4497e6efb7ed4aba97da41643b621a5e", {
        query: query,
        at: { lat: position.lat, lng: position.lng },
        limit: 5,
      });
     
      if (response.data && response.data.entities) {
        const newSuggestions = response.data.entities.map(entity => entity.place);
        if (type == "pickup") {
          setSuggestions(newSuggestions);
        } else {
          setDestSuggestions(newSuggestions);
        }
      } else {
        if (type == "pickup") {
          setSuggestions([]);
        } else {
          setDestSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      if (type == "pickup") {
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



  const [locationStatus, setLocationStatus] = useState("unknown");
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0,
  });

  let watchId = null;

  if (current_user?.role == "Customer") {
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
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

  const nbmapRef = useRef(null);
  const markersRef = useRef({});
  

  useEffect(() => {
    if (dialogOpen) {
      nbmapRef.current = new NBMap({
        container: "map",
        zoom: 12,
        style: "https://api.nextbillion.io/maps/streets/style.json",
        center: position,
      });
    }
  }, [position]);


  const addOrUpdateMarker = (nbmap, obj,title) => {
    if (markersRef.current[obj.id]) {
      // Update marker position
      markersRef.current[obj.id].setLngLat({ lat: obj.lat, lng: obj.lng });
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

        nbmap.map.setCenter(obj);

      markersRef.current[obj.id] = marker;
      marker.togglePopup();
    }
  };

  const handleSuggestionClick = (suggestion:any) => {
    setPickupAddress(suggestion.address);
    setPickupCoordinates(suggestion.geopoint)
    addOrUpdateMarker(nbmapRef.current,suggestion.geopoint,"Pickup Location");
    setSuggestions([]);
  };






  const handleDestSuggestionClick = (suggestion) => {
    setDestinationAddress(suggestion.address);
    setDestinationCoordinates(suggestion.geopoint)
    addOrUpdateMarker(nbmapRef.current,suggestion.geopoint,"Destination");
    setDestSuggestions([]);
  };


  return (
    <>
      {(current_user?.role == "Admin" || current_user?.role == "Customer") && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button className="text-white shadow-sm bg-primary-200 hover:bg-slate-700">
              Create Request
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-lg w-[94%] sm:w-full">
            <DialogHeader></DialogHeader>
            <div className="w-full h-52" id="map"></div>
            <div className="grid grid-cols-2 gap-2 ">
              <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                <label htmlFor="pickupCity">Pickup Address</label>
                <div className="relative">
                  <input
                    id="pickupCity"
                    className="h-8 col-span-2 px-3 py-5 border rounded-sm w-[100%]"
                    placeholder="Pickup City"
                    value={pickupAddress}
                    onChange={(e) => {
                      onAddressInput(e.target.value);
                    }}
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 left-0 flex flex-col gap-2 p-3 bg-gray-100 top-11 ">
                      {suggestions.map((suggestion:any, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.address}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                <label htmlFor="destinationCity">Destination Address</label>
                <div className="relative">
                  <input
                    id="destinationCity"
                    className="h-8 col-span-2 py-5 px-3 border rounded-sm w-[100%]"
                    placeholder="Destination City"
                    value={destinationAddress}
                    onChange={(e) => {
                      onDestAddressInput(e.target.value);
                    }}
                  />
                  {destsuggestions.length > 0 && (
                    <ul className="absolute left-0 flex flex-col gap-2 p-3 bg-gray-100 top-11 ">
                      {destsuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleDestSuggestionClick(suggestion)}
                        >
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
                <Label
                  htmlFor="time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select time:
                </Label>
                <div className="relative">
                  <Input
                    type="time"
                    id="time"
                    className="text-sm leading-none text-gray-900 border border-gray-300 rounded bg-gray-50"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
              <div className="w-full mt-1">
                <Label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Date:
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <Button
                className="w-full bg-green-400 border hover:border-green-400"
                onClick={handleSubmit}
              >
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
