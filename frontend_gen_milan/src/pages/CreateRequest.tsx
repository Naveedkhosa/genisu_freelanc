import { BsBoxSeam } from "react-icons/bs";
import Truck from '@/assets/truck.png';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TbRulerMeasure } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import baseClient from "@/services/apiClient";
import { nb_key } from "@/services/apiClient";
import nextbillion, { NBMap } from "@nbai/nbmap-gl";
import "@nbai/nbmap-gl/dist/nextbillion.css";
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { FaMapLocationDot } from "react-icons/fa6";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import axios from "axios";

export function CreateRequest() {
    const { t } = useTranslation("global");
    let tabValues = ["pickup"];
    const [currentTab, setCurrentTab] = useState("pickup");
    const [current_user, setCurrentUser] = useState<any>();
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();
    const [refreshComponent, setRefreshComponent] = useState(false);
    const [pop_up_top, setPopupTop] = useState(" top-[-110%] ");
    const [user_address_loading, setUserAddressLoading] = useState(true);
    const [packages, setPackages] = useState([]);
    const [truck_types, setTruckTypes] = useState([]);
    const [truck_body_types, setTruckBodyTypes] = useState([]);

    const showNewAddressPopup = () => {
        setPopupTop(" top-0 ");
    }
    const hideNewAddressPopup = () => {
        setPopupTop(" top-[-110%] ");
    }

    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        if (token === "") {
            navigate("/auth/login");
        } else {
            baseClient.get("user")
                .then((response) => {
                    setCurrentUser(response.data);
                })
                .catch((error) => {
                    if (error.response.statusText === "Unauthorized") {
                        navigate("/auth/login");
                    }
                });
        }
    }, [token]);

    useEffect(() => {
        if (current_user?.id) {
            if (current_user?.role !== "Customer") {
                navigate("/dashboard");
            }
            baseClient.get(`/user-addresses/${current_user?.id}`)
                .then((response) => {
                    setUserAddressLoading(false);
                    setAddresses(response.data);
                })
                .catch((error) => {
                    toast("Error Occured While fetching addresses:", error);
                });
        }
    }, [current_user, refreshComponent]);

    const [current_location, setCurrentLocation] = useState<any>();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    }, []);

    const [pickup_address, setPickupAddress] = useState<any>();
    const [selected_address_id, setSelectedAddressId] = useState<any>();
    const [pickup_coordinates, setPickupCoordinates] = useState<any>();
    const [destination_address, setDestinationAddress] = useState<any>();
    const [destination_coordinates, setDestinationCoordinates] = useState<any>();
    const [pickup_date, setPickupDate] = useState<any>();
    const [pickup_time, setPickupTime] = useState<any>();
    const [destination_date, setDestinationDate] = useState<any>();
    const [quantity, setQuantity] = useState<any>();
    const [type, setType] = useState<any>();
    const [length, setLength] = useState<any>();
    const [wide, setWide] = useState<any>();
    const [height, setHeight] = useState<any>();
    const [unit_weight, setUnitWeight] = useState<number>();
    const [total_weight, setTotalWeight] = useState<number>();
    const [length_of_goods, setLengthOfGoods] = useState<any>();
    const [type_of_goods, setTypeOfGoods] = useState<any>();
    const [truck_type, setTruckType] = useState<number>();
    const [truck_body_type, setTruckBodyType] = useState<number>();
    const [expected_price, setExpectedPrice] = useState<number>();
    const [notes, setNotes] = useState<any>();
    const [pickup_contact, setPickupContact] = useState<any>();
    const [pickup_name, setPickupName] = useState<any>();
    const [drop_contact, setDropContact] = useState<any>();
    const [drop_name, setDropName] = useState<any>();

    useEffect(() => {
        if (pickup_address && destination_address && pickup_coordinates && destination_coordinates && pickup_date && destination_date && pickup_time) {
            tabValues.push("package");
        } else {
            tabValues = tabValues.filter(value => value !== "package");
        }

        if (quantity && type && length && wide && height && unit_weight && length_of_goods && total_weight && type_of_goods) {
            tabValues.push("TruckType");
        } else {
            tabValues = tabValues.filter(value => value !== "TruckType");
        }
        if (truck_type && truck_body_type) {
            tabValues.push("details");
        } else {
            tabValues = tabValues.filter(value => value !== "details");
        }
    }, [pickup_address, destination_address, pickup_date, destination_date, pickup_time, tabValues, pickup_coordinates, destination_coordinates, quantity, type, length, wide, height, unit_weight, expected_price,notes, pickup_contact, pickup_name, drop_contact, drop_name]);

    const deleteSelectedAddress = () => {
        baseClient.delete(`delete-address/${selected_address_id}`)
            .then(() => {
                toast(t("create_request.Address Deleted Successfully"));
                setPickupAddress("");
                setSelectedAddressId("");
                setPickupCoordinates({});
                setRefreshComponent(!refreshComponent);
            })
            .catch((error) => {
                toast("Error Occured While Deleting Address:", error);
            });
    }

    const [suggestions, setSuggestions] = useState([]);
    const [destsuggestions, setDestSuggestions] = useState([]);

    const onAddressInput = (query: any) => {
        fetchSuggestions(query, 'pickup');
    };

    const fetchSuggestions = async (query: any, type: any) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.post(`https://api.nextbillion.io/multigeocode/search?key=${nb_key}`, {
                query: query,
                at: { lat: current_location?.lat, lng: current_location?.lng },
                limit: 5,
                country: "IND",
            });

            if (response.data && response.data.entities) {
                const newSuggestions = response.data.entities.map((entity: any) => entity.place);
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

    const handleSuggestionClick = (suggestion: any) => {
        setPickupAddress(suggestion.address);
        setPickupCoordinates(suggestion.geopoint)
        setSuggestions([]);
    };
    const handleDestSuggestionClick = (suggestion: any) => {
        setDestinationAddress(suggestion.address);
        setDestinationCoordinates(suggestion.geopoint)
        setDestSuggestions([]);
    };

    const onDestAddressInput = (query: any) => {
        setDestinationAddress(query);
        fetchSuggestions(query, 'destination');
    };

    const nbmapRef = useRef<any>(null);
    useEffect(() => {
        if (pop_up_top === " top-0 ") {
            nbmapRef.current = new NBMap({
                container: "map",
                zoom: 12,
                style: "https://api.nextbillion.io/maps/streets/style.json",
                center: { lat: 6.5244, lng: 3.3792 },
            });

            nbmapRef.current.map.on('click', (e: any) => {
                console.log("Hello I am here ", e);
            })
        }
    }, [pop_up_top]);

    useEffect(() => {
        baseClient.get("truck-types")
            .then((response) => {
                setTruckTypes(response.data);
            }).catch((error) => {
                toast("Error Occured While fetching truck types:", error);
            });

        baseClient.get("truck-body-types")
            .then((response) => {
                setTruckBodyTypes(response.data);
            }).catch((error) => {
                toast("Error Occured While fetching truck body types:", error);
            });
        baseClient.get("packages")
            .then((response) => {
                setPackages(response.data);
            })
            .catch((error) => {
                toast("Error Occured While fetching package types:", error);
            });

    }, [])

    const handleNext = () => {
        const currentIndex = tabValues.indexOf(currentTab);
        if (currentIndex < tabValues.length - 1) {
            setCurrentTab(tabValues[currentIndex + 1]);
        }
    };

    const handleSubmit = async () => {
        const data = {
            pickup_address,
            pickup_coordinates: JSON.stringify(pickup_coordinates),
            destination_address,
            destination_coordinates: JSON.stringify(destination_coordinates),
            pickup_date: pickup_date.toISOString().split('T')[0],
            pickup_time,
            destination_date: destination_date.toISOString().split('T')[0],
            expected_price,
            notes,
            pickup_contact,
            pickup_name,
            drop_name,
            drop_contact,
            total_weight,
            type_of_goods,
            length_of_goods,
            truck_body_type,
            truck_type,
            shipment_packages: [
                {
                    quantity,
                    type_of_package: type,
                    length,
                    wide,
                    height,
                    unit_weight,
                }
            ]
        };

        baseClient.post('shipments', data)
            .then(() => {
                toast(t('create_request.Request created Successfully'));
                setTimeout(() => {
                    navigate('/shipment', { replace: true });
                }, 2000)
            })
            .catch((error) => {
                toast("Error Occured While creating new shipment:", error);
            });
    };

    return (
        <div className="flex items-center justify-center w-full h-full mt-6 ">
            <div className={`fixed left-0 [${pop_up_top}] z-[10000] w-full flex items-center justify-center min-w-screen h-screen animated fadeIn faster inset-0 outline-none focus:outline-none bg-no-repeat bg-center bg-cover px-2`}>
                <div className="w-[100%] max-w-[500px]">
                    <div className="absolute inset-0 z-0 bg-black opacity-80"></div>
                    <div className="p-4  relative z-[10000]">
                        <div className="grid grid-cols-1 gap-2 mt-4 mb-4">
                            <Label htmlFor="SearchAddress">{t("create_request.Enter Address")}</Label>
                            <div className="relative">
                                <Input
                                    onChange={(e) => {
                                        onAddressInput(e.target.value);
                                    }}
                                    id="SearchAddress"
                                    className="h-8  px-3 py-5 border rounded-sm w-[100%]"
                                    placeholder={t("create_request.Enter Address")}
                                />
                                {suggestions.length > 0 && (
                                    <div className="z-[10000] absolute w-full bg-white border h-[140px] overflow-y-auto border-gray-300 rounded-sm mt-1">
                                        {suggestions.map((suggestion: any, index) => (
                                            <p key={index} onClick={() => handleSuggestionClick(suggestion)} className="p-2 cursor-pointer hover:bg-gray-200">{suggestion.address}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div id="map" className="grid grid-cols-2 w-full h-[300px] border border-solid border-grey-200 rounded"></div>
                        <div className="gap-1 py-3 mt-2 text-center md:block">
                            <Button onClick={() => { hideNewAddressPopup() }} className="w-1/2 px-5 py-2 mb-2 text-sm font-medium tracking-wider text-gray-600 bg-white border rounded shadow-sm md:mb-0 hover:shadow-lg hover:bg-gray-100">{t("create_request.Close")}</Button>
                            <Button className="w-1/2 p-2 my-2 text-white rounded bg-slate-900">{t("create_request.Save Address")}</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex  bg-black bg-opacity-25 flex-col lg:flex-row w-full lg:w-[90%] lg:h-[700px] rounded-lg">
                <div className="lg:w-[300px] w-full flex-wrap lg:h-full py-4 lg:py-0 bg-primary-200 lg:order-1 rounded-lg overflow-x-scroll lg:overflow-x-visible">
                    <TabsList className="flex flex-row justify-between w-full gap-4 bg-transparent lg:flex-col">
                        <TabsTrigger value="pickup" className="w-full flex justify-start items-center relative gap-4 data-[state=active]:bg-transparent ">
                            <span className={`w-10 h-10 text-xl self-start font-bold border rounded-full flex  items-center justify-center lg:-ml-[36px]  border-gray-400` + `${(currentTab === "pickup") ? " bg-green-400 text-primary-200" : " bg-white text-gray-400"}`}>1</span>
                            <span className="font-bold text-white cursor-pointer ">{t("create_request.Pickup Location")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="package" className="w-full flex justify-start items-center relative gap-4 data-[state=active]:bg-transparent">
                            <span className={`w-10 h-10 text-xl self-start font-bold border rounded-full flex  items-center justify-center lg:-ml-[36px]   border-gray-400` + `${(currentTab === "package") ? " bg-green-400 text-primary-200" : " bg-white text-gray-400"}`}>2</span>
                            <span className="font-bold text-white">{t("create_request.Package Details")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="TruckType" className="w-full flex justify-start items-center relative gap-4 data-[state=active]:bg-transparent">
                            <span className={`w-10 h-10 text-xl self-start font-bold border rounded-full flex  items-center justify-center lg:-ml-[36px]   border-gray-400` + `${(currentTab === "TruckType") ? " bg-green-400 text-primary-200" : " bg-white text-gray-400"}`}>3</span>
                            <span className="font-bold text-white">{t("create_request.Truck Type")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="details" className="w-full flex justify-start items-center relative gap-4 data-[state=active]:bg-transparent">
                            <span className={`w-10 h-10 text-xl self-start font-bold border rounded-full flex  items-center justify-center lg:-ml-[36px]   border-gray-400` + `${(currentTab === "details") ? " bg-green-400 text-primary-200" : " bg-white text-gray-400"}`}>4
                            </span>
                            <span className="font-bold text-white">{t("create_request.Other Details")}</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="w-full h-full text-white ">
                    <TabsContent value="pickup">
                        <div className="w-full px-3 bg-transparent md:px-8">
                            <div className="relative flex flex-col items-center w-full overflow-hidden ">
                                <div className="w-fit">
                                    <div className="relative flex flex-col items-center overflow-hidden">
                                        <FaMapLocationDot className="text-[50px] text-primary-200 my-4" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full gap-4 md:flex-row">
                                <div className="w-full mt-4">
                                    <h2 className="mb-4 text-xl font-bold">{t("create_request.Pickup Details")}</h2>
                                    <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                                        <Label htmlFor="pickAdd">{t("create_request.Pickup Address")}</Label>
                                        <div className="relative">
                                            <Input
                                                id="pickAdd"
                                                className="h-8 px-3 py-5  bg-black bg-opacity-25 border rounded-sm w-[100%]"
                                                placeholder={t("create_request.Pickup Address")}
                                                value={pickup_address}
                                                onChange={(e) => {
                                                    onAddressInput(e.target.value);
                                                }}
                                            />
                                            {suggestions.length > 0 && (
                                                <div className="z-[1000] absolute w-full  bg-black bg-opacity-25border h-[140px] overflow-y-auto border-gray-300 rounded-sm mt-1">
                                                    {suggestions.map((suggestion: any, index) => (
                                                        <p key={index}
                                                            onClick={() => handleSuggestionClick(suggestion)} className="p-2 cursor-pointer hover:bg-gray-200">{suggestion.address}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <div className="w-full mt-1">
                                            <Label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                {t("create_request.Select time:")}
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    id="time"
                                                    onChange={(e) => { setPickupTime(e.target.value) }}
                                                    className=" bg-black bg-opacity-25 text-sm leading-none text-white border border-gray-300 rounded"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full mt-1">
                                            <Label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                {t("create_request.Select Date:")}
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("w-full  bg-black bg-opacity-25 justify-start text-left font-normal", !pickup_date && "text-muted-foreground")}
                                                    >
                                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                                        <span>{pickup_date ? pickup_date.toISOString().split('T')[0] : t("create_request.Pick a date")}</span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={pickup_date} onSelect={setPickupDate} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mt-4">
                                    <h2 className="mb-4 text-xl font-bold">{t("create_request.Destination Details")}</h2>
                                    <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                                        <Label htmlFor="destinationAdd">{t("create_request.Destination Address")}</Label>
                                        <div className="relative">
                                            <Input
                                                id="destinationAdd"
                                                className="h-8 px-3  bg-black bg-opacity-25 py-5 border rounded-sm w-[100%]"
                                                placeholder={t("create_request.Destination Address")}
                                                value={destination_address}
                                                onChange={(e) => {
                                                    onDestAddressInput(e.target.value);
                                                }}
                                            />
                                            {destsuggestions.length > 0 && (
                                                <div className="absolute w-full bg-black border h-[140px] overflow-y-auto border-gray-300 rounded-sm mt-1">
                                                    {destsuggestions.map((suggestion: any, index) => (
                                                        <p key={index}
                                                            onClick={() => handleDestSuggestionClick(suggestion)} className="p-2 cursor-pointer hover:bg-gray-200">{suggestion.address}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <div className="w-full mt-1">
                                            <Label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                {t("create_request.Select Date:")}
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("w-full  bg-black bg-opacity-25 justify-start text-left font-normal", !destination_date && "text-muted-foreground")}
                                                    >
                                                        <CalendarIcon className="w-4  bg-black bg-opacity-25 h-4 mr-2" />
                                                        <span>{destination_date ? destination_date.toISOString().split('T')[0] : t("create_request.Pick a date")}</span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={destination_date} onSelect={setDestinationDate} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end w-full mt-8">
                                <Button onClick={handleNext} type="button" className={cn("p-5 bg-sky-950 text-white w-[180px]", !tabValues.includes("package") && "opacity-50 hover:")}>{t("create_request.Next")}</Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="package">
                        <div className="w-full px-3 bg-transparent sm:px-8">
                            {/* <Tabs defaultValue="type" className="w-full">
                                <TabsList className='flex justify-center  bg-black bg-opacity-25 w-full gap-4'>
                                    <TabsTrigger value="type" className='w-6 h-6 rounded-full border bg-gray-200 data-[state=active]:bg-gray-800'></TabsTrigger>
                                    <TabsTrigger value="quantity" className='w-6 h-6 rounded-full border bg-gray-200 data-[state=active]:bg-gray-800'></TabsTrigger>
                                </TabsList> */}
                            {/* <TabsContent value="type"> */}
                            {/* <BsBoxSeam className="text-[50px] text-primary-200 my-4 w-full text-center" /> */}
                            <div className="flex gap-6 mt-6">
                                <div className="flex gap-4 flex-col w-full md:w-[50%] ">
                                    <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                                        <Label htmlFor="Quantity">{t("create_request.Quantity")}</Label>
                                        <div className="relative">
                                            <Input
                                                id="Quantity"
                                                value={quantity}
                                                className="h-8 px-3 py-5 border  bg-black bg-opacity-25 rounded-sm w-[100%]"
                                                placeholder=""
                                                onChange={(e) => { setQuantity(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                                        <Label htmlFor="ptype">{t("create_request.Type Of Packages")}</Label>
                                        <Select onValueChange={(val) => { setType(val) }}>
                                            <SelectTrigger className=" bg-black bg-opacity-25 w-full">
                                                <SelectValue placeholder={t("create_request.Type Of Packages")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>{t("create_request.Packages")}</SelectLabel>
                                                    {packages.length > 0 && (
                                                        packages.map((type: any, index: any) => {
                                                            return <SelectItem key={index} value={type.id}>{type.name}</SelectItem>
                                                        })
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex gap-4 flex-col justify-center items-center mx-auto w-full md:w-[50%] mt-1 ">
                                    <div className="flex items-center gap-2 mt-1 ">
                                        <Label className="w-[100px]" htmlFor="Length">{t("create_request.Length")}</Label>
                                        <div className="relative ">
                                            <Input
                                                value={length}
                                                id="Length"
                                                className="h-8 col-span-3 px-3 py-5 border  bg-black bg-opacity-25 rounded-sm w-[100%]"
                                                placeholder={t("create_request.Length")}
                                                onChange={(e) => { setLength(e.target.value) }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold">CM</span>
                                    </div>
                                    <div className="flex items-center gap-2 ">
                                        <Label className="w-[100px]" htmlFor="Wide">{t("create_request.Wide")}</Label>
                                        <div className="relative ">
                                            <Input
                                                id="Wide"
                                                value={wide}
                                                className="h-8 col-span-3 px-3 py-5 border  bg-black bg-opacity-25 rounded-sm w-[100%]"
                                                placeholder={t("create_request.Wide")}
                                                onChange={(e) => { setWide(e.target.value) }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold">CM</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 ">
                                        <Label className="w-[100px]" htmlFor="Height">{t("create_request.Height")}</Label>
                                        <div className="relative ">
                                            <Input
                                                id="Height"
                                                value={height}
                                                className="h-8 col-span-3 px-3 py-5 border  bg-black bg-opacity-25 rounded-sm w-[100%]"
                                                placeholder={t("create_request.Height")}
                                                onChange={(e) => { setHeight(e.target.value) }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold">CM</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 ">
                                        <Label className="w-[100px]" htmlFor="Unit Weight">{t("create_request.Unit Weight")}</Label>
                                        <div className="relative ">
                                            <Input
                                                id="Unit Weight"
                                                value={unit_weight}
                                                className=" bg-black bg-opacity-25 h-8 col-span-3 px-3 py-5 border rounded-sm w-[100%]"
                                                placeholder={t("create_request.Unit Weight")}
                                                onChange={(e: any) => { setUnitWeight(e.target.value) }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold">KG</span>
                                    </div>
                                </div>
                            </div>
                            {/* </TabsContent> */}
                            {/* <TabsContent value="quantity"> */}
                            {/* <TbRulerMeasure className="text-[50px] text-primary-200 my-4 w-full text-center" /> */}
                            <div className="flex gap-6 mt-6 border-t-2 pt-6">
                                <div className="flex flex-col justify-center w-full gap-4 mx-auto mt-1 ">
                                    <div className="flex items-center gap-2 mt-1 ">
                                        <Label className="w-[100px]" htmlFor="Length">{t("create_request.Length")}</Label>
                                        <div className="relative ">
                                            <Input
                                                id="Length"
                                                value={length_of_goods}
                                                className="h-8 col-span-3  bg-black bg-opacity-25 px-3 py-5 border rounded-sm w-[100%]"
                                                placeholder={t("create_request.Length")}
                                                onChange={(e) => { setLengthOfGoods(e.target.value) }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold">M</span>
                                    </div>
                                    <div className="flex items-center gap-2 ">
                                        <Label className="w-[100px]" htmlFor="Total Weight">{t("create_request.Total Weight")}</Label>
                                        <div className="relative">
                                            <Input
                                                id="Total Weight"
                                                value={total_weight}
                                                className="h-8 col-span-3 px-3  bg-black bg-opacity-25 py-5 border rounded-sm w-[100%]"
                                                placeholder={t("create_request.Total Weight")}
                                                onChange={(e: any) => { setTotalWeight(e.target.value) }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold">T</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 ">
                                        <Label className="w-[100px]" htmlFor="Type of Goods">{t("create_request.Type of Goods")}</Label>
                                        <div className="relative ">
                                            <Input
                                                id="Type of Goods"
                                                value={type_of_goods}
                                                className="h-8 col-span-3  bg-black bg-opacity-25 px-3 py-5 border rounded-sm w-[100%]"
                                                placeholder={t("create_request.Type of Goods")}
                                                onChange={(e) => { setTypeOfGoods(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* </TabsContent> */}
                            {/* </Tabs> */}
                            <div className="flex justify-end w-full mt-8">
                                <Button onClick={handleNext} type="button" variant="outline" className="p-5 bg-sky-950 text-white w-[180px] ">{t("create_request.Next")}</Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="TruckType" className="w-full">
                        <div className="w-full px-3 bg-transparent sm:px-8 ">
                            <div className="relative flex flex-col items-center w-full overflow-hidden ">
                                <img src={Truck} alt="map img" className="w-[200px] h-[200px]" />
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="grid items-center w-full grid-cols-1 gap-2 mt-1 ">
                                    <Label htmlFor="Quantity">{t("create_request.Truck Type")}</Label>
                                    <Select onValueChange={(val: any) => { setTruckType(val) }}>
                                        <SelectTrigger className=" bg-black bg-opacity-25 w-full">
                                            <SelectValue placeholder={t("create_request.Truck Type")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{t("create_request.Truck Type")}</SelectLabel>
                                                {truck_types.length > 0 && (
                                                    truck_types.map((truck_type: any, index: any) => {
                                                        return <SelectItem key={index} value={truck_type.id}>{truck_type.name}</SelectItem>
                                                    })
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid items-center w-full grid-cols-1 gap-2 mt-1 ">
                                    <Label htmlFor="Body Type">{t("create_request.Body Type")}</Label>
                                    <Select onValueChange={(val: any) => { setTruckBodyType(val) }}>
                                        <SelectTrigger className=" bg-black bg-opacity-25 w-full">
                                            <SelectValue placeholder={t("create_request.Body Type")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{t("create_request.Body Type")}</SelectLabel>
                                                {truck_body_types.length > 0 && (
                                                    truck_body_types.map((truck_body_type: any, index: any) => {
                                                        return <SelectItem key={index} value={truck_body_type.id}>{truck_body_type.name}</SelectItem>
                                                    })
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end w-full mt-8">
                                <Button onClick={handleNext} type="button" variant="outline" className="p-5 bg-sky-950 text-white w-[180px] ">{t("create_request.Next")}</Button>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="details" className="px-3 py-4 bg-transparent sm:px-8">
                        <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                            <Label htmlFor="Expected Price">{t("create_request.Expected Price")}</Label>
                            <div className="relative">
                                <Input
                                    id="Expected Price"
                                    value={expected_price}
                                    className="h-8  bg-black bg-opacity-25 px-3 py-5 border rounded-sm w-[100%]"
                                    placeholder={t("create_request.Expected Price")}
                                    type="number"
                                    onChange={(e) => { setExpectedPrice(parseFloat(e.target.value)) }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <div className="flex flex-col w-full gap-4 ">
                                <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                                    <Label htmlFor="Pickup Contact">{t("create_request.Pickup Contact")}</Label>
                                    <div className="relative">
                                        <Input
                                            value={pickup_contact}
                                            id="Pickup Contact"
                                            className="h-8  bg-black bg-opacity-25 px-3 py-5 border rounded-sm w-[100%]"
                                            placeholder={t("create_request.Pickup Contact")}
                                            onChange={(e) => { setPickupContact(e.target.value) }}
                                        />
                                    </div>
                                </div>
                                <div className="grid items-center grid-cols-1 gap-2 mt-1 mb-4">
                                    <Label htmlFor="Pickup Name">{t("create_request.Pickup Name")}</Label>
                                    <div className="relative">
                                        <Input
                                            id="Pickup Name"
                                            value={pickup_name}
                                            className="h-8 px-3  bg-black bg-opacity-25 py-5 border rounded-sm w-[100%]"
                                            placeholder={t("create_request.Pickup Name")}
                                            onChange={(e) => { setPickupName(e.target.value) }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full gap-4">
                                <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                                    <Label htmlFor="Drop Contact">{t("create_request.Drop Contact")}</Label>
                                    <div className="relative">
                                        <Input
                                            id="Drop Contact"
                                            value={drop_contact}
                                            className="h-8 px-3 py-5  bg-black bg-opacity-25 border rounded-sm w-[100%]"
                                            placeholder={t("create_request.Drop Contact")}
                                            onChange={(e) => { setDropContact(e.target.value) }}
                                        />
                                    </div>
                                </div>
                                <div className="grid items-center grid-cols-1 gap-2 mt-1 mb-4 ">
                                    <Label htmlFor="Drop Name">{t("create_request.Drop Name")}</Label>
                                    <div className="relative">
                                        <Input
                                            value={drop_name}
                                            onChange={(e) => { setDropName(e.target.value) }}
                                            id="Drop Name"
                                            className="h-8 px-3 py-5  bg-black bg-opacity-25 border rounded-sm w-[100%]"
                                            placeholder={t("create_request.Drop Name")}
                                        />
                                    </div>
                                </div>
                            </div>



                        </div>
                        <div className="grid items-center grid-cols-1 gap-2 mt-1 ">
                            <Label htmlFor="Notes">{t("create_request.Notes")}</Label>
                            <div className="relative">
                                <Input
                                    id="Notes"
                                    value={notes}
                                    className="h-8  bg-black bg-opacity-25 px-3 py-5 border rounded-sm w-[100%]"
                                    placeholder="Write note here if any..."
                                    type="text"
                                    onChange={(e) => { setNotes(e.target.value) }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end w-full mt-8">
                            <Button onClick={handleSubmit} type="button" variant="outline" className="p-5 bg-sky-950 text-white w-[180px] ">{t("create_request.Next")}</Button>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
