import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { ChallengeForm, Attraction, challengeAttractionInput } from '../types';
import styled from '@emotion/styled';
import axios from 'axios';
import Map, { MapRef } from './Map';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.div`
  max-width: 1200px;
  margin: 4% auto; 
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ScrollableBox = styled(Box)`
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc; 
  padding: 8px; 
`;

const TypographyStyled = styled(Typography)`
  font-size: 1.2rem; 
  font-weight: bold; 
`;

const NewChallengeForm = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedAttractions, setSelectedAttractions] = useState<challengeAttractionInput[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [mapView, setMapView] = useState<{ center: { x: number; y: number }, zoom: number }>(
    {center: {x: 51.1079, y: 17.0385}, zoom: 12});
  const [errors, setErrors] = useState<{ name?: string; description?: string; attractions?: string }>({});
  
  const {isAuthenticated, role} = useAuth();
  const navigate = useNavigate();

  if(!isAuthenticated || role != 'admin')
    navigate('/');

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
            console.log('Dodano');
          })
          .catch(error => {
          console.error('There was an error sending the data!', error);
          });
  }

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

    handleGetView();
    const newChallenge: ChallengeForm = {
      name,
      description,
      coords: mapView.center,
      zoom: mapView.zoom,
      attractions: selectedAttractions
    };
    onSubmit(newChallenge);
    setName('');
    setDescription('');
    setSelectedAttractions([]);
    setMapView({center: {x: 51.1079, y: 17.0385}, zoom: 12});
    setErrors({});
  };

  const handleGetView = () => {
    if (mapRef.current) {
      const view = mapRef.current.getView();
      setMapView({
        center: { x: view.center.lat, y: view.center.lng },
        zoom: view.zoom
      });
    }
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
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleGetView}>Get Map View</Button>
          {mapView && (
            <Typography variant="body1">
              Center: ({mapView.center.x.toFixed(4)}, {mapView.center.y.toFixed(4)}), Zoom: {mapView.zoom}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6} onDrop={handleDrop} onDragOver={handleDragOver} style={{ minHeight: '400px', border: '1px solid black' }}>
          <TypographyStyled variant="body1">
              Dostosuj położenie i zoom mapki
          </TypographyStyled>
          <Map ref={mapRef} x={51.1079} y={17.0385} zoom={12} attractions={selectedAttractionsDetails}/>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Atrakcje (przeciągnij wybrane na mapkę)</Typography>
          <ScrollableBox style={{minHeight: '50px'}}>
            {attractions.map((attraction, index) => (
              !selectedAttractions.some(selected => selected.id === attraction.id) && (
              <div key={index} draggable onDragStart={(event) => handleDragStart(event, attraction)} style={{ padding: '8px', border: '1px solid black', marginBottom: '4px' }}>
                <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: 'black'}}>
                  {attraction.name}
                </a>
              </div>
            )))}
          </ScrollableBox>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Wybrane Atrakcje</Typography>
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
