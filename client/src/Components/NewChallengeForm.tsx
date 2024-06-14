import React, { useState, useRef } from 'react';
import { Box, Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import { ChallengeForm, Attraction } from '../types';
import styled from '@emotion/styled';
import Filter from './Filter';
import Map, { MapRef } from './Map';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 4% auto; 
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

interface NewChallengeFormProps {
  onSubmit: (challenge: ChallengeForm) => void;
}

const NewChallengeForm: React.FC<NewChallengeFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedAttractions, setSelectedAttractions] = useState<{ id: string, points: number }[]>([]);
  const [attractions, setAttractions] = useState<string[]>([]);
  const [mapView, setMapView] = useState<{ center: { x: number; y: number }, zoom: number }>(
    {center: {x: 51.1079, y: 17.0385}, zoom: 12});

  const mapRef = useRef<MapRef>(null);

  const handleSubmit = () => {
    handleGetView();
    const newChallenge: ChallengeForm = {
      name,
      description,
      coords: mapView.center,
      zoom: mapView.zoom,
      attractions: [] //attractions
    };
    onSubmit(newChallenge);
    setName('');
    setDescription('');
    setAttractions([]);
  };

  const handleFilterChange = (selectedOptions: string[]) => {
    setAttractions(selectedOptions);
  };

  const filterOptions = ["ladne", "nieladne", "a"];

  const handleGetView = () => {
    if (mapRef.current) {
      const view = mapRef.current.getView();
      setMapView({
        center: { x: view.center.lat, y: view.center.lng },
        zoom: view.zoom
      });
    }
  };

  return (
    <FormContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>Nowe Wyzwanie</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Nazwa" value={name} onChange={(e) => setName(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={4} label="Opis" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Filter
            options={filterOptions}
            onChange={handleFilterChange}
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
        <Grid item xs={12}>
          <Map ref={mapRef} x={51.1079} y={17.0385} zoom={12} attractions={[]} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Zapisz Wyzwanie</Button>
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default NewChallengeForm;
