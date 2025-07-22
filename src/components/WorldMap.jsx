import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const WorldMap = () => {
  const mapRef = useRef();

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
        maxBoundsViscosity={1.0}                     // ⬅️ Prevents dragging past the bounds
        minZoom={2.499}
    >
    <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> | &copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    />
    </MapContainer>
  );
};

export default WorldMap;