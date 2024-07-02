import React, { useState, useRef, useEffect } from 'react';
import { Grid, Typography, TextField, Button, InputBase } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import axios from 'axios';
import Map, { MapRef } from './Map';
import { Attraction, possible_type, subtypes, possibleSubtypes, possibleTypes } from '../types';
import FilterList from './FilterList';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material'; 
const FormContainer = styled.div`
  max-width: 1200px;
  margin: 4% auto; 
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ScrollableBox = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc; 
  padding: 8px; 
`;

const TypographyStyled = styled(Typography)`
  font-size: 1.2rem; 
  font-weight: bold; 
`;

const StyledInputBase = styled(InputBase)`
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  padding: 4px 8px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);

  &:hover {
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  }
`;

const RoutePlanner = () => {
  const [selectedAttractions, setSelectedAttractions] = useState<number[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<possible_type[]>(possibleTypes);
  const [selectedSubtypes, setSelectedSubtypes] = useState<subtypes[]>(possibleSubtypes);
  const initialMapView = { center: { x: 51.1079, y: 17.0385 }, zoom: 8 };
  const [mapView, setMapView] = useState<{ center: { x: number; y: number }, zoom: number }>(initialMapView);
  const [search, setSearch] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; description?: string; attractions?: string }>({});
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    axios.get('/api/attractions')
        .then(response => {
        setAttractions(response.data);
        })
        .catch(error => {
        console.error('There was an error fetching the data!', error);
        });
  }, []);
 
  const mapRef = useRef<MapRef>(null);

  const handleGetView = () => {
    if (mapRef.current) {
      const view = mapRef.current.getView();
      const current_view = {
        center: { x: view.center.lat, y: view.center.lng },
        zoom: view.zoom
      }
      setMapView(current_view);
      return current_view;
    }
    else 
      return mapView;
  };
  
  const handleSubmit = () => {
    const newErrors: { name?: string; description?: string; attractions?: string } = {};

    if (selectedAttractions.length === 0) {
      newErrors.attractions = 'Musisz wybrać co najmniej jedną atrakcję';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSelectedAttractions([]);
    setSelectedTypes(possibleTypes);
    setSelectedSubtypes(possibleSubtypes);
    setMapView(initialMapView);
    setErrors({});
    setRefreshKey(prev => prev + 1);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, attraction: Attraction) => {
    event.dataTransfer.setData('attraction', JSON.stringify(attraction.id));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const attractionId = JSON.parse(event.dataTransfer.getData('attraction')) as number;
    setSelectedAttractions((prevSelected) => [...prevSelected, attractionId]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveAttraction = (attractionId: number) => {
    setSelectedAttractions((prevSelected) => prevSelected.filter(attraction => attraction !== attractionId));
  };

  const selectedAttractionsDetails = attractions.filter(attraction => 
    selectedAttractions.includes(attraction.id)
  );

  function handleFilterChange(selectedTypes: possible_type[], selectedSubtypes: subtypes[]) {
    setSelectedTypes(selectedTypes);
    setSelectedSubtypes(selectedSubtypes);
  }

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      setSelectedAttractions(prevSelected => {
        const newArr = [...prevSelected];
        const temp = newArr[index];
        newArr[index] = newArr[index - 1];
        newArr[index - 1] = temp;
        return newArr;
      });
    }
  };
  
  const handleMoveDown = (index: number) => {
    if (index < selectedAttractions.length - 1) {
      setSelectedAttractions(prevSelected => {
        const newArr = [...prevSelected];
        const temp = newArr[index];
        newArr[index] = newArr[index + 1];
        newArr[index + 1] = temp;
        return newArr;
      });
    }
  };
  const calculateTotalDistance = () => {
    let totalDistance = 0;
    for (let i = 1; i < selectedAttractions.length; i++) {
      const attractionA = attractions.find(attr => attr.id === selectedAttractions[i - 1]);
      const attractionB = attractions.find(attr => attr.id === selectedAttractions[i]);
      if (attractionA && attractionB) {
        const distance = calculateDistanceInKm(attractionA.coords, attractionB.coords);
        totalDistance += distance;
      }
    }
    return totalDistance.toFixed(2); // Zaokrąglamy do dwóch miejsc po przecinku
  };
  
  const calculateDistanceInKm = (coordsA : { x: number; y: number }, coordsB : { x: number; y: number }) => {
    const R = 6371; // Średnia ziemska promień w kilometrach
    const lat1 = deg2rad(coordsA.x);
    const lat2 = deg2rad(coordsB.x);
    const lon1 = deg2rad(coordsA.y);
    const lon2 = deg2rad(coordsB.y);
  
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c; // Odległość w kilometrach
    return distance;
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  return (
    <FormContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>Nowe Wyzwanie</Typography>
        </Grid>
        <Grid item xs={6} onDrop={handleDrop} onDragOver={handleDragOver} style={{ minHeight: '400px', border: '1px solid black', marginTop:"1rem" }}>
          <TypographyStyled variant="body1">
              Dostosuj położenie i zoom mapki
          </TypographyStyled>
          <Map 
            key={refreshKey} 
            ref={mapRef} 
            x={initialMapView.center.x} 
            y={initialMapView.center.y} 
            zoom={initialMapView.zoom} 
            attractions={selectedAttractionsDetails}/>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" style={{marginBottom: "5px"}}>
            Atrakcje 
            <br />
            (przeciągnij wybrane na mapkę)
          </Typography>
          <StyledInputBase
            placeholder="Wyszukaj..."
            inputProps={{ 'aria-label': 'search' }}
            onChange={onSearchChange}
            startAdornment={
              <IconButton sx={{ p: 0 }} disabled aria-label="search" >
                <SearchIcon />
              </IconButton>
            }
          />
          <ScrollableBox>
            {attractions.map((attraction, index) => (
              !selectedAttractions.includes(attraction.id) && 
              attraction.name.toLowerCase().includes(search.toLowerCase()) &&
              selectedSubtypes.includes(attraction.subtype) && selectedTypes.includes(attraction.type) && (
              <div 
                key={index} 
                draggable 
                onDragStart={(event) => handleDragStart(event, attraction)} 
                style={{ padding: '8px', border: '1px solid black', marginBottom: '4px', cursor: 'move' }}
              >
                <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: 'black'}}>
                  {attraction.name}
                </a>
              </div>
            )))}
          </ScrollableBox>
        </Grid>
        <Grid item xs={3}>
          <FilterList key={refreshKey} onChange={handleFilterChange}></FilterList>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Wybrane atrakcje (zakres 1 - 100)</Typography>
          <ScrollableBox>
          {selectedAttractions.map((selected, index) => {
  const attraction = attractions.find(attr => attr.id === selected);
  return (
    <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '8px', border: '1px solid black', marginBottom: '4px' }}>
      <IconButton onClick={() => handleMoveUp(index)} disabled={index === 0}>
        <ArrowUpward />
      </IconButton>
      <IconButton onClick={() => handleMoveDown(index)} disabled={index === selectedAttractions.length - 1}>
        <ArrowDownward />
      </IconButton>
      <Typography variant="body1" style={{ flex: 1 }}>
        {attraction && 
        <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: 'black'}}>
          {attraction.name}
        </a>}
      </Typography>
      <Button variant="contained" color="secondary" onClick={() => handleRemoveAttraction(selected)}>Usuń</Button>
    </div>
  );
})}

          </ScrollableBox>
          {!!errors.attractions && (
            <Typography color="error" variant="body2">{errors.attractions}</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Zapisz Wyzwanie</Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
      <Typography variant="h6">Długość trasy: {calculateTotalDistance()} km</Typography>
    </Grid>
    </FormContainer>
  );
};

export default RoutePlanner;
