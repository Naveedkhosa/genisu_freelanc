import { useParams } from "react-router-dom";
import baseClient from "@/services/apiClient";
import { useEffect, useRef, useState } from "react";
import nextbillion, { NBMap } from "@nbai/nbmap-gl";
import { Button } from "@/components/ui/button";
import "@nbai/nbmap-gl/dist/nextbillion.css";
import polyline from 'polyline';
import './direction.css';
import MapImg from '@/assets/map.png'
import {nb_key} from "@/services/apiClient";
import { PhoneCall } from "lucide-react";

import { FiMapPin } from 'react-icons/fi';
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


  payload.routes.forEach((route, index) => {

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


function initLayer(nbmap) {
  nbmap.map.addLayer({
    id: 'navigation-route-line',
    type: 'line',
    source: 'route',
    filter: ['==', ['get', 'type'], 'route'],
    layout: {
      'line-cap': 'butt',
      'line-join': 'round',
      visibility: 'visible'
    },
    paint: {
      'line-color': 'rgba(66, 63, 189, 0.5)',
      'line-width': 10
    }
  });

  nbmap.map.addLayer({
    id: 'maneuver-points',
    type: 'circle',
    filter: ['==', ['get', 'type'], 'maneuver'],
    source: 'route',
    paint: {
      'circle-color': '#3853B1',
      'circle-radius': 10
    }
  });

  nbmap.map.addLayer({
    id: 'maneuver-instruction',
    type: 'symbol',
    filter: ['==', ['get', 'type'], 'maneuver'],
    source: 'route',
    layout: {
      'text-field': ['get', 'instruction'],
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto'
    }
  });
}


function updateResult(nbmap, payload) {
  const source = nbmap.map.getSource('route');
  const data = generateNavigationFeature(payload);
  source.setData(data);
}

const TrackShipment = () => {
  const { tid } = useParams();
  const nbmapRef = useRef(null);
  const [routeData, setRouteData] = useState(null);

  const [center, setCenter] = useState<any>({ lat: 28.6139, lng: 77.2088 });

  useEffect(() => {


    nbmapRef.current = new NBMap({
      container: "map",
      zoom: 14,
      style: "https://api.nextbillion.io/maps/streets/style.json",
      center: { lat: center.lat, lng: center.lng }
    });


    nbmapRef.current.on('load', () => {
      initSource(nbmapRef.current);
      initLayer(nbmapRef.current);
    });
  }, [center]);


  const [trackings, setTrackings] = useState<any>([]);



  useEffect(() => {
    baseClient.get(`shipment/track/${tid}`).then((response) => {

      baseClient.get(`tracking/history/${response?.data[0]?.id}`).then((response1) => {
        console.log("response_data : ", response1.data);
        setTrackings(response1.data);
      });


      const { pickup_address_coords, destination_address_coords } = response.data[0];
      const pickupCoords = JSON.parse(pickup_address_coords);
      const destinationCoords = JSON.parse(destination_address_coords);
      setCenter(pickupCoords);

      // Use NextBillion's routing service
      // const routingUrl = `https://api.nextbillion.io/navigation/json?option=flexible&key=4497e6efb7ed4aba97da41643b621a5e&origin=34.05605379,-118.24495386&destination=34.05023939,-118.24885017&mode=truck&overview=simplified&alternatives=true`;

      const routingUrl = `https://api.nextbillion.io/navigation/json?option=flexible&key=4497e6efb7ed4aba97da41643b621a5e&origin=${pickupCoords.lat},${pickupCoords.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}&mode=truck&overview=simplified&alternatives=true`;


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

  return (
    <div className="px-4 pl-[84px] w-full">
      {/* track - details */}

      <div className="p-2 w-full flex flex-col justify-center">

        <div className="flex justify-between">
          <div className="flex">
            <div className="w-10 border h-10 rounded-full relative">
              <img src={MapImg} alt="map-img" className="w-full h-full" />
            </div>
            <div className="flex flex-col ml-2">
              <p className="font-bold text-gray-300">Driver Name</p>
              <p className="font-bold text-xs text-gray-300">12:00 12-15-2024</p>
            </div>
          </div>
          <Button className="bg-gray-200">
            <PhoneCall size={15} />
          </Button>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-4">
            <FiMapPin className="text-green-500 mr-2" size={24} />
            <h2 className="text-xl font-bold text-gray-300">Service Timeline</h2>
          </div>

          <div className="border-l-2 border-gray-200 pl-4 ml-3">

            {trackings?.length == 0 && (
              <p className="text-gray-300 text-sm py-2 px-1">No tracking records yet</p>
            )}
            {trackings?.length > 0 && (
              trackings.map((track:any) => (

                <div className="mb-6">
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-semibold text-gray-300">
                      {track?.status == "pickup" && (
                        <>Coming For Pickup</>
                      )}
                      {track?.status == "in_transit" && (
                        <>In Transit</>
                      )}
                      {track?.status == "delivered" && (
                        <>Delivered</>
                      )}
                    </h3>
                  </div>
                  <p className="text-gray-400">
                    {track?.status == "pickup" && (
                      <>
                        {track?.location}
                      </>

                    )}
                    {track?.status != "pickup" && (
                      <>
                        {track?.timestamp}
                      </>
                    )}
                  </p>
                </div>

              ))
            )}
          </div>
        </div>

      </div>

      <div className="w-full p-2">
        <div id="map" className="grid grid-cols-2 w-full h-[600px] border border-solid border-grey-200 rounded"></div>
      </div>
    </div>
  );
};

export default TrackShipment;
