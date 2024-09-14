import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button.tsx";
import { useState, useEffect } from "react";
import axios from "axios";

const GEO_API_USERNAME = 'naveedkhosa';  // Replace with your GeoNames username

const RateCalculator = () => {
    const [selectedTab, setSelectedTab] = useState("Domestic");

    // Domestic state variables
    const [domesticCarrierId, setDomesticCarrierId] = useState("se-28529731");
    const [domesticFromCity, setDomesticFromCity] = useState("");
    const [domesticFromState, setDomesticFromState] = useState("");
    const [domesticFromPinCode, setDomesticFromPinCode] = useState("");
    const [domesticToCity, setDomesticToCity] = useState("");
    const [domesticToState, setDomesticToState] = useState("");
    const [domesticToPinCode, setDomesticToPinCode] = useState("");

    // International state variables
    const [internationalCarrierId, setInternationalCarrierId] = useState("se-28529731");
    const [internationalFromCity, setInternationalFromCity] = useState("");
    const [internationalFromState, setInternationalFromState] = useState("");
    const [internationalFromPinCode, setInternationalFromPinCode] = useState("");
    const [toCountryCode, setToCountryCode] = useState("IN"); // Default to India
    const [internationalToCity, setInternationalToCity] = useState("");
    const [internationalToState, setInternationalToState] = useState("");
    const [internationalToPinCode, setInternationalToPinCode] = useState("");

    // Shared state variables
    const [length, setLength] = useState<any>("");
    const [width, setWidth] = useState<any>("");
    const [height, setHeight] = useState<any>("");
    const [weight, setWeight] = useState<any>("");
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(false);

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [postalCodes, setPostalCodes] = useState([]);

    // Fetch countries on component mount for International tab
    useEffect(() => {
        if (selectedTab === "International") {
            fetchCountries();
        }
    }, [selectedTab]);

    const fetchCountries = async () => {
        try {
            const response = await axios.get(`http://api.geonames.org/countryInfoJSON?username=${GEO_API_USERNAME}`);
            setCountries(response.data.geonames || []);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchStates = async (countryCode) => {
        try {
            const country = countries.find(c => c.countryCode === countryCode);
            if (country) {
                const response = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${country.geonameId}&username=${GEO_API_USERNAME}`);
                setStates(response.data.geonames || []);
            }
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const fetchCities = async (stateCode) => {
        try {
            const response = await axios.get(`http://api.geonames.org/searchJSON?country=${selectedTab === "Domestic" ? "IN" : toCountryCode}&adminCode1=${stateCode}&username=${GEO_API_USERNAME}`);
            setCities(response.data.geonames || []);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchPostalCodes = async (cityName) => {
        try {
            const response = await axios.get(`http://api.geonames.org/postalCodeSearchJSON?placename=${cityName}&country=${selectedTab === "Domestic" ? "IN" : toCountryCode}&username=${GEO_API_USERNAME}`);
            setPostalCodes(response.data.postalCodes || []);
        } catch (error) {
            console.error('Error fetching postal codes:', error);
        }
    };

    const handleRateCalculate = async () => {
        if (!length || !width || !height || !weight) {
            alert("Please fill all required fields");
            return;
        }

        setLoading(true);

        const convertedLength = (length * 0.393701).toFixed(2);
        const convertedWidth = (width * 0.393701).toFixed(2);
        const convertedHeight = (height * 0.393701).toFixed(2);
        const convertedWeight = (weight * 2.20462).toFixed(2);  // Convert KG to Pounds

        const payload = {
            carrier_ids: selectedTab === "Domestic" ? [domesticCarrierId] : [internationalCarrierId],
            from_country_code: "IN",
            from_postal_code: selectedTab === "Domestic" ? domesticFromPinCode : internationalFromPinCode,
            from_city_locality: selectedTab === "Domestic" ? domesticFromCity : internationalFromCity,
            from_state_province: selectedTab === "Domestic" ? domesticFromState : internationalFromState,
            to_country_code: selectedTab === "Domestic" ? "IN" : toCountryCode,
            to_postal_code: selectedTab === "Domestic" ? domesticToPinCode : internationalToPinCode,
            to_city_locality: selectedTab === "Domestic" ? domesticToCity : internationalToCity,
            to_state_province: selectedTab === "Domestic" ? domesticToState : internationalToState,
            weight: {
                value: convertedWeight,
                unit: "pound"
            },
            dimensions: {
                unit: "inch",
                length: convertedLength,
                width: convertedWidth,
                height: convertedHeight
            },
            confirmation: "none",
            address_residential_indicator: "unknown",
            ship_date: new Date().toISOString(),
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/calculate-rate', payload);
            setRates(response.data);
        } catch (error) {
            console.error('Error calculating rate:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full px-4 md:pl-[84px] sm:pl-0 ">
            <h2 className="font-bold text-2xl my-4 text-gray-300">Shipping Rate Calculator</h2>

            <div className="flex gap-4">
                <button
                    className={`px-4 py-2 ${selectedTab === "Domestic" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => setSelectedTab("Domestic")}
                >
                    Domestic
                </button>
                <button
                    className={`px-4 py-2 ${selectedTab === "International" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => setSelectedTab("International")}
                >
                    International
                </button>
            </div>

            {selectedTab === "Domestic" && (
                <div className="mt-4 flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Pickup City</Label>
                            <select
                                value={domesticFromCity}
                                onChange={(e) => {
                                    setDomesticFromCity(e.target.value);
                                    fetchPostalCodes(e.target.value);
                                }}
                                className="outline-none border p-2 rounded"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.geonameId} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Pickup State</Label>
                            <select
                                value={domesticFromState}
                                onChange={(e) => {
                                    setDomesticFromState(e.target.value);
                                    fetchCities(e.target.value);
                                }}
                                className="outline-none border p-2 rounded"
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.adminCode1} value={state.name}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Pickup Pin Code</Label>
                            <select
                                value={domesticFromPinCode}
                                onChange={(e) => setDomesticFromPinCode(e.target.value)}
                                className="outline-none border p-2 rounded"
                                disabled={!postalCodes.length}
                            >
                                <option value="">Select Postal Code</option>
                                {postalCodes.map((postal) => (
                                    <option key={postal.postalCode} value={postal.postalCode}>
                                        {postal.postalCode}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Delivery City</Label>
                            <select
                                value={domesticToCity}
                                onChange={(e) => {
                                    setDomesticToCity(e.target.value);
                                    fetchPostalCodes(e.target.value);
                                }}
                                className="outline-none border p-2 rounded"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.geonameId} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Delivery State</Label>
                            <select
                                value={domesticToState}
                                onChange={(e) => {
                                    setDomesticToState(e.target.value);
                                    fetchCities(e.target.value);
                                }}
                                className="outline-none border p-2 rounded"
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.adminCode1} value={state.name}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Delivery Pin Code</Label>
                            <input
                                type="text"
                                value={domesticToPinCode}
                                onChange={(e) => setDomesticToPinCode(e.target.value)}
                                className="outline-none border p-2 rounded"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Dimensions (Length x Width x Height)</Label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Length"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                    className="outline-none border p-2 rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Width"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                    className="outline-none border p-2 rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Height"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="outline-none border p-2 rounded"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Weight</Label>
                            <div className="flex items-center border border-gray-300 bg-white rounded p-2">
                                <input
                                    type="number"
                                    placeholder="Weight"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="outline-none flex-grow"
                                />
                                <p className="ml-2">KG</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedTab === "International" && (
                <div className="mt-4 flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Pickup City</Label>
                            <select
                                value={internationalFromCity}
                                onChange={(e) => {
                                    setInternationalFromCity(e.target.value);
                                    fetchPostalCodes(e.target.value);
                                }}
                                className="outline-none border p-2 rounded"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.geonameId} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Pickup State</Label>
                            <select
                                value={internationalFromState}
                                onChange={(e) => {
                                    setInternationalFromState(e.target.value);
                                    fetchCities(e.target.value);
                                }}
                                className="outline-none border p-2 rounded"
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.adminCode1} value={state.name}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Pickup Pin Code</Label>
                            <select
                                value={internationalFromPinCode}
                                onChange={(e) => setInternationalFromPinCode(e.target.value)}
                                className="outline-none border p-2 rounded"
                                disabled={!postalCodes.length}
                            >
                                <option value="">Select Postal Code</option>
                                {postalCodes.map((postal) => (
                                    <option key={postal.postalCode} value={postal.postalCode}>
                                        {postal.postalCode}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Destination Country</Label>
                            <select
                                value={toCountryCode}
                                onChange={(e) => {
                                    setToCountryCode(e.target.value);
                                    fetchStates(e.target.value);
                                }}
                                className="outline-none border p-2 rounded"
                            >
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.countryCode} value={country.countryCode}>
                                        {country.countryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Destination City</Label>
                            <select
                                value={internationalToCity}
                                onChange={(e) => setInternationalToCity(e.target.value)}
                                className="outline-none border p-2 rounded"
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.geonameId} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Destination State</Label>
                            <select
                                value={internationalToState}
                                onChange={(e) => setInternationalToState(e.target.value)}
                                className="outline-none border p-2 rounded"
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.adminCode1} value={state.name}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Destination Postal Code</Label>
                            <input
                                type="text"
                                value={internationalToPinCode}
                                onChange={(e) => setInternationalToPinCode(e.target.value)}
                                className="outline-none border p-2 rounded"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Dimensions (Length x Width x Height)</Label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Length"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                    className="outline-none border p-2 rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Width"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                    className="outline-none border p-2 rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Height"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="outline-none border p-2 rounded"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Label className="text-gray-300">Weight</Label>
                            <div className="flex items-center border border-gray-300 bg-white rounded p-2">
                                <input
                                    type="number"
                                    placeholder="Weight"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="outline-none flex-grow"
                                />
                                <p className="ml-2">KG</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-5 mt-4">
                <Button
                    className="bg-primary-200 text-white w-[150px]"
                    onClick={handleRateCalculate}
                    disabled={loading}
                >
                    {loading ? "Calculating..." : "Calculate"}
                </Button>
                <Button
                    variant="outline"
                    className="w-[150px]"
                    onClick={() => {
                        // Reset all fields
                        setDomesticCarrierId("se-28529731");
                        setDomesticFromCity("");
                        setDomesticFromState("");
                        setDomesticFromPinCode("");
                        setDomesticToCity("");
                        setDomesticToState("");
                        setDomesticToPinCode("");
                        setInternationalCarrierId("se-28529731");
                        setInternationalFromCity("");
                        setInternationalFromState("");
                        setInternationalFromPinCode("");
                        setToCountryCode("IN");
                        setInternationalToCity("");
                        setInternationalToState("");
                        setInternationalToPinCode("");
                        setLength("");
                        setWidth("");
                        setHeight("");
                        setWeight("");
                    }}
                >
                    Reset
                </Button>
            </div>

            <div className="mt-4">
                <h3 className="font-bold text-xl text-gray-300">Shipment Details</h3>
                {/* Display shipment details and rates */}
            </div>
        </div>
    );
};

export default RateCalculator;
