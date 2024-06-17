import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Attraction,possibleSubtypes,subtypes } from '../types';

interface MapProps {
    x: number;
    y: number;
    attractions: Attraction[];
    onMapClick?: (coords: { x: number; y: number }) => void;
}

var CustomIcon = L.Icon.extend({
    options:{
        className: 'ikona',
        iconSize: [30,30],
    }
})

type Icons=Record<PropertyKey,  L.Icon>;
const icons = possibleSubtypes
                    .reduce((icons:Icons,subtype:subtypes)=>{
                        icons[subtype] = new CustomIcon({
                            iconUrl: '/obrazki/'+subtype+'.png',
                        });
                        return icons;
                    },{});

                    //console.log(icons);

export default function Map({ x, y, attractions, onMapClick }: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const [markerInstance, setMarkerInstance] = useState<L.Marker | null>(null);

    useEffect(() => {
        if (mapContainer.current && !mapInstance.current) {
            mapInstance.current = L.map(mapContainer.current, { attributionControl: false }).setView([x, y], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            const southWest = L.latLng(50.1, 14.8); 
            const northEast = L.latLng(51.81, 17.8); 
            const bounds = L.latLngBounds(southWest, northEast);
            mapInstance.current.setMaxBounds(bounds);
            mapInstance.current.setMinZoom(8);
            mapInstance.current.on('drag', function () {
                mapInstance.current!.panInsideBounds(bounds, { animate: false });
            });

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
                const marker = L.marker([attraction.coords.x, attraction.coords.y], { icon: icons[attraction.subtype] }).addTo(mapInstance.current!);
                const link = `<a href="/attraction/${attraction.id}" target="_blank" style="color: black; text-decoration: underline;">${attraction.name}</a>`;
                marker.bindPopup(link).closePopup();

            });
            
            mapInstance.on('zoomend', function() {
                var zoom=mapInstance.getZoom();
                var newzoom = 5/2*(zoom-1)+'px';
                $('#'+mapContainer.current!.id+' .ikona').css({'width':newzoom,'height':newzoom}); 
            });
        }
    }, [attractions, icons, x, y]);

    return (
        <div id="MapContainer" style={{ padding: 0, margin: 0, width: "100%", height: "80vh" }} ref={mapContainer}></div>
    );
}
