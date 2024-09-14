import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculatorRate, CalculatorRateColumns } from "@/components/rate-calculator/columns";
import OpenAI from 'openai';
import { toast } from 'sonner';
import { FaPoundSign } from 'react-icons/fa';

const RateCalculator = () => {

    const [assistantId] = useState("asst_A1qSVzTrtdBHVKJBhGNBWY5l");
    const [selectedTab, setSelectedTab] = useState("Domestic");


    const [from_country, setFromCountry] = useState("United Kingdom");
    const [to_country, setToCountry] = useState("United Kingdom");
    const [pickupPincode, setPickupPincode] = useState('');
    const [deliveryPincode, setDeliveryPincode] = useState('');
    const [actualWeight, setActualWeight] = useState('');
    const [shipmentValue, setShipmentValue] = useState('');
    const [dimensions, setDimensions] = useState({ width: '', height: '', length: '' });
    const [calculatedData, setCalculatedData] = useState<CalculatorRate[]>([]);
    const [loading, setLoading] = useState(false);

    const [response, setResponse] = useState<any>();

    const openai = new OpenAI({
        apiKey: "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",
        dangerouslyAllowBrowser: true,
    });

    useEffect(() => {
        // var value = "```json\n{\n    \"is_error\": false,\n    \"error\": \"\",\n    \"from_country\": \"India\",\n    \"from_zipcode\": \"110001\",\n    \"to_country\": \"United States\",\n    \"to_zipcode\": \"31217\",\n    \"rates\": [\n        {\n            \"courier_name\": \"DHL Express Worldwide\",\n            \"total_charges\": 27130,\n            \"currency\": \"INR\",\n            \"estimated_delivery\": \"3-5 business days\"\n        },\n        {\n            \"courier_name\": \"DHL Express 12:00\",\n            \"total_charges\": 28230,\n            \"currency\": \"INR\",\n            \"estimated_delivery\": \"Next possible working day before 12:00\"\n        },\n        {\n            \"courier_name\": \"DHL Express 9:00\",\n            \"total_charges\": 28530,\n            \"currency\": \"INR\",\n            \"estimated_delivery\": \"Next possible working day before 09:00\"\n        }\n    ]\n}\n```\n\n### Breakdown of Calculation:\n- **Base Rate for 12 kg (to USA, Zone 8)**: ₹27,130 .\n- **DHL Express Worldwide Cost Addition**: ₹1,100 for by 12:00 service, ₹1,650 for by 09:00 service .\n\n### Surcharges and Additional Charges:\n- No additional surcharges identified for this example outside the standard service charges.";

        // const jsonStringMatch = value.match(/```json\n([\s\S]*?)\n```/);
        // if (jsonStringMatch) {
        //     const jsonString = jsonStringMatch[1];

        //     // Step 2: Parse the extracted JSON
        //     try {
        //         const jsonData = JSON.parse(jsonString);

        //         // Output the parsed object
        //         console.log(jsonData);
        //     } catch (error) {
        //         console.error("Error parsing JSON:", error);
        //     }
        // } else {
        //     console.error("JSON string not found.");
        // }

    }, [])


    const handleCalculate = async () => {
        setLoading(true);


        if (selectedTab == "Domestic" || selectedTab == "") {
            setToCountry("United Kingdom");
        }

        var message = `
        from country : ${from_country},
        from zip code : ${pickupPincode},
        to country : ${to_country},
        to zip code: ${deliveryPincode},
        total weight : ${actualWeight} KG,
        width : ${dimensions?.width},
        height :${dimensions?.height} CM,
        length: ${dimensions?.length} CM,
        Shipment value: ${shipmentValue} £`;


        



        const thread = await openai.beta.threads.create({
            messages: [
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        const run = await openai.beta.threads.runs.createAndPoll(thread?.id, {
            assistant_id: assistantId
        });


        if (run.status === 'completed') {
            const threadMessages = await openai.beta.threads.messages.list(thread?.id);

            let jsonStringMatch = threadMessages?.data[0]?.content[0]?.text?.value.match(/```json([\s\S]*?)```/);
            if (jsonStringMatch) {
                try {
                    console.log("jsonStringMatch : ", jsonStringMatch);
                    const jsonStringParsed = JSON.parse(jsonStringMatch[1]);
                    setResponse(jsonStringParsed);
                    const jsonString = JSON.parse(jsonStringMatch[1].replace('```json', '').replace("```", ''));
                    console.log("jsonStringParsed: ", jsonStringParsed);
                    console.log("after replacing and parsing: ", jsonString);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            } else {
                // setResponse(JSON.parse(threadMessages?.data[0]?.content[0]?.text?.value.replace('```json', '').replace("```", '')));
                console.error("JSON string not found.");
            }


            setLoading(false);
        } else if (run.status === 'failed') {
            setLoading(false);
            toast.error('Rate calculation failed, Please try again');
        }

    };



    return (
        <div className="w-full px-8 py-4 md:pl-[84px] bg-black bg-opacity-25 text-white sm:pl-[0px]">
            <h2 className="my-4 text-2xl font-bold">Shipping Rate Calculator</h2>
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
            <div className='flex flex-col w-full gap-3 lg:flex-row'>

                <div className="mt-4 flex lg:flex-row flex-col w-full lg:w-[70%] gap-4">

                    <div className="w-full lg:w-[50%]">
                        <div className='flex flex-col gap-3 mb-4'>
                            <Label>Pickup Pincode</Label>
                            <input
                                value={pickupPincode}
                                onChange={(e) => setPickupPincode(e.target.value)}
                                placeholder='01241'
                                className='p-2 border rounded outline-none bg-none text-black'
                            />
                        </div>
                        {selectedTab == "International" && (
                            <div className='flex flex-col gap-3 my-4'>
                                <Label>Delivery Country</Label>
                                <select onChange={(e) => setToCountry(e.target.value)} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected value="India">Choose a country</option>
                                    <option value="United States">United States</option>
                                    <option value="United States">India</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="France">France</option>
                                    <option value="Germany">Germany</option>
                                    <option value="United Arab Emirates">United Arab Emirates</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="Saudi Arabia">Pakistan</option>
                                </select>
                            </div>
                        )}



                        <div className='flex flex-col gap-3 my-4'>
                            <Label>Delivery Pincode</Label>
                            <input
                                value={deliveryPincode}
                                onChange={(e) => setDeliveryPincode(e.target.value)}
                                placeholder='01241'
                                className='p-2 border rounded outline-none bg-none text-black'
                            />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <Label>Actual Weight</Label>
                            <div className='flex items-center p-2 border bg-white border-gray-300 rounded'>
                                <input
                                    type='number'
                                    value={actualWeight}
                                    onChange={(e) => setActualWeight(e.target.value)}
                                    placeholder='Enter weight in KG'
                                    className='flex-grow outline-none bg-none text-black'
                                />
                                <p className='ml-2 text-black'>KG</p>
                            </div>

                            <div className='flex flex-col gap-3 mt-3'>
                                <Label>Shipment Value</Label>
                                <div className='flex items-center p-2 border bg-white border-gray-300 rounded'>
                                    <FaPoundSign className='mr-2 text-gray-400' />
                                    <input
                                        type='number'
                                        value={shipmentValue}
                                        onChange={(e) => setShipmentValue(e.target.value)}
                                        placeholder='Enter the shipment value'
                                        className='flex-grow outline-none bg-none text-black'
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-col w-full lg:w-[50%]">
                        <div className='flex flex-col gap-3'>
                            <Label>Dimensions</Label>
                            <div className='flex flex-wrap w-full gap-4'>
                                <div className='flex items-center p-2 bg-white border border-gray-300 rounded'>
                                    <input
                                        type='number'
                                        value={dimensions.width}
                                        onChange={(e) => setDimensions(prev => ({ ...prev, width: e.target.value }))}
                                        placeholder='W'
                                        className='flex-grow outline-none bg-none text-black'
                                    />
                                    <p className='ml-2 text-black'>CM</p>
                                </div>
                                <div className='flex items-center p-2 border bg-white border-gray-300 rounded'>
                                    <input
                                        type='number'
                                        value={dimensions.height}
                                        onChange={(e) => setDimensions(prev => ({ ...prev, height: e.target.value }))}
                                        placeholder='H'
                                        className='flex-grow outline-none bg-none text-black'
                                    />
                                    <p className='ml-2 text-black'>CM</p>
                                </div>
                                <div className='flex items-center p-2 border bg-white border-gray-300 rounded'>
                                    <input
                                        type='number'
                                        value={dimensions.length}
                                        onChange={(e) => setDimensions(prev => ({ ...prev, length: e.target.value }))}
                                        placeholder='L'
                                        className='flex-grow outline-none bg-none text-black'
                                    />
                                    <p className='ml-2 text-black'>CM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div className='flex flex-col my-4'>
                <div className='flex gap-5 mt-4'>
                    <Button onClick={handleCalculate} className='bg-primary-200 text-white w-[150px]'>
                        {loading ? 'Calculating...' : 'Calculate'}
                    </Button>
                    <Button variant='outline' className='w-[150px] text-black' onClick={() => {
                        setPickupPincode('');
                        setDeliveryPincode('');
                        setActualWeight('');
                        setShipmentValue('');
                        setDimensions({ width: '', height: '', length: '' });
                        setCalculatedData([]);
                    }}>
                        Reset
                    </Button>
                </div>
            </div>
            <div className='flex flex-col w-full gap-3 mt-4 lg:flex-row'>
                <div className='border w-full lg:w-[20%] px-4 rounded'>
                    <h2 className='my-4 text-xl font-bold'>Shipment Details</h2>
                    <div className='flex flex-col'>
                        <h4 className='font-sm'>From Country</h4>
                        <h3 className='font-bold text-white'>{from_country || 'N/A'}</h3>
                    </div>
                    <div className='flex flex-col'>
                        <h4 className='font-sm'>Pickup From</h4>
                        <h3 className='font-bold text-white'>{pickupPincode || 'N/A'}</h3>
                    </div>
                    <div className='flex flex-col'>
                        <h4 className='font-sm'>To Country</h4>
                        <h3 className='font-bold text-white'>{to_country || 'N/A'}</h3>
                    </div>
                    <div className='flex flex-col my-2'>
                        <h4 className='font-sm'>Delivery To</h4>
                        <h3 className='font-bold text-white'>{deliveryPincode || 'N/A'}</h3>
                    </div>
                    <div className='flex flex-col my-2'>
                        <h4 className='font-sm'>Shipment Value</h4>
                        <h3 className='flex items-center gap-2 font-bold text-white'><FaPoundSign /> {shipmentValue || 'N/A'}</h3>
                    </div>

                </div>
                <div className='w-ful lg:w-[80%] px-6 border rounded'>
                    <h3 className='my-3 text-2xl font-bold text-white'>Serviceable Courier Partner</h3>
                    <div className='flex items-center gap-2'>

                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Courier
                                    </th>

                                    <td className="px-6 py-4">
                                        Estimated Delivery
                                    </td>

                                    <td className="px-6 py-4">
                                        Total Charges
                                    </td>
                                </tr>
                            </thead>
                            <tbody>



                                {(response?.is_error || response?.is_error=="true") && (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td colSpan={3} className="px-6 py-4 text-center">
                                            {response?.error}
                                        </td>
                                    </tr>
                                )}

                                {((!response?.is_error || response?.is_error=="false") && response?.rates?.length > 0) && response?.rates?.map((element: any) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4">{element?.courier_name}</td>
                                        <td className="px-6 py-4">{element?.estimated_delivery}</td>
                                        <td className="px-6 py-4">{element?.total_charges} {element?.currency}</td>
                                    </tr>
                                ))}



                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RateCalculator;
