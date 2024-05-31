import React, { useEffect, useRef, useState } from 'react';
import L, { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Attraction } from '../types';

interface MapProps {
    x: number;
    y: number;
    attractions: Attraction[];
}

interface IPoints {
    coordinates: LatLngExpression,
    name: string
}

const example_points: IPoints[] = [
    {
        coordinates: [51.1106, 17.0601],
        name: "Location 1"
    },
    {
        coordinates: [51.115, 17.055],
        name: "Location 2"
    },
    {
        coordinates: [51.108, 17.065],
        name: "Location 3"
    }
];

export default function Map({ x, y, attractions} : MapProps) {

    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<L.Map | null>(null);

    useEffect(() => {
        const mapInstance = L.map(mapContainer.current!, { attributionControl: false }).setView([x, y], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        setMap(mapInstance);

        if (mapInstance) {
            const customIcon = L.icon({
                iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_0w828bdU5VGkb_MDCoKUehyDV7YzQBhNu5vd9naFgQ&s',
                iconSize: [50, 50], 
                iconAnchor: [25, 5], 
            });

            attractions.forEach(attraction => {
                const marker = L.marker([attraction.coords.x, attraction.coords.y],  { icon: customIcon }).addTo(mapInstance);
                marker.bindPopup(attraction.name).closePopup();
            });
        }

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