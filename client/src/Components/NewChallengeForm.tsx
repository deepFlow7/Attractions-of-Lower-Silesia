import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Button, InputBase } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { ChallengeForm, Attraction, challengeAttractionInput, possible_type, subtypes, possibleSubtypes, possibleTypes } from '../types';
import FilterList from './FilterList';
import styled from '@emotion/styled';
import axios from 'axios';
import Map, { MapRef } from './Map';

const FormContainer = styled.div`
  max-width: 1200px;
  margin: 4% auto; 
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ScrollableBox = styled(Box)`
  max-height: 700px;
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

const NewChallengeForm = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedAttractions, setSelectedAttractions] = useState<challengeAttractionInput[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<possible_type[]>(possibleTypes);
  const [selectedSubtypes, setSelectedSubtypes] = useState<subtypes[]>(possibleSubtypes);
  const initialMapView = {center: {x: 51.1079, y: 17.0385}, zoom: 8};
  const [mapView, setMapView] = useState<{ center: { x: number; y: number }, zoom: number }>(
    initialMapView);
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

  const onSubmit = (newChallenge : ChallengeForm) => {
    axios.post('/api/new_challenge', {newChallenge})
          .then(response => {
          })
          .catch(error => {
          console.error('There was an error sending the data!', error);
          });
  }

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

    if (!name) {
      newErrors.name = 'Nazwa jest wymagana';
    }

    if (!description) {
      newErrors.description = 'Opis jest wymagany';
    }

    if (selectedAttractions.length === 0) {
      newErrors.attractions = 'Musisz wybrać co najmniej jedną atrakcję';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const view = handleGetView();

    const newChallenge: ChallengeForm = {
      name,
      description,
      coords: view.center,
      zoom: view.zoom,
      attractions: selectedAttractions
    };

    onSubmit(newChallenge);
    setName('');
    setDescription('');
    setSelectedAttractions([]);
    setSelectedTypes(possibleTypes);
    setSelectedSubtypes(possibleSubtypes);
    setMapView(initialMapView);
    setErrors({});
    setRefreshKey(prev => prev + 1);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, attraction: Attraction) => {
    event.dataTransfer.setData('attraction', JSON.stringify(attraction));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const attraction = JSON.parse(event.dataTransfer.getData('attraction'));
    const newSelected = {id: attraction.id, points: 10};
    setSelectedAttractions((prevSelected) => [...prevSelected, newSelected]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveAttraction = (attractionId: number) => {
    setSelectedAttractions((prevSelected) => prevSelected.filter(attraction => attraction.id !== attractionId));
  };

  const handlePointsChange = (attractionId: number, points: number) => {
    setSelectedAttractions((prevSelected) =>
      prevSelected.map(attraction =>
        attraction.id === attractionId ? { ...attraction, points } : attraction
      )
    );
  };

  const selectedAttractionsDetails = attractions.filter(attraction => 
    selectedAttractions.some(selected => selected.id === attraction.id)
  );

  function handleFilterChange(selectedTypes: possible_type[], selectedSubtypes: subtypes[]) {
    setSelectedTypes(selectedTypes);
    setSelectedSubtypes(selectedSubtypes);
  }

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  return (
    <FormContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>Nowe Wyzwanie</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth 
            label="Nazwa" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth 
            multiline 
            rows={4} 
            label="Opis" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            error={!!errors.description}
            helperText={errors.description}
          />
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
          <ScrollableBox style={{minHeight: '50px'}}>
            {attractions.map((attraction, index) => (
              !selectedAttractions.some(selected => selected.id === attraction.id) && 
              attraction.name.toLowerCase().includes(search.toLowerCase()) &&
              selectedSubtypes.includes(attraction.subtype) && selectedTypes.includes(attraction.type) && (
              <div key={index} draggable onDragStart={(event) => handleDragStart(event, attraction)} style={{ padding: '8px', border: '1px solid black', marginBottom: '4px' }}>
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
          <Typography variant="h6">Wybrane atrakcje z punktami za odwiedzenie (z zakresu 1 - 100)</Typography>
          <ScrollableBox style={{minHeight: '50px'}}>
            {selectedAttractions.map((selected, index) => {
              const attraction = attractions.find(attr => attr.id == selected.id);
              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '8px', border: '1px solid black', marginBottom: '4px' }}>
                  <Typography variant="body1" style={{ flex: 1 }}>
                    {attraction && 
                    <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: 'black'}}>
                      {attraction.name}
                    </a>}
                  </Typography>
                  <TextField
                    type="number"
                    label="Punkty"
                    inputProps={{ min: 1, max: 100 }}
                    value={selected.points}
                    onChange={(e) => handlePointsChange(selected.id, parseInt(e.target.value))}
                    style={{ width: '100px', marginRight: '8px' }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value);
                      if (value < 1) {
                        handlePointsChange(selected.id, 1);
                      } else if (value > 100) {
                        handlePointsChange(selected.id, 100);
                      }
                    }}
                  />
                  <Button variant="contained" color="secondary" onClick={() => handleRemoveAttraction(selected.id)}>Usuń</Button>
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
    </FormContainer>
  );
};

export default NewChallengeForm;
