import { useParams } from "react-router-dom";
import baseClient from "@/services/apiClient";
import { useEffect, useRef, useState } from "react";
import nextbillion, { NBMap } from "@nbai/nbmap-gl";
import { Button } from "@/components/ui/button";
import "@nbai/nbmap-gl/dist/nextbillion.css";
import polyline from 'polyline';
import './direction.css';
import MapImg from '@/assets/map.png'
import truckIcon from "@/assets/box-truck.png";
import startIcon from "@/assets/start.png";
import endIcon from "@/assets/end.png";
import Pusher from "pusher-js";

import { nb_key } from "@/services/apiClient";
import { PhoneCall } from "lucide-react";

import { FiMapPin } from 'react-icons/fi';
import { FaLocationArrow } from "react-icons/fa";
nextbillion.setApiKey(nb_key);

function initSource(nbmap: any) {

  nbmap.map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: []
      }
    }
  });


  nbmap.map.addSource("live-location", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [0, 0], // Initialize with default coordinates
      },
    },
  });

  // Add source for start and destination icons
  nbmap.map.addSource("start-points", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [0, 0], // Replace with actual coordinates
          },
          properties: {
            pointType: "start",
          },
        },
      ],
    },
  });

  // Add source for start and destination icons
  nbmap.map.addSource("end-points", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [0, 0], // Replace with actual coordinates
          },
          properties: {
            pointType: "end",
          },
        },
      ],
    },
  });


}




function emptyFeatureCollection() {
  return {
    type: 'FeatureCollection',
    features: []
  };
}

function emptyLineString() {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: []
    },
    properties: {}
  };
}

function emptyPoint() {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: []
    },
    properties: {}
  };
}


function generateNavigationFeature(payload) {
  const routeCollection = emptyFeatureCollection();


  payload?.routes?.forEach((route, index) => {

    const lineString = emptyLineString();


    lineString.geometry.coordinates = polyline.decode(route.geometry, 6).map((c) => c.reverse());
    lineString.properties = {
      distance: route.distance,
      duration: route.duration,
      type: 'route',
      index
    };


    routeCollection.features.push(lineString);


    route.legs[0].steps.forEach((step, index) => {
      const arrowPoint = emptyPoint();
      const stepLineString = emptyLineString();


      const maneuverCoordinates = [];


      stepLineString.geometry.coordinates = maneuverCoordinates;
      stepLineString.properties = {
        distance: step.distance.value,
        duration: step.duration.value,
        type: 'stepRoute',
        index
      };


      routeCollection.features.push(stepLineString);

      const maneuverPoint = emptyPoint();
      maneuverPoint.geometry.coordinates = [
        step.maneuver.coordinate.longitude,
        step.maneuver.coordinate.latitude
      ];
      maneuverPoint.properties = {
        type: 'maneuver',
        detail: step.maneuver,
        instruction: step.maneuver.instruction,
        index
      };


      routeCollection.features.push(maneuverPoint);


      routeCollection.features.push(arrowPoint);
    });
  });
  return routeCollection;
}


function initLayer(nbmap: any) {
  nbmap.map.addLayer({
    id: "navigation-route-line",
    type: "line",
    source: "route",
    filter: ["==", ["get", "type"], "route"],
    layout: {
      "line-cap": "butt",
      "line-join": "round",
      visibility: "visible",
    },
    paint: {
      "line-color": "rgba(52, 168, 83, 0.7)",
      "line-width": 10,
    },
  });

  nbmap.map.addLayer({
    id: "maneuver-points",
    type: "circle",
    filter: ["==", ["get", "type"], "maneuver"],
    source: "route",
    paint: {
      "circle-color": "#34A853",
      "circle-radius": 10,
    },
  });

  nbmap.map.addLayer({
    id: "maneuver-instruction",
    type: "symbol",
    filter: ["==", ["get", "type"], "maneuver"],
    source: "route",
    layout: {
      "text-field": ["get", "instruction"],
      "text-variable-anchor": ["top", "bottom", "left", "right"],
      "text-radial-offset": 0.5,
      "text-justify": "auto",
    },
  });


  nbmap.map.loadImage(startIcon, (error, sIcon) => {
    if (error) throw error;

    nbmap.map.addImage("start-icon", sIcon);

    nbmap.map.addLayer({
      id: "start-points-layer",
      type: "symbol", // Change from 'circle' to 'symbol'
      source: "start-points",
      layout: {
        "text-field": 'Pickup Point',
        "icon-image": "start-icon", // Specify the ID of the icon image added to the map
        "icon-size": 0.1, // Adjust the size of the icon as needed
        "icon-anchor": "center", // Center the icon on the coordinates
        'text-font': ['Open Sans Bold'],
        'text-size': 12,
        'text-offset': [0, 2], // Move text a bit higher to create a rectangle
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#000', // Text color
        'text-halo-color': '#FFF', // Background color for text
        'text-halo-width': 2 // Width of the background
      }
    });
  });

  nbmap.map.loadImage(endIcon, (error, eIcon) => {
    if (error) throw error;

    nbmap.map.addImage("end-icon", eIcon);

    nbmap.map.addLayer({
      id: "end-points-layer",
      type: "symbol", // Change from 'circle' to 'symbol'
      source: "end-points",
      layout: {
        "text-field": 'Dropoff Point',
        "icon-image": "end-icon", // Specify the ID of the icon image added to the map
        "icon-size": 0.1, // Adjust the size of the icon as needed
        "icon-anchor": "center", // Center the icon on the coordinates
        'text-font': ['Open Sans Bold'],
        'text-size': 12,
        'text-offset': [0, 2], // Move text a bit higher to create a rectangle
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#000', // Text color
        'text-halo-color': '#FFF', // Background color for text
        'text-halo-width': 2 // Width of the background
      }
    });
  });

  nbmap.map.loadImage(truckIcon, (error, carImage) => {
    if (error) throw error;

    nbmap.map.addImage("car-icon", carImage);

    nbmap.map.addLayer({
      id: "live-location-point",
      type: "symbol", // Change from 'circle' to 'symbol'
      source: "live-location",
      layout: {
        "icon-image": "car-icon", // Specify the ID of the icon image added to the map
        "icon-size": 0.1, // Adjust the size of the icon as needed
        "icon-anchor": "center", // Center the icon on the coordinates
      },
    });
  });
}

function updateResult(nbmap, payload) {
  const source = nbmap.map.getSource("route");
  if (source) {
    const data = generateNavigationFeature(payload);
    source.setData(data);
  } else {
    console.warn("Route source not found");
  }
}

const NavigateShipment = () => {
  const { tid } = useParams();
  const nbmapRef = useRef(null);
  const [routeData, setRouteData] = useState(null);
  const [zoom, setZoom] = useState(18);
  const [liveLocation, setLiveLocation] = useState({
    lat: 34.052235,
    lng: -118.243683,
  });

  var watch_id = navigator.geolocation.watchPosition((position) => {
    setLiveLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
    // setLiveLocation({lat: 28.4462419, lng: 77.0345721});
    console.log(position);
  });

  const [center, setCenter] = useState<any>({ lat: 28.6139, lng: 77.2088 });

  const [trackings, setTrackings] = useState<any>([]);
  const [pusherData, setPusherData] = useState<any>([]);
  const [shipment, setShipment] = useState<any>([]);

  const checkDriver = () => {
    console.log("pusherData", pusherData);
    console.log("shipment", shipment);
    if (shipment.length > 0) {
      // Check if any of the pusherData entries have a bidder_id that matches the winning_bid's bidder_id
      const winningBidderId = shipment[0]?.winning_bid?.bidder_id;
      const matchedRecord = pusherData.find(
        (item) => item.id === winningBidderId
      );

      if (matchedRecord) {
        console.log("matchedRecord : ", matchedRecord);
        setCenter({ lat: matchedRecord?.lat, lng: matchedRecord?.lng });
        // setLiveLocation({ lat: matchedRecord?.lat, lng: matchedRecord?.lng });
        setLiveLocation({lat: 28.4462419, lng: 77.0345721  });
        
      } else {
        console.log("Bidder ID does not exist in Pusher data");
      }
    } else {
      console.log("trackings empty");
    }
  };

  useEffect(() => {
    console.log("pusher start");
    // Replace with your Pusher credentials
    const pusher = new Pusher("cba34a03b87076b69b01", {
      cluster: "ap2",
      // encrypted: true
    });

    const channel = pusher.subscribe("chats-production");
    channel.bind("message", (data) => {
      console.log("pusher Received message: ", data);
      setPusherData((prevData) => [...prevData, data]);

      // console.log('winning bid',trackings[0]?.winning_bid?.bidder_id);
      // console.log('pusher',data?.id);
    });

    return () => {
      pusher.unsubscribe("chats-production");
    };
    console.log("pusher end");
  }, []);

  useEffect(() => {
    checkDriver();
  }, [pusherData, shipment]);

  useEffect(() => {

    console.log("center now  : ", center);
    nbmapRef.current = new NBMap({
      container: "map",
      zoom: 14,
      style: "https://api.nextbillion.io/maps/streets/style.json",
      center: { lat: center?.lat, lng: center?.lng }
    });


    nbmapRef.current.on('load', () => {
      initSource(nbmapRef.current);
      initLayer(nbmapRef.current);

    });
  }, []);



  useEffect(() => {
    nbmapRef.current.map.flyTo({
      zoom: zoom,
      center: { lat: center?.lat, lng: center?.lng }
    });
  }, [zoom])








  //const [trackings, setTrackings] = useState<any>([]);

  useEffect(() => {
    const liveLocationSource = nbmapRef.current.map.getSource("live-location");
    console.log("liveLocationSource", liveLocationSource);
    console.log("liveLocation", liveLocation);

    if (liveLocationSource) {
      liveLocationSource.setData({
        type: "Feature",
        geometry: {
          type: "Point", // Correct type for GeoJSON point
          coordinates: [liveLocation?.lng, liveLocation?.lat],
        },
        properties: {
          //icon: truckIcon
        },
      });
    } else {
      console.warn("Live location source not found");
    }

    const startPointSource = nbmapRef.current.map.getSource("start-points");
    console.log("startPointSource", startPointSource);

    if (startPointSource) {
      startPointSource.setData({
        type: "Feature",
        geometry: {
          type: "Point", // Correct type for GeoJSON point
          coordinates: [pickup_coords?.lng, pickup_coords?.lat],
        },
        properties: {
          pointType: "start",
        },
      });
    } else {
      console.warn("pickup_coords source not found");
    }

    const endPointSource = nbmapRef.current.map.getSource("end-points");
    console.log("endPointSource", endPointSource);

    if (endPointSource) {
      endPointSource.setData({
        type: "Feature",
        geometry: {
          type: "Point", // Correct type for GeoJSON point
          coordinates: [dest_coords?.lng, dest_coords?.lat],
        },
        properties: {
          pointType: "end",
        },
      });
    } else {
      console.warn("pickup_coords source not found");
    }

    if (routeData) {
      updateResult(nbmapRef.current, routeData);
    }
  }, [liveLocation, routeData]);


  const [pickup_coords, setPickupCoords] = useState<any>();
  const [dest_coords, setDestCoords] = useState<any>();


  useEffect(() => {
    baseClient.get(`shipment/track/${tid}`).then((response) => {
      setShipment(response.data)

      const { pickup_address_coords, destination_address_coords } = response.data[0];
      const pickupCoords = JSON.parse(pickup_address_coords);
      const destinationCoords = JSON.parse(destination_address_coords);
      setPickupCoords(JSON.parse(pickup_address_coords));
      setDestCoords(JSON.parse(destination_address_coords));
      setCenter(pickupCoords);

      const routingUrl = `https://api.nextbillion.io/navigation/json?option=flexible&key=${nb_key}&origin=${pickup_coords?.lat},${pickup_coords?.lng}&destination=${destinationCoords?.lat},${destinationCoords?.lng}&mode=truck&overview=simplified&alternatives=true`;


      return fetch(routingUrl);
    }).then(response => response.json())
      .then((data) => {
        setRouteData(data);
        if (nbmapRef.current) {
          updateResult(nbmapRef.current, data);
        }
      }).catch((error) => {
        console.log(error);
      });
  }, [tid]);


  useEffect(() => {
    const routingUrl = `https://api.nextbillion.io/navigation/json?option=flexible&key=${nb_key}&waypoints=${pickup_coords?.lat},${pickup_coords?.lng}&origin=${liveLocation?.lat},${liveLocation?.lng}&destination=${dest_coords?.lat},${dest_coords?.lng}&mode=truck&overview=simplified&alternatives=true`;
    fetch(routingUrl)
      .then((response) => response.json())
      .then((data) => {
        setRouteData(data);
        if (nbmapRef.current) {
          updateResult(nbmapRef.current, data);
        }
      });
  }, [pickup_coords, dest_coords, liveLocation]);

  const NavigateTo = (type: number) => {
    switch (type) {
      case 1:
        nbmapRef.current.map.flyTo({
          zoom: 14,
          center: { lat: pickup_coords?.lat, lng: pickup_coords?.lng }
        });
        break;
      case 2:
        nbmapRef.current.map.flyTo({
          zoom: zoom,
          center: { lat: liveLocation?.lat, lng: liveLocation?.lng }
        });
        break;
      default:
        setCenter({ lat: liveLocation?.lat, lng: liveLocation?.lng });
        nbmapRef.current.map.flyTo({
          zoom: zoom,
          center: { lat: pickup_coords?.lat, lng: pickup_coords?.lng }
        });
        break;
    }
  }

  useEffect(()=>{
    nbmapRef.current.map.flyTo({
      zoom: 14,
      center: { lat: center?.lat, lng: center?.lng }
    });
  },[center])

  return (
    <div className=" pl-[66px] w-full relative">
      <button className="absolute px-3 py-1 rounded-full flex items-center gap-1 bg-blue-500 z-[1000] bottom-10 right-4 text-white" onClick={()=>{NavigateTo(2)}}>
        <FaLocationArrow></FaLocationArrow> Start
      </button>
      <div className="w-full mt-1">
        <div id="map" className="grid grid-cols-2 w-full h-[calc(100vh-85px)] border border-solid border-grey-200 rounded"></div>
      </div>
    </div>
  );
};

export default NavigateShipment;
