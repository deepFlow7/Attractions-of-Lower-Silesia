import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import { NewAttraction, NewPhoto, possible_type, subtypes, possibleTypes, possibleSubtypes } from '../types';
import styled from '@emotion/styled';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 4% auto; 
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

interface NewAttractionFormProps {
  onSubmit: (attraction: NewAttraction) => Promise<any>;
}

const NewAttractionForm: React.FC<NewAttractionFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<possible_type>(possibleTypes[0]);
  const [subtype, setSubtype] = useState<subtypes>(possibleSubtypes[0]);
  const [description, setDescription] = useState<string>('');
  const [interactivity, setInteractivity] = useState<number>(5);
  const [timeItTakes, setTimeItTakes] = useState<number>(30);
  const [photos, setPhotos] = useState<NewPhoto[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddPhoto = () => {
    const newPhotos = [...photos];
    newPhotos.push({ photo: photoUrls[photos.length], caption: photoCaptions[photos.length] });
    setPhotos(newPhotos);
    setPhotoUrls([...photoUrls, '']);
    setPhotoCaptions([...photoCaptions, '']);
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
    setPhotoCaptions(photoCaptions.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Nazwa jest wymagana';
    if (!description) newErrors.description = 'Opis jest wymagany';
    if (!Number.isInteger(interactivity) || interactivity < 1 || interactivity > 10) {
      newErrors.interactivity = 'Interaktywność musi być liczbą całkowitą od 1 do 10';
    }
    if (!Number.isInteger(timeItTakes) || timeItTakes <= 0) {
      newErrors.timeItTakes = 'Czas zwiedzania musi być liczbą całkowitą większą niż 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const newAttraction: NewAttraction = {
      name,
      coords: { x: 0.0, y: 0.0 }, // todo: wybór punktu na mapie
      type,
      subtype,
      interactivity,
      time_it_takes: timeItTakes,
      description,
      photos
    };
    await onSubmit(newAttraction);
    setName('');
    setType(possibleTypes[0]);
    setSubtype(possibleSubtypes[0]);
    setDescription('');
    setInteractivity(5);
    setTimeItTakes(30);
    setPhotos([]);
    setPhotoUrls([]);
    setPhotoCaptions([]);
    setErrors({});
  };

  return (
    <FormContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>Nowa Atrakcja</Typography>
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
            select 
            fullWidth 
            label="Typ" 
            value={type} 
            onChange={(e) => setType(e.target.value as possible_type)}>
            {possibleTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField 
            select 
            fullWidth 
            label="Podtyp" 
            value={subtype} 
            onChange={(e) => setSubtype(e.target.value as subtypes)}>
            {possibleSubtypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
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
          <TextField 
            type="number" 
            fullWidth 
            label="Interaktywność (1-10)" 
            value={interactivity} 
            inputProps={{ min: 1, max: 10 }}
            onChange={(e) => setInteractivity(parseInt(e.target.value))} 
            error={!!errors.interactivity}
            helperText={errors.interactivity}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            type="number" 
            fullWidth 
            label="Czas zwiedzania (minuty)" 
            value={timeItTakes} 
            inputProps={{ min: 1 }}
            onChange={(e) => setTimeItTakes(parseInt(e.target.value))} 
            error={!!errors.timeItTakes}
            helperText={errors.timeItTakes}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>Zdjęcia</Typography>
          <Grid container spacing={2}>
            {photos.map((photo, index) => (
              <Grid item key={index}>
                <img src={photo.photo} alt={`Photo ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
                <Typography variant="caption">{photo.caption}</Typography>
                <Button variant="outlined" onClick={() => handleRemovePhoto(index)}>Usuń</Button>
              </Grid>
            ))}
            <Grid item>
              <TextField 
                fullWidth 
                label="URL Zdjęcia" 
                value={photoUrls[photos.length] || ''} 
                onChange={(e) => setPhotoUrls([...photoUrls.slice(0, photos.length), e.target.value])} 
              />
              <Box mt={2}/>
              <TextField 
                fullWidth 
                label="Podpis Zdjęcia" 
                value={photoCaptions[photos.length] || ''} 
                onChange={(e) => setPhotoCaptions([...photoCaptions.slice(0, photos.length), e.target.value])} 
              />
              <Box mt={2}/>
              <Button variant="contained" onClick={handleAddPhoto}>Dodaj Zdjęcie</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Zapisz Atrakcję</Button>
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default NewAttractionForm;
