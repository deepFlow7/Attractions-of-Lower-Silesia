import React, { useEffect, useRef, useState } from 'react';
import L, { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Attraction,possibleSubtypes,subtypes } from '../types';

interface MapProps {
    x: number;
    y: number;
    attractions: Attraction[];
}

var CustomIcon = L.Icon.extend({
    options:{
        className: 'ikona',
        iconSize: [50, 50],
    }
})

type Icons=Record<PropertyKey,typeof CustomIcon>;
const icons = possibleSubtypes
                    .reduce((icons:Icons,subtype:subtypes)=>{
                        icons[subtype] = new CustomIcon({
                            iconUrl: '../../public/obrazki/'+subtype+'.png',
                        });
                        return icons;
                    },{});

                    console.log(icons);








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
            
            attractions.forEach(attraction => {
                const marker = L.marker([attraction.coords.x, attraction.coords.y],  { icon: icons[attraction.subtype]   }).addTo(mapInstance);
                marker.bindPopup(attraction.name).closePopup();
            });
            /*
            mapInstance.on('zoomed', function() {
                var newzoom = '' + (2*(mapInstance.getZoom())) +'px';
                $('#mapid .YourClassName').css({'width':newzoom,'height':newzoom}); 
            });*/
        }

        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, [x, y]);

    return (
        <div style={{ padding: 0, margin: 0, width: "100%", height: "50vh" }} ref={mapContainer}></div>
    );

}