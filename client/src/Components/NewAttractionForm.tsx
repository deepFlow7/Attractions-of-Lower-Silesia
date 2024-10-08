import styled from '@emotion/styled';
import { CircularProgress, Grid, MenuItem, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';
import { useColors } from '../Providers/Colors';
import { StyledButton } from '../Styles/Button';
import { ChallengesContainer } from '../Styles/List';
import StyledTextField from '../Styles/TextField';
import { Title } from '../Styles/Typography';
import { ViewContainer } from '../Styles/View';
import { NewAttraction, NewPhoto, PossibleType, Subtypes, possibleSubtypes, possibleTypes } from '../types';
import Map, { MapRef } from './Map';

const MapContainer = styled.div`
  height: 40vh;
  overflow: hidden;
`;

const NewAttractionForm = () => {
  const [attractionName, setAttractionName] = useState<string>('');
  const [attractionType, setAttractionType] = useState<PossibleType | null>(null);
  const [attractionSubtype, setAttractionSubtype] = useState<Subtypes | null>(null);
  const [attractionDescription, setAttractionDescription] = useState<string>('');
  const [attractionInteractivity, setAttractionInteractivity] = useState<number>(5);
  const [attractionTime, setAttractionTime] = useState<number>(30);
  const [attractionCoords, setAttractionCoords] = useState<{ x: number; y: number } | null>(null);
  const [attractionPhotos, setAttractionPhotos] = useState<NewPhoto[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLocalizationLoading, setIsLocalizationLoading] = useState<boolean>(false);
  const mapRef = useRef<MapRef>(null);
  const { isBlocked } = useAuth();
  const { colors } = useColors();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl;

  const handleAddPhoto = () => {
    const newPhotoUrl = photoUrls[attractionPhotos.length] || '';
    if (!newPhotoUrl.trim()) {
      setFormErrors({ ...formErrors, photoUrl: 'Nie podano linku do zdjęcia' });
      return;
    }
    setFormErrors({ ...formErrors, photoUrl: '' });
    const newPhotos = [...attractionPhotos];
    newPhotos.push({ photo: newPhotoUrl, caption: photoCaptions[attractionPhotos.length] });
    setAttractionPhotos(newPhotos);
    setPhotoUrls([...photoUrls, '']);
    setPhotoCaptions([...photoCaptions, '']);
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = attractionPhotos.filter((_, i) => i !== index);
    setAttractionPhotos(newPhotos);
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
    setPhotoCaptions(photoCaptions.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!attractionName) newErrors.name = 'Nazwa jest wymagana';
    if (!attractionDescription) newErrors.description = 'Opis jest wymagany';
    if (!attractionType) newErrors.type = 'Typ jest wymagany';
    if (!attractionSubtype) newErrors.subtype = 'Podtyp jest wymagany';

    if (!Number.isInteger(attractionInteractivity) || attractionInteractivity < 1 || attractionInteractivity > 10) {
      newErrors.interactivity = 'Interaktywność musi być liczbą całkowitą od 1 do 10';
    }
    if (!Number.isInteger(attractionTime) || attractionTime <= 0) {
      newErrors.timeItTakes = 'Czas zwiedzania musi być liczbą całkowitą większą niż 0';
    }
    if (!attractionCoords)
      newErrors.coords = 'Lokalizacja atrakcji jest wymagana';

    const newPhotoUrl = photoUrls[attractionPhotos.length] || '';
    const newPhotoCaption = photoCaptions[attractionPhotos.length] || '';
    if (!newPhotoUrl.trim() && newPhotoCaption.trim()) {
      newErrors.photoUrl = 'Nie podano linku do zdjęcia';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitNewAttraction = async (newAttraction: NewAttraction) => {
    return await api.post('/api/attractions/new', { newAttraction })
      .then(response => { return response.data })
      .catch(error => {
        console.error('There was an error sending the data!', error);
      });
  };

  const handleSubmit = async () => {
    if (isBlocked) {
      alert("Twoje konto jest zablokowane, nie możesz dodawać atrakcji.");
      return;
    }

    if (!validateForm() || attractionCoords == null || attractionType == null || attractionSubtype == null)
      return;

    const newAttraction: NewAttraction = {
      name: attractionName,
      coords: attractionCoords,
      type: attractionType,
      subtype: attractionSubtype,
      interactivity: attractionInteractivity,
      timeItTakes: attractionTime,
      description: attractionDescription,
      photos: attractionPhotos,
    };
    try {
      let result = await submitNewAttraction(newAttraction)
      if (!result.success) {
        throw "Błąd podczas dodawania atrakcji: " + result.error;
      }

      alert("Dodano atrakcję.");
      if (returnUrl)
        navigate(returnUrl);
      else
        navigate('/');
    }
    catch (error) {
      alert("Błąd dodawania atrakcji:" + error);
    }
  };

  const handleUseMyLocation = () => {
    setIsLocalizationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newCoords = { x: position.coords.latitude, y: position.coords.longitude };
        const accuracy = position.coords.accuracy;

        setIsLocalizationLoading(false);

        if (accuracy > 100) {
          alert("Nie możemy pobrać twojej dokładnej lokalizacji.");
          return;
        }

        setAttractionCoords(newCoords);
        mapRef.current?.setUserLocation(newCoords);
      }, (error) => {
        setIsLocalizationLoading(false);
        console.error('Błąd podczas pobierania geolokacji', error);
      });
    } else {
      setIsLocalizationLoading(false);
      alert("Lokalizacja jest wyłączona lub nieobsługiwana przez tę przeglądarkę.");
      console.log("Nie udało się pobrać lokalizacji.");
    }
  };

  return (
    <ViewContainer colors={colors}>
      <ChallengesContainer>
        <Title colors={colors}>Nowa Atrakcja</Title>

        <StyledTextField colors={colors}
          fullWidth
          label="Nazwa"
          value={attractionName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttractionName(e.target.value)}
          error={!!formErrors.name}
          helperText={formErrors.name}
        />

        <StyledTextField colors={colors}
          select
          fullWidth
          label="Typ"
          value={attractionType || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttractionType(e.target.value as PossibleType)}>
          {possibleTypes.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </StyledTextField>
        {formErrors.type && <Typography variant="body2" color="error">{formErrors.type}</Typography>}

        <StyledTextField colors={colors}
          select
          fullWidth
          label="Podtyp"
          value={attractionSubtype || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttractionSubtype(e.target.value as Subtypes)}>
          {possibleSubtypes.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </StyledTextField>
        {formErrors.subtype && <Typography variant="body2" color="error">{formErrors.subtype}</Typography>}

        <StyledTextField colors={colors}
          fullWidth
          multiline
          rows={4}
          label="Opis"
          value={attractionDescription}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAttractionDescription(e.target.value)}
          error={!!formErrors.description}
          helperText={formErrors.description}
        />

        <StyledTextField colors={colors}
          type="number"
          fullWidth
          label="Interaktywność (1-10)"
          value={attractionInteractivity}
          inputProps={{ min: 1, max: 10 }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttractionInteractivity(parseInt(e.target.value))}
          error={!!formErrors.interactivity}
          helperText={formErrors.interactivity}
        />

        <StyledTextField colors={colors}
          type="number"
          fullWidth
          label="Czas zwiedzania (minuty)"
          value={attractionTime}
          inputProps={{ min: 1 }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttractionTime(parseInt(e.target.value))}
          error={!!formErrors.timeItTakes}
          helperText={formErrors.timeItTakes}
        />

        <Title colors={colors}>Wybierz lokalizację</Title>
        <StyledButton colors={colors} onClick={handleUseMyLocation} color="primary">
          {isLocalizationLoading ? (
            <> Pobieram lokalizację <CircularProgress size={20} /> </>
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
            onMapClick={(newCoords) => setAttractionCoords(newCoords)}
          />
        </MapContainer>
        {formErrors.coords && <Typography variant="body2" color="error" margin={'3px'}>{formErrors.coords}</Typography>}

        <Title colors={colors}>Zdjęcia</Title>
        <Grid container spacing={2}>
          {attractionPhotos.map((photo, index) => (
            <Grid item key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src={photo.photo} alt={`Photo ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="caption" style={{ marginTop: '8px', padding: '0 4px' }}>
                {photo.caption}
              </Typography>
              <StyledButton colors={colors} onClick={() => handleRemovePhoto(index)} style={{ marginTop: '8px' }}>
                Usuń
              </StyledButton>
            </Grid>
          ))}
          <Grid item>
            <StyledTextField colors={colors}
              fullWidth
              label="URL Zdjęcia"
              value={photoUrls[attractionPhotos.length] || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhotoUrls([...photoUrls.slice(0, attractionPhotos.length), e.target.value])}
              error={!!formErrors.photoUrl}
              helperText={formErrors.photoUrl}
            />
            <StyledTextField colors={colors}
              fullWidth
              label="Podpis Zdjęcia"
              value={photoCaptions[attractionPhotos.length] || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhotoCaptions([...photoCaptions.slice(0, attractionPhotos.length), e.target.value])}
            />
            <StyledButton colors={colors} onClick={handleAddPhoto}>Dodaj Zdjęcie</StyledButton>
          </Grid>
        </Grid>
        <StyledButton colors={colors} onClick={handleSubmit}>Zapisz Atrakcję</StyledButton>
      </ChallengesContainer>
    </ViewContainer>
  );
};

export default NewAttractionForm;
