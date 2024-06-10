import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Attraction } from '../types';

interface MapProps {
    x: number;
    y: number;
    attractions: Attraction[];
    onMapClick?: (coords: { x: number; y: number }) => void;
}

export default function Map({ x, y, attractions, onMapClick }: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const [markerInstance, setMarkerInstance] = useState<L.Marker | null>(null);

    const customIcon = L.icon({
        iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_0w828bdU5VGkb_MDCoKUehyDV7YzQBhNu5vd9naFgQ&s',
        iconSize: [50, 50],
        iconAnchor: [25, 5],
    });

    useEffect(() => {
        if (mapContainer.current && !mapInstance.current) {
            mapInstance.current = L.map(mapContainer.current, { attributionControl: false }).setView([x, y], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            if (onMapClick) {
                mapInstance.current.on('click', (e) => {
                    const newCoords = { x: e.latlng.lat, y: e.latlng.lng };

                    if (!markerInstance) {
                        const newMarker = L.marker([newCoords.x, newCoords.y], { icon: customIcon }).addTo(mapInstance.current!);
                        setMarkerInstance(newMarker);
                    } else {
                        markerInstance.setLatLng(e.latlng);
                    }

                    onMapClick(newCoords);
                });
            }
        }
    }, [onMapClick, customIcon, markerInstance]);

    useEffect(() => {
        if (mapInstance.current) {
            mapInstance.current.eachLayer((layer) => {
                if (layer instanceof L.Marker && layer !== markerInstance) {
                    mapInstance.current?.removeLayer(layer);
                }
            });

            attractions.forEach(attraction => {
                const marker = L.marker([attraction.coords.x, attraction.coords.y], { icon: customIcon }).addTo(mapInstance.current!);
                marker.bindPopup(attraction.name).closePopup();
            });
        }
    }, [attractions, customIcon]);

    return (
        <div style={{ padding: 0, margin: 0, width: "100%", height: "50vh" }} ref={mapContainer}></div>
    );
}
