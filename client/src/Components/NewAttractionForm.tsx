import React, { useState, useRef } from 'react';
import { Box, Grid, Typography, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { NewAttraction, NewPhoto, possible_type, subtypes, possibleTypes, possibleSubtypes } from '../types';
import styled from '@emotion/styled';
import Map, {MapRef} from './Map';
import api from '../API/api';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 4% auto; 
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const NewAttractionForm = () => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<possible_type | null>(null);
  const [subtype, setSubtype] = useState<subtypes | null>(null);
  const [description, setDescription] = useState<string>('');
  const [interactivity, setInteractivity] = useState<number>(5);
  const [timeItTakes, setTimeItTakes] = useState<number>(30);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [photos, setPhotos] = useState<NewPhoto[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loadingLocalization, setLoadingLocalization] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<number>(0);
  const mapRef = useRef<MapRef>(null);

  const handleAddPhoto = () => {
    const newPhotoUrl = photoUrls[photos.length] || '';
    if (!newPhotoUrl.trim()) {
      setErrors({ ...errors, photoUrl: 'Nie podano linku do zdjęcia' });
      return;
    }
    setErrors({ ...errors, photoUrl: '' });
    const newPhotos = [...photos];
    newPhotos.push({ photo: newPhotoUrl, caption: photoCaptions[photos.length] });
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
    if (!type) newErrors.type = 'Typ jest wymagany';
    if (!subtype) newErrors.subtype = 'Podtyp jest wymagany';

    if (!Number.isInteger(interactivity) || interactivity < 1 || interactivity > 10) {
      newErrors.interactivity = 'Interaktywność musi być liczbą całkowitą od 1 do 10';
    }
    if (!Number.isInteger(timeItTakes) || timeItTakes <= 0) {
      newErrors.timeItTakes = 'Czas zwiedzania musi być liczbą całkowitą większą niż 0';
    }
    if (!coords)
      newErrors.coords = 'Lokalizacja atrakcji jest wymagana';

    const newPhotoUrl = photoUrls[photos.length] || '';
    const newPhotoCaption = photoCaptions[photos.length] || '';
    if (!newPhotoUrl.trim() && newPhotoCaption.trim()) {
      newErrors.photoUrl ='Nie podano linku do zdjęcia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (newAttraction : NewAttraction) => {
    api.post('/api/new_attraction', {newAttraction})
          .then(response => {
            console.log('Dodano');
          })
          .catch(error => {
          console.error('There was an error sending the data!', error);
          });
  }

  const handleSubmit = async () => {
    if (!validate() || coords == null || type == null || subtype == null) 
      return;

    const newAttraction: NewAttraction = {
      name,
      coords,
      type,
      subtype,
      interactivity,
      time_it_takes: timeItTakes,
      description,
      photos
    };

    await onSubmit(newAttraction);

    setName('');
    setType(null);
    setSubtype(null);
    setDescription('');
    setInteractivity(5);
    setTimeItTakes(30);
    setPhotos([]);
    setPhotoUrls([]);
    setPhotoCaptions([]);
    setCoords(null);
    setMapKey(prevKey => prevKey + 1);
    setErrors({});
  };

  const handleUseMyLocation = () => {
    setLoadingLocalization(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newCoords = { x: position.coords.latitude, y: position.coords.longitude };
        const accuracy = position.coords.accuracy;

        setLoadingLocalization(false);

        if (accuracy > 100) {
          alert("Nie możemy pobrać twojej dokładnej lokalizacji.");
          return;
        }

        setCoords(newCoords);
        mapRef.current?.setUserLocation(newCoords);
      }, (error) => {
        setLoadingLocalization(false);
        console.error('Błąd podczas pobierania geolokacji', error);
      }
    );
    } else {
      setLoadingLocalization(false);
      alert("Lokalizacja jest wyłączona lub nieobsługiwana przez tę przeglądarkę.");
      console.log("Nie udało się pobrać lokalizacji.");
    }
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
            value={type || ''} 
            onChange={(e) => setType(e.target.value as possible_type)}>
            {possibleTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
          {errors.type && <Typography variant="body2" color="error">{errors.type}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <TextField 
            select 
            fullWidth 
            label="Podtyp" 
            value={subtype || ''} 
            onChange={(e) => setSubtype(e.target.value as subtypes)}>
            {possibleSubtypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
          {errors.subtype && <Typography variant="body2" color="error">{errors.subtype}</Typography>}
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
          <Typography variant="h5" gutterBottom>Wybierz lokalizację</Typography>
          <Button variant="contained" onClick={handleUseMyLocation} color="primary">
            {loadingLocalization? (
                <> Pobieram lokalizację <CircularProgress size={20}/> </>
              ) : (
                <> Użyj mojej lokalizacji </>
              )}
          </Button>
          <Map 
            key={mapKey} 
            ref={mapRef}
            x={51.1079} 
            y={17.0385} 
            zoom={8} 
            attractions={[]} 
            onMapClick={(newCoords) => setCoords(newCoords)}
          />
          {errors.coords && <Typography variant="body2" color="error" margin={'3px'}>{errors.coords}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>Zdjęcia</Typography>
          <Grid container spacing={2}>
            {photos.map((photo, index) => (
              <Grid item key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src={photo.photo} alt={`Photo ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="caption" style={{ marginTop: '8px', padding: '0 4px' }}>
                {photo.caption}
              </Typography>
              <Button variant="outlined" onClick={() => handleRemovePhoto(index)} style={{ marginTop: '8px' }}>
                Usuń
              </Button>
            </Grid>
            ))}
            <Grid item>
              <TextField 
                fullWidth 
                label="URL Zdjęcia" 
                value={photoUrls[photos.length] || ''} 
                onChange={(e) => setPhotoUrls([...photoUrls.slice(0, photos.length), e.target.value])} 
                error={!!errors.photoUrl}
                helperText={errors.photoUrl}
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
