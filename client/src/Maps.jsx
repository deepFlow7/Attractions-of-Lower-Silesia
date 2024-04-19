import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ x, y }) {
    const mapContainer = useRef();
    const [map, setMap] = useState(null);

    useEffect(() => {
        const mapInstance = L.map(mapContainer.current, { attributionControl: false }).setView([x, y], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        setMap(mapInstance);

        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, [x, y]);

    return (
        <div style={{ padding: 0, margin: 0, width: "80%", height: "50vh" }} ref={mapContainer}></div>
    );
}
