import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import { ChallengeForm, Attraction } from '../types';
import styled from '@emotion/styled';
import Filter from './Filter';

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
  const [points, setPoints] = useState<number>(0);
  const [attractions, setAttractions] = useState<string[]>([]);

  const handleSubmit = () => {
    const newChallenge: ChallengeForm = {
      name,
      description,
      points,
      attractions
    };
    onSubmit(newChallenge);
    setName('');
    setDescription('');
    setPoints(0);
    setAttractions([]);
  };

  const handleFilterChange = (selectedOptions: string[]) => {
    setAttractions(selectedOptions);
  };

  const filterOptions = ["ladne", "nieladne", "a"];

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
          <TextField type="number" fullWidth label="Punkty" value={points} onChange={(e) => setPoints(parseInt(e.target.value))} />
        </Grid>
        <Grid item xs={12}>
          <Filter
            options={filterOptions}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Zapisz Wyzwanie</Button>
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default NewChallengeForm;
