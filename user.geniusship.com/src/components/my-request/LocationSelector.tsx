import { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// Fix the default icon issue with React-Leaflet and Webpack
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });
 
const LocationSelector = ({ onSelectLocations, route }) => {
//   const [markers, setMarkers] = useState([]);

//   useEffect(() => {
//     if (route) {
//       const { coordinates } = route;
//        
//       setMarkers([coordinates[0], coordinates[coordinates.length - 1]]);
//     }
//   }, [route]);

//   const MapClickHandler = () => {
//     useMapEvents({
//       click(e) {
//         const newMarker = [e.latlng.lat, e.latlng.lng];
//          
//         setMarkers((current) => [...current, newMarker]);
//         if (markers.length === 1) {
//           onSelectLocations([...markers, newMarker]);
//         }
//       },
//     });
//     return null;
//   };

  return (
    {/**
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
      {markers.map((position, idx) => (
        <Marker key={`marker-${idx}`} position={position} />
      ))}
      {route && (
        <Polyline positions={route.coordinates} color="blue" />
      )}
    </MapContainer>
        */}
  );
};

export default LocationSelector;
