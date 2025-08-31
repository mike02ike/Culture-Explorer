import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import starIconUrl from "../assets/star.png";
import worldData from '../data/world.json';

const WorldMap = ({ onCountryClick, selectedCountry, countryData }) => {
  const mapRef = useRef();
  const starIcon = L.icon({
  iconUrl: starIconUrl,
  iconSize: [10, 10],   // size of the icon
});

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    const onMove = () => {
      const center = map.getCenter();
      if (center.lat !== fixedLat) {
        // Reset latitude to fixedLat but keep longitude
        map.setView([fixedLat, center.lng], map.getZoom(), { animate: false });
      }
    };

    map.on('move', onMove);

    return () => {
      map.off('move', onMove);
    };
  }, []);

  return (
    <MapContainer
        center={[0, 10]}
        zoom={2.499}
        style={{ height: '100vh', width: '100vw' }}
        whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
        }}
        maxBounds={[[-85, -180], [85, 180]]}         // ⬅️ This sets the scroll limits
        maxBoundsViscosity={1.5}                     // ⬅️ Prevents dragging past the bounds
        minZoom={2.499}
    >
    <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    />
    <GeoJSON
      data={worldData}
      style={{ color: "black", weight: 0.1, fillOpacity: 0 }}
      onEachFeature={(feature, layer) => {
        layer.on({
          click: () => {
            onCountryClick(feature.properties);
            const countryName = feature.properties.name;
            console.log("Clicked country:", countryName); // Debug log
          }
        });
      }}
    />
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