import React, { useEffect, useRef, useState } from 'react';
import truckIcon from "@/assets/box-truck.png";
import '@nbai/nbmap-gl/dist/nextbillion.css'
import nextbillion, {
    OptimizationMvrpServiceV2,
    utils
} from '@nbai/nbmap-gl'
import './OptimizationMVRP.css';
import baseClient, { nb_key } from "@/services/apiClient";
import { FaLocationArrow } from 'react-icons/fa';
import { toast } from 'sonner';

function addMarker(className, text, origin, map, dragedCB) {
    const htmlEle = document.createElement('div')
    htmlEle.className = `marker ${className}`
    if (className != "Vehicle") {
        htmlEle.innerHTML = text
    } else {
        console.log("vehicle location : ", origin);
    }
    new nextbillion.maps.Marker({
        draggable: false,
        element: htmlEle,
    })
        .setLngLat(origin)
        .on('dragend', dragedCB)
        .addTo(map)
}

function initSource(nbmap) {
    nbmap.map.addSource('route', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
    })
}

function initLayer(nbmap) {
    nbmap.map.addLayer({
        id: 'route-1',
        type: 'line',
        source: 'route',
        filter: ['==', 'i', 0],
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': 'rgba(129,43,250, 0.8)',
            'line-width': 8
        }
    })
    nbmap.map.addLayer({
        id: 'route-2',
        type: 'line',
        source: 'route',
        filter: ['==', 'i', 1],
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': 'rgba(40,149,255,0.8)',
            'line-width': 8
        }
    })
    nbmap.map.addLayer({
        id: 'route-arrow',
        type: 'symbol',
        source: 'route',
        layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 50,
            'text-field': '>',
            'text-justify': 'auto',
            'text-keep-upright': false
        },
        paint: {
            'text-color': '#fff',
            'text-halo-width': 1,
            'text-halo-color': '#fff'
        }
    })
}

const MultiPickup = () => {
    const nbmap = useRef(null)
    const popup = useRef(null)
    const isInited = useRef(false)
    const optimizationService = useRef(new OptimizationMvrpServiceV2())
    const points = useRef([])
    const [loading, setLoading] = useState(false)
    const [orderID, setOrderID] = useState(null)
    const [geometries, setGeometries] = useState([])
    const [shipments, setShipments] = useState([]);
    const [labels, setLabels] = useState([]);
    const [mylocation, setMyLocation] = useState([77.2870, 28.6475]);

    const [locations, setLocations] = useState([
        mylocation
    ]);

    const loadShipments = () => {
        baseClient.get('user/multi-pickups').then((response) => {
            const new_shipment_data = [];
            const new_locations_data = [];
            const new_labels = [];

            response.data?.bids?.map((item, index) => {
                const pickup_coords = JSON.parse(item?.shipment?.pickup_address_coords);
                const dest_coords = JSON.parse(item?.shipment?.destination_address_coords);
                new_labels.push({
                    class: 'P' + (index + 1),
                    text: "P" + (index + 1)
                });
                new_labels.push({
                    class: 'D' + (index + 1),
                    text: "D" + (index + 1)
                });

                new_locations_data.push([pickup_coords?.lng, pickup_coords?.lat]);
                new_locations_data.push([dest_coords?.lng, dest_coords?.lat]);
                new_shipment_data.push({
                    pickup: {
                        id: index,
                        location_index: index + index
                    },
                    delivery: {
                        description: "d1",
                        id: index + 1,
                        location_index: index + (index + 1)
                    }
                });
            });
            new_locations_data.push(mylocation);
            setLabels(new_labels);
            setShipments(new_shipment_data);
            setLocations(new_locations_data);
        });
    };



    var watch_id = navigator.geolocation.watchPosition((position) => {
        setMyLocation([position.coords.longitude,position.coords.latitude]);
        // setMyLocation([77.2870, 28.6475]);
    });

    useEffect(() => {
        const newlocations = locations;
        newlocations[newlocations.length - 1] = mylocation;
        setLocations(newlocations);
    }, [mylocation])

    function requestOptimization() {
        optimizationService.current
            .postVRP({
                description: 'text description',
                // set locations information
                locations: {
                    id: 2,
                    // @ts-ignore
                    location: locations
                },
                // set shipments information
                shipments: shipments,
                // set vehicles information
                vehicles: [
                    {
                        id: 1,
                        start_index: locations.length - 1,
                        costs: {

                        }
                    }
                ]
            })
            .then((response) => {
                if (response.status !== 'Ok') {
                    if (response.status == '403') {
                        toast.error("Service is unavailable in this area");
                    }
                    return
                }
                setOrderID(response.id)
            })
    }
    function tryFetchResult() {
        if (!orderID) {
            return
        }
        setLoading(true)
        optimizationService.current
            .retrieve({
                id: orderID
            })
            .then((res) => {
                if (res.status !== 'Ok' || res.result.code !== 0) {
                    // try fetch until result ready
                    setTimeout(() => {
                        tryFetchResult()
                    }, 2000)
                    return
                }
                // try render result
                setGeometries(res.result.routes.map((route) => route.geometry))
                setLoading(false)
            })
    }
    useEffect(() => {
        if (orderID) {
            tryFetchResult()
        }
    }, [orderID])
    useEffect(() => {
        if (nbmap.current) {
            return
        }
        nextbillion.setApiKey(nb_key)
        nbmap.current = new nextbillion.maps.Map({
            container: 'map',
            style: 'https://api.nextbillion.io/maps/streets/style.json',
            zoom: 12,
            center: { lat: 1.29, lng: 103.85 }
        })
        // add the custom style layer to the map
        nbmap.current.on('load', function () {
            initSource(nbmap.current)
            initLayer(nbmap.current)
            isInited.current = true;
            if (nbmap.current && isInited.current) {
                if (popup.current) {
                    popup.current.remove()
                    popup.current = null
                }
                loadShipments();

            }

            addMarker('Vehicle', 'driver', locations[locations.length - 1], nbmap.current.map, (e) => {
                const newOrigin = e.target.getLngLat()
                locations[locations.length - 1] = [newOrigin.lng, newOrigin.lat]
                setLocations(locations)
            });

        })
    }, [])
    useEffect(() => {
        if (!isInited.current) {
            return
        }
        const source = nbmap.current.map.getSource('route')
        const data = {
            type: 'FeatureCollection',
            features: []
        }
        geometries.forEach((g, i) => {
            data.features.push({
                type: 'Feature',
                properties: {
                    i: i
                },
                geometry: {
                    type: 'LineString',
                    coordinates: utils.polyline.decode(g, 5).map((c) => c.reverse())
                }
            })
        })
        source.setData(data)
    }, [geometries])


    useEffect(() => {
        if (nbmap.current && isInited.current) {
            if (popup.current) {
                popup.current.remove()
                popup.current = null
            }
            requestOptimization();
        }
    }, [locations, shipments,mylocation]);

    useEffect(() => {
        if (nbmap.current && isInited.current) {
            if (popup.current) {
                popup.current.remove()
                popup.current = null
            }

            labels?.map((item, index) => {
                addMarker(item?.class, item?.text, locations[index], nbmap.current.map, (e) => {
                    const newOrigin = e.target.getLngLat()
                    locations[index] = [newOrigin.lng, newOrigin.lat]
                    setLocations(locations)
                })
            });

            NavigateTo(1);
        }
    }, [labels])

    const NavigateTo = (type: number) => {
        switch (type) {
            case 1:
                nbmap.current.map.flyTo({
                    zoom: 18,
                    center: { lat: locations[locations.length - 1][1], lng: locations[locations.length - 1][0] }
                });
                break;
            default:
                nbmap.current.map.flyTo({
                    zoom: 18,
                    center: { lat: locations[locations.length - 1][1], lng: locations[locations.length - 1][0] }
                });
                break;
        }
    }


    return (
        <div className=" pl-[66px] w-full relative">
            {loading && <div className="loading">Loading...</div>}
            <button className="absolute px-3 py-1 rounded-full flex items-center gap-1 bg-blue-500 z-[1000] bottom-10 right-4 text-white" onClick={() => { NavigateTo(1) }}>
                <FaLocationArrow /> Start
            </button>
            <div className="w-full mt-1">
                <div id="map" className="grid grid-cols-2 w-full h-[calc(100vh-85px)] border border-solid border-grey-200 rounded"></div>
            </div>
        </div>
    )
}

export default MultiPickup
