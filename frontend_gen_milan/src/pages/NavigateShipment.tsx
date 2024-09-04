import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import baseClient from '@/services/apiClient';
import nextbillion, { NBMap } from '@nbai/nbmap-gl';
import '@nbai/nbmap-gl/dist/nextbillion.css';
import polyline from 'polyline';
import Pusher from 'pusher-js';
import './direction.css';
import carIcon from '@/assets/car.png';
import stopIcon from '@/assets/boy.png';
import {nb_key} from "@/services/apiClient";
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
  nbmap.map.addSource('live-location', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [0, 0] // Initialize with default coordinates
      }
    }
  });
  
    // Add source for start and destination icons
  nbmap.map.addSource('start-end-points', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
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

function generateNavigationFeature(payload: any) {
  const routeCollection = emptyFeatureCollection();
  payload?.routes?.forEach((route: any, index: any) => {
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

  // nbmap.map.addLayer({
  //   id: 'maneuver-points',
  //   type: 'circle',
  //   filter: ['==', ['get', 'type'], 'maneuver'],
  //   source: 'route',
  //   paint: {
  //     'circle-color': '#3853B1',
  //     'circle-radius': 10
  //   }
  // });

 // Load the car icon
nbmap.map.loadImage(carIcon, (error, carImage) => {
  if (error) throw error;

  nbmap.map.addImage('car-icon', carImage);

  // Load the stop icon
  nbmap.map.loadImage(stopIcon, (error, stopImage) => {
    if (error) throw error;

    nbmap.map.addImage('stop-icon', stopImage);

    // Add a symbol layer using the car and stop icons
    nbmap.map.addLayer({
      id: 'maneuver-points',
      type: 'symbol',
      filter: ['==', ['get', 'type'], 'maneuver'],
      source: 'route',
      layout: {
        'icon-image': [
          'case',
          ['==', ['get', 'subtype'], 'start'], 'stop-icon', // Use car icon if subtype is 'start'
          ['==', ['get', 'subtype'], 'stop'], 'stop-icon', // Use stop icon if subtype is 'stop'
          'car-icon' // Default icon for other maneuvers
        ],
        'icon-size': 0.1, // Adjust the size as needed
      }
    });
  });
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

  nbmap.map.addLayer({
    id: 'live-location-point',
    type: 'circle',
    source: 'live-location',
    paint: {
      'circle-color': '#ff0000',
      'circle-radius': 10
    }
  });
  
  // Add a layer for the start (car icon) and end (stop icon) points
  nbmap.map.addLayer({
    id: 'start-end-points-layer',
    type: 'symbol',
    source: 'start-end-points',
    layout: {
      'icon-image': ['get', 'icon'],
      'icon-size': 1.5,
      'icon-allow-overlap': true
    }
  });
}


function updateResult(nbmap, payload) {
  const source = nbmap.map.getSource('route');
  if (source) {
    const data = generateNavigationFeature(payload);
    source.setData(data);
  } else {
    console.warn('Route source not found');
  }
}

const NavigateShipment = () => {
  const { tid } = useParams();
  const nbmapRef = useRef(null);
  const [routeData, setRouteData] = useState(null);
  const [liveLocation, setLiveLocation] = useState({ lat: 34.052235, lng: -118.243683 }); // Default location

//   useEffect(() => {
//     const pusher = new Pusher('dfe96704a38961067cf1', {
//       cluster: 'ap2'
//     });

//     const channel = pusher.subscribe('chat');


//     channel.bind('message', function (data) {
//       console.log('Live location data received:', data);
//       setLiveLocation({ lat: data.lat, lng: data.lng });
//     });

//     return () => {
//       pusher.unsubscribe('chat');
//     };
//   }, []);

  const current_user = JSON.parse(localStorage.getItem("user"));
  

useEffect(() => {
     console.log('pusher start');
        // Replace with your Pusher credentials
        const pusher = new Pusher('64a0078618a01f0c0187', {
            cluster: 'ap2',
           // encrypted: true
        });

        const channel = pusher.subscribe('geniusship-production');
        channel.bind('message', (data) => {
            console.log('Received message: ', data);
            if(data.id==current_user?.id){
               setLiveLocation({ lat: data.lat, lng: data.lng });
            }
        });

        return () => {
            pusher.unsubscribe('geniusship-production');
        };
        console.log('pusher end');
    }, []);

  const [map_center, setMapCenter] = useState({ lat: 28.6133, lng: 77.2104 });

  useEffect(() => {


    nbmapRef.current = new NBMap({
      container: 'map',
      zoom: 18,
      style: 'https://api.nextbillion.io/maps/streets/style.json',
      center: { lat: map_center?.lat, lng: map_center?.lng }
    });


    nbmapRef.current.on('load', () => {
      initSource(nbmapRef.current);
      initLayer(nbmapRef.current);
      
      // Load the car and stop icons
      nbmapRef.current.map.loadImage(carIcon, (error, image) => {
        if (error) throw error;
        nbmapRef.current.map.addImage('car-icon', image);
      });

      nbmapRef.current.map.loadImage(stopIcon, (error, image) => {
        if (error) throw error;
        nbmapRef.current.map.addImage('stop-icon', image);
      });
      
      
      
    });
  }, []);

  useEffect(() => {
    if (nbmapRef.current && nbmapRef.current.map.isStyleLoaded()) {
      const liveLocationSource = nbmapRef.current.map.getSource('live-location');
      if (liveLocationSource) {
        liveLocationSource.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [liveLocation.lng, liveLocation.lat]
          },
          properties: {}
        });
      } else {
        console.warn('Live location source not found');
      }
      if (routeData) {
        updateResult(nbmapRef.current, routeData);
      }
      
        // Update the start and end points
      const startEndSource = nbmapRef.current.map.getSource('start-end-points');
      if (startEndSource) {
        startEndSource.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'symbol',
                coordinates: [pickup_coords.lng, pickup_coords.lat]
              },
              properties: {
                icon: carIcon
              }
            },
            {
              type: 'Feature',
              geometry: {
                type: 'symbol',
                coordinates: [dest_coords.lng, dest_coords.lat]
              },
              properties: {
                icon: stopIcon
              }
            }
          ]
        });
      }
    
      
    }
  }, [liveLocation, routeData]);

  const [pickup_coords, setPickupCoords] = useState<any>();
  const [dest_coords, setDestCoords] = useState<any>();

  useEffect(() => {
    baseClient.get(`shipment/track/${tid}`).then((response) => {
      const { pickup_address_coords, destination_address_coords } = response.data[0];
      setPickupCoords(JSON.parse(pickup_address_coords));
      setDestCoords(JSON.parse(destination_address_coords));
    });
  }, [tid]);


  useEffect(() => {
      
    const routingUrl = `https://api.nextbillion.io/navigation/json?option=flexible&key=4497e6efb7ed4aba97da41643b621a5e&origin=${liveLocation?.lat},${liveLocation?.lng}&destination=${dest_coords?.lat},${dest_coords?.lng}&waypoints=${pickup_coords?.lat},${pickup_coords?.lng}&mode=truck&overview=simplified&alternatives=true`;
    fetch(routingUrl)
      .then(response => response.json())
      .then(data => {
        setRouteData(data);
        if (nbmapRef.current) {
          updateResult(nbmapRef.current, data);
        }
      })
  }, [pickup_coords, dest_coords, liveLocation])

  // useEffect(() => {
  //   baseClient.get(`shipment/track/${tid}`).then((response) => {
  //     const { pickup_address_coords, destination_address_coords } = response.data[0];
  //     const pickupCoords = JSON.parse(pickup_address_coords);
  //     const destinationCoords = JSON.parse(destination_address_coords);

  //     navigator.geolocation.getCurrentPosition(position => {
  //       // const userLocation = { lat: "34.0572", lng: "-118.024569" };

  //       console.log("position is is ",position)

  //       // Construct the routing URL
  //       const routingUrl = `https://api.nextbillion.io/navigation/json?option=flexible&key=4497e6efb7ed4aba97da41643b621a5e&origin=${position.lat},${position.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}&waypoints=${pickupCoords.lat},${pickupCoords.lng}&mode=truck&overview=simplified&alternatives=true`;
  //       console.log('routingUrl',routingUrl);
  //       fetch(routingUrl)
  //         .then(response => response.json())
  //         .then(data => {
  //           setRouteData(data);
  //           if (nbmapRef.current) {
  //             updateResult(nbmapRef.current, data);
  //           }
  //         })
  //         .catch(error => console.log(error));
  //     }, error => {
  //       alert('Error getting your location:'+error);
  //     });
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }, [tid]);

  return (
    <>
      <div className="w-full p-2">
        <div id="map" className="grid grid-cols-2 w-full h-[600px] border border-solid border-grey-200 rounded"></div>
      </div>
    </>
  );
};

export default NavigateShipment;
