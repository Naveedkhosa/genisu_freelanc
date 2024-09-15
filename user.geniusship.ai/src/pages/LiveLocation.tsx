import { useEffect, useState, useRef } from "react";
import nextbillion, { NBMap } from "@nbai/nbmap-gl";
import Pusher from 'pusher-js';
import {nb_key} from "@/services/apiClient";
// import the css of the map
import "@nbai/nbmap-gl/dist/nextbillion.css";


// set your nextbillion api key
nextbillion.setApiKey(nb_key);

function LiveLocation() {
  const [center_points, setCenter_points] = useState({ lat: 30.2400623, lng: 71.4925247 });
  const [objects, setObjects] = useState([]);
  const markersRef = useRef({});

  // Function to add or update an object in the array
  const addOrUpdateObject = (newObject: any) => {
    setObjects((prevObjects: any) => {
      // Check if the object with the same id already exists
      const existingIndex = prevObjects.findIndex((obj: any) => obj.id === newObject.id);

      if (existingIndex >= 0) {
        // If it exists, update the object
        return prevObjects.map((obj: any, index: any) =>
          index === existingIndex ? { ...obj, ...newObject } : obj
        );
      } else {
        // If it doesn't exist, add the new object
        return [...prevObjects, newObject];
      }
    });
  };

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
            addOrUpdateObject(data);
        });

        return () => {
            pusher.unsubscribe('geniusship-production');
        };
        console.log('pusher end');
    }, []);

  const nbmapRef = useRef(null);

  useEffect(() => {
    
    nbmapRef.current = new NBMap({
      container: "map",
      zoom: 12,
      style: "https://api.nextbillion.io/maps/streets/style.json",
      center: center_points,
    });
  }, [center_points]);

  useEffect(() => {
    if (nbmapRef.current) {
      objects.forEach((obj) => {
        addOrUpdateMarker(nbmapRef.current, obj);
      });
    }
  }, [objects]);
  

  const addOrUpdateMarker = (nbmap, obj) => {
    

    if (markersRef.current[obj.id]) {
      // Update marker position
      

      markersRef.current[obj.id].setLngLat({ lat: obj.lat, lng: obj.lng });
    } else {
      // Create new marker
      const popup = new nextbillion.maps.default.Popup({
        offset: 25,
        closeButton: false,
      }).setText(obj.name);

      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(/truck2.png)';
      el.style.backgroundSize = 'cover';
      el.style.width = '70px';
      el.style.height = '70px';

      const marker = new nextbillion.maps.default.Marker({
        element: el,
      })
        .setLngLat({ lat: obj.lat, lng: obj.lng })
        .setPopup(popup)
        .addTo(nbmap.map);
    
      
      markersRef.current[obj.id] = marker;
      marker.togglePopup();
    }
  };

  return (
    <div className="w-[100%] h-[90vh] md:pl-[66px] sm:pl-0">
      <p className="p-2 text-green-500 ">All Active Locations</p>
      <div id="map" className="w-[100%] h-[100%]"></div>
    </div>
  );
}

export default LiveLocation;
