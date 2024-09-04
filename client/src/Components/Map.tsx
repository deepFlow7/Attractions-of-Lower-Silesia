/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Attraction, possibleSubtypes, Subtypes } from '../types';
import { colors } from '../Styles/Themes';

interface MapProps {
  x: number;
  y: number;
  zoom?: number;
  path?: boolean;
  attractions: Attraction[];
  onMapClick?: (coords: { x: number; y: number }) => void;
}

const createCustomIcon = ({ iconUrl }: { iconUrl: string }): L.Icon => {
  return L.icon({
    iconUrl,
    iconSize: [30, 30],
    className: 'ikona',
  });
};

const corgiIcon = L.icon({
  iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_0w828bdU5VGkb_MDCoKUehyDV7YzQBhNu5vd9naFgQ&s',
  iconSize: [50, 50],
  iconAnchor: [25, 5],
});

type Icons = Record<string, L.Icon>;
const icons = possibleSubtypes.reduce((icons: Icons, subtype: Subtypes) => {
  icons[subtype] = createCustomIcon({
    iconUrl: `/obrazki/${subtype}.png`,
  });
  return icons;
}, {});

export interface MapRef {
  getView: () => { center: L.LatLng, zoom: number };
  setUserLocation: (coords: { x: number; y: number }) => void;
}

const Map = forwardRef<MapRef, MapProps>(({ x, y, zoom = 13, path, attractions, onMapClick }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [markerInstance, setMarkerInstance] = useState<L.Marker | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current, { attributionControl: false }).setView([x, y], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

      const southWest = L.latLng(50.1, 14.8);
      const northEast = L.latLng(51.81, 17.8);
      const bounds = L.latLngBounds(southWest, northEast);
      mapInstance.current.setMaxBounds(bounds);
      mapInstance.current.setMinZoom(8);
      mapInstance.current.on('drag', () => {
        mapInstance.current!.panInsideBounds(bounds, { animate: false });
      });

      if (onMapClick) {
        mapInstance.current.on('click', (e) => {
          const newCoords = { x: e.latlng.lat, y: e.latlng.lng };

          if (!markerInstance) {
            const newMarker = L.marker([newCoords.x, newCoords.y], { icon: corgiIcon }).addTo(mapInstance.current!);
            setMarkerInstance(newMarker);
          } else {
            markerInstance.setLatLng(e.latlng);
          }

          onMapClick(newCoords);
        });
      }
    }
  }, [onMapClick, corgiIcon, markerInstance, x, y, zoom]);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.eachLayer((layer) => {
        if ((layer instanceof L.Marker && layer !== markerInstance) || (layer instanceof L.Path)) {
          mapInstance.current?.removeLayer(layer);
        }
      });

      attractions.forEach(attraction => {
        const marker = L.marker([attraction.coords.x, attraction.coords.y], { icon: icons[attraction.subtype] }).addTo(mapInstance.current!);
        const link = `<a href="/attraction/${attraction.id}" target="_blank" style="color: black; text-decoration: underline;">${attraction.name}</a>`;
        marker.bindPopup(link).closePopup();
      });

      
      const zoomLevel = mapInstance.current!.getZoom();
      const newZoomSize = `${7 / 2 * (zoomLevel - 1)}px`;
      if (mapContainer.current) {
          $('#'+mapContainer.current.id+' .ikona').css({'width':newZoomSize,'height':newZoomSize}); 
      }

      if (path) {
        L.polyline(attractions.map(attraction => [attraction.coords.x, attraction.coords.y]), {color:colors.secondary}).addTo(mapInstance.current!);
      }

      mapInstance.current.on('zoomend', () => {
        const zoomLevel = mapInstance.current!.getZoom();
        const newZoomSize = `${7 / 2 * (zoomLevel - 1)}px`;
        if (mapContainer.current) {
            $('#'+mapContainer.current.id+' .ikona').css({'width':newZoomSize,'height':newZoomSize}); 
        }
      });
    }
  }, [attractions, icons, path, markerInstance]);

  useImperativeHandle(ref, () => ({
    getView: () => {
      if (mapInstance.current) {
        return {
          center: mapInstance.current.getCenter(),
          zoom: mapInstance.current.getZoom(),
        };
      }
      return { center: L.latLng(x, y), zoom };
    },
    setUserLocation: (coords) => {
      if (mapInstance.current) {
        const newMarkerCoords = L.latLng(coords.x, coords.y);

        if (!markerInstance) {
          const newMarker = L.marker([newMarkerCoords.lat, newMarkerCoords.lng], { icon: corgiIcon }).addTo(mapInstance.current!);
          setMarkerInstance(newMarker);
        } else {
          markerInstance.setLatLng(newMarkerCoords);
        }
      }
    }
  }));

  return (
    <div id="MapContainer" style={{ padding: 0, margin: 0, width: '100%', height: '80vh' }} ref={mapContainer}></div>
  );
});

export default Map;
