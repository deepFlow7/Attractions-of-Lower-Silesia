import React, { useState, useRef } from 'react';
import { Grid, Typography, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { NewAttraction, NewPhoto, possible_type, subtypes, possibleTypes, possibleSubtypes } from '../types';
import styled from '@emotion/styled';
import Map, { MapRef } from './Map';
import api from '../API/api';
import { ChallengesContainer } from '../Styles/List';
import { ViewContainer } from '../Styles/View';
import { Title } from '../Styles/Typography';
import StyledTextField from '../Styles/TextField';
import { StyledButton } from '../Styles/Button';
import { useAuth } from '../Providers/AuthContext';

const MapContainer = styled.div`
  height: 40vh;
  overflow: hidden;
`

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
  const mapRef = useRef<MapRef>(null);
  const {isBlocked} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl;

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
    api.post('/api/new_attraction', { newAttraction })
      .then(response => {
        console.log('Dodano');
      })
      .catch(error => {
        console.error('There was an error sending the data!', error);
      });
  };

  const handleSubmit = async () => {
    if (isBlocked) {
      alert("Twoje konto jest zablokowane, nie możesz dodawać atrakcji.")
      return;
    }

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

    alert("Dodano atrakcję.");
    if(returnUrl)
      navigate(returnUrl);
    else
      navigate('/');
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
      });
    } else {
      setLoadingLocalization(false);
      alert("Lokalizacja jest wyłączona lub nieobsługiwana przez tę przeglądarkę.");
      console.log("Nie udało się pobrać lokalizacji.");
    }
  };

  return (
    <ViewContainer>
      <ChallengesContainer>
        <Title>Nowa Atrakcja</Title>

        <StyledTextField 
          fullWidth 
          label="Nazwa" 
          value={name} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
          error={!!errors.name}
          helperText={errors.name}
        />

        <StyledTextField 
          select 
          fullWidth 
          label="Typ" 
          value={type || ''} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType(e.target.value as possible_type)}>
          {possibleTypes.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </StyledTextField>
        {errors.type && <Typography variant="body2" color="error">{errors.type}</Typography>}

        <StyledTextField 
          select 
          fullWidth 
          label="Podtyp" 
          value={subtype || ''} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubtype(e.target.value as subtypes)}>
          {possibleSubtypes.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </StyledTextField>
        {errors.subtype && <Typography variant="body2" color="error">{errors.subtype}</Typography>}

        <StyledTextField 
          fullWidth 
          multiline 
          rows={4} 
          label="Opis" 
          value={description} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} 
          error={!!errors.description}
          helperText={errors.description}
        />

        <StyledTextField 
          type="number" 
          fullWidth 
          label="Interaktywność (1-10)" 
          value={interactivity} 
          inputProps={{ min: 1, max: 10 }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInteractivity(parseInt(e.target.value))} 
          error={!!errors.interactivity}
          helperText={errors.interactivity}
        />

        <StyledTextField 
          type="number" 
          fullWidth 
          label="Czas zwiedzania (minuty)" 
          value={timeItTakes} 
          inputProps={{ min: 1 }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimeItTakes(parseInt(e.target.value))} 
          error={!!errors.timeItTakes}
          helperText={errors.timeItTakes}
        />

        <Title>Wybierz lokalizację</Title>
        <StyledButton onClick={handleUseMyLocation} color="primary">
          {loadingLocalization ? (
            <> Pobieram lokalizację <CircularProgress size={20}/> </>
          ) : (
            <> Użyj mojej lokalizacji </>
          )}
        </StyledButton>
      </ChallengesContainer>
      <ChallengesContainer>
            <MapContainer>
        <Map
          ref={mapRef}
          x={51.1079} 
          y={17.0385} 
          zoom={8} 
          attractions={[]} 
          onMapClick={(newCoords) => setCoords(newCoords)}
        /></MapContainer>
        {errors.coords && <Typography variant="body2" color="error" margin={'3px'}>{errors.coords}</Typography>}

        <Title>Zdjęcia</Title>
        <Grid container spacing={2}>
          {photos.map((photo, index) => (
            <Grid item key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src={photo.photo} alt={`Photo ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="caption" style={{ marginTop: '8px', padding: '0 4px' }}>
                {photo.caption}
              </Typography>
              <StyledButton onClick={() => handleRemovePhoto(index)} style={{ marginTop: '8px' }}>
                Usuń
              </StyledButton>
            </Grid>
          ))}
          <Grid item>
            <StyledTextField 
              fullWidth 
              label="URL Zdjęcia" 
              value={photoUrls[photos.length] || ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhotoUrls([...photoUrls.slice(0, photos.length), e.target.value])} 
              error={!!errors.photoUrl}
              helperText={errors.photoUrl}
            />
            <StyledTextField 
              fullWidth 
              label="Podpis Zdjęcia" 
              value={photoCaptions[photos.length] || ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhotoCaptions([...photoCaptions.slice(0, photos.length), e.target.value])} 
            />
            <StyledButton onClick={handleAddPhoto}>Dodaj Zdjęcie</StyledButton>
          </Grid>
        </Grid>
        <StyledButton  onClick={handleSubmit}>Zapisz Atrakcję</StyledButton>
      </ChallengesContainer>

    </ViewContainer>
  );
};

export default NewAttractionForm;
