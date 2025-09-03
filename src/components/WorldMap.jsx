// import necessary libraries and components
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import starIconUrl from "../assets/star.png";
import worldData from '../data/world.json';

// WorldMap component
const WorldMap = ({ onCountryClick, selectedCountry, countryData }) => {
  const mapRef = useRef(); // holds Leaflet map instance
  
  // icon used to mark capital cities
  const starIcon = L.icon({
    iconUrl: starIconUrl,
    iconSize: [10, 10], // [width, height] in pixels
  });

  // lock map latitude, allow free longitude panning
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onMove = () => {
      const center = map.getCenter();
      if (center.lat !== fixedLat) {
        // reset lat to fixedLat, keep lng + zoom unchanged
        map.setView([fixedLat, center.lng], map.getZoom(), { animate: false });
      }
    };

    map.on('move', onMove); // bind move listener
    return () => map.off('move', onMove); // cleanup listener
  }, []);

  return (
    <MapContainer
      center={[0, 10]}
      zoom={2.499}
      style={{ height: '100vh', width: '100vw' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance; // store map instance in ref
      }}
      maxBounds={[[-85, -180], [85, 180]]} // world scroll limits
      maxBoundsViscosity={1.5} // stop drag beyond bounds
      minZoom={2.499} // prevent zooming out too far
    >
      {/* base map tiles */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* draw country borders + handle clicks */}
      <GeoJSON
        data={worldData}
        style={{ color: "black", weight: 0.1, fillOpacity: 0 }}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: () => {
              onCountryClick(feature.properties); // pass clicked country up
              console.log("Clicked country:", feature.properties.name);
            }
          });
        }}
      />

      {/* capital marker with popup */}
      {countryData?.capitalInfo?.latlng && (
        <Marker position={countryData.capitalInfo.latlng} icon={starIcon}>
          <Popup>
            {selectedCountry?.name} – Capital: {countryData.capital?.[0]}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default WorldMap;