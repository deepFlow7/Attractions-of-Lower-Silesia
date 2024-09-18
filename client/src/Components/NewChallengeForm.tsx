import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { Box, IconButton, InputBase, Button, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { ChallengeForm, Attraction, ChallengeAttractionInput, PossibleType, 
  Subtypes, possibleSubtypes, possibleTypes } from '../types';
import FilterList from './FilterList';
import api from '../API/api';
import Map, { MapRef } from './Map';
import { ViewContainer } from '../Styles/View';
import { MapContainer, DropListContainer } from '../Styles/Map';
import { ListContainer } from '../Styles/List';
import { FilterContainer } from '../Styles/Filter';
import { InputContainer } from '../Styles/TextField';
import StyledTextField from '../Styles/TextField';
import { Title, Body, bodyMixin } from '../Styles/Typography';
import { StyledButton } from '../Styles/Button';

const FormContainer = styled(ViewContainer)`
  width: 100vw;
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin: 0 0;
    padding: 1rem;
    box-sizing: border-box;
  }
`;

const StyledInputBase = styled(InputBase)`
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  padding: 4px 8px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  ${bodyMixin};

  &:hover {
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  }
`;

const TitleContainer = styled.div`
  min-width: 20rem;
`;

const ScrollableBox = styled(Box)`
  max-height: 40rem;
  overflow-y: auto;
`;

const NewChallengeForm = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedAttractions, setSelectedAttractions] = useState<ChallengeAttractionInput[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<PossibleType[]>(possibleTypes);
  const [selectedSubtypes, setSelectedSubtypes] = useState<Subtypes[]>(possibleSubtypes);
  const initialMapView = { center: { x: 51.1079, y: 17.0385 }, zoom: 8 };
  const [mapView, setMapView] = useState<{ center: { x: number; y: number }, zoom: number }>(initialMapView);
  const [search, setSearch] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; description?: string; attractions?: string }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl;
  const isMobile = useMediaQuery('(max-width:1300px)');

  useEffect(() => {
    api.get('/api/attractions')
      .then(response => {
        setAttractions(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const mapRef = useRef<MapRef>(null);

  const onSubmit = async (newChallenge: ChallengeForm) => {
    await api.post('/api/challenges/new', { newChallenge })
      .then(response => {
      })
      .catch(error => {
        console.error('There was an error sending the data!', error);
      });
  };

  const handleGetView = () => {
    if (mapRef.current) {
      const view = mapRef.current.getView();
      const currentView = {
        center: { x: view.center.lat, y: view.center.lng },
        zoom: view.zoom
      };
      setMapView(currentView);
      return currentView;
    }
    return mapView;
  };

  const handleSubmit = async () => {
    const newErrors: { name?: string; description?: string; attractions?: string } = {};

    if (!name) newErrors.name = 'Nazwa jest wymagana';
    if (!description) newErrors.description = 'Opis jest wymagany';
    if (selectedAttractions.length === 0) newErrors.attractions = 'Musisz wybrać co najmniej jedną atrakcję';

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

    await onSubmit(newChallenge);
    alert('Dodano wyzwanie.');
    navigate(returnUrl || '/');
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, attraction: Attraction) => {
    event.dataTransfer.setData('attraction', JSON.stringify(attraction));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const attraction = JSON.parse(event.dataTransfer.getData('attraction'));
    selectAttraction(attraction);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const selectAttraction = (attraction: Attraction) => {
    const newSelected = { id: attraction.id, points: 10 };
    setSelectedAttractions((prevSelected) => [...prevSelected, newSelected]);
  };

  const handleRemoveAttraction = (attractionId: number) => {
    setSelectedAttractions(prevSelected => prevSelected.filter(attraction => attraction.id !== attractionId));
  };

  const handlePointsChange = (attractionId: number, points: number) => {
    setSelectedAttractions(prevSelected =>
      prevSelected.map(attraction => (attraction.id === attractionId ? { ...attraction, points } : attraction))
    );
  };

  const selectedAttractionsDetails = attractions.filter(attraction =>
    selectedAttractions.some(selected => selected.id === attraction.id)
  );

  const handleFilterChange = (selectedTypes: PossibleType[], selectedSubtypes: Subtypes[]) => {
    setSelectedTypes(selectedTypes);
    setSelectedSubtypes(selectedSubtypes);
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <FormContainer>
      <TitleContainer>
        <Title>Nowe Wyzwanie</Title>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Nazwa"
            value={name}
            onChange={e => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
        </InputContainer>
      </TitleContainer>

      <InputContainer style={{ width: 'calc(100vw - 24rem)' }}>
        <StyledTextField
          fullWidth
          multiline
          rows={4}
          label="Opis"
          value={description}
          onChange={e => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
        />
      </InputContainer>

      <MapContainer four onDrop={handleDrop} onDragOver={handleDragOver}>
        <Map
          ref={mapRef}
          x={initialMapView.center.x}
          y={initialMapView.center.y}
          zoom={initialMapView.zoom}
          attractions={selectedAttractionsDetails}
        />
      </MapContainer>

      <DropListContainer four>
        <Body>
          Atrakcje ({isMobile ? 'zaznacz, aby dodać' : 'przeciągnij wybrane na mapkę'})
        </Body>
        <StyledInputBase
          placeholder="Wyszukaj..."
          inputProps={{ 'aria-label': 'search' }}
          onChange={onSearchChange}
          startAdornment={
            <IconButton sx={{ p: 0 }} disabled aria-label="search">
              <SearchIcon />
            </IconButton>
          }
        />
        <ScrollableBox>
          {attractions.map((attraction, index) => (
            attraction.name.toLowerCase().includes(search.toLowerCase()) &&
            selectedSubtypes.includes(attraction.subtype) && selectedTypes.includes(attraction.type) && 
            !selectedAttractions.some(selected => selected.id === attraction.id) && (
              isMobile ? (
                <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
                  <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: 'black', flexGrow: 1 }}>
                    {attraction.name}
                  </a>
                  <StyledButton
                    variant="contained"
                    big={true}
                    onClick={() => selectAttraction(attraction)}
                  >
                    +
                  </StyledButton>
                </div>
              ) : (
                <div
                key={index}
                draggable
                onDragStart={event => handleDragStart(event, attraction)}
                style={{ padding: '0.5rem', cursor: 'move' }}
              >
                <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: 'black' }}>
                  {attraction.name}
                </a>
              </div>
              )
            )))}
        </ScrollableBox>
      </DropListContainer>

      <FilterContainer four>
        <FilterList onChange={handleFilterChange}></FilterList>
      </FilterContainer>

      <ListContainer four>
        <Body>Wybrane atrakcje z punktami za odwiedzenie (z zakresu 1 - 100)</Body>
        <ScrollableBox style={{ minHeight: '50px' }}>
          {selectedAttractions.map((selected, index) => {
            const attraction = attractions.find(attr => attr.id === selected.id);
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
                <Body>
                  {attraction && (
                    <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: 'black' }}>
                      {attraction.name}
                    </a>
                  )}
                </Body>
                <StyledTextField
                  type="number"
                  label="Punkty"
                  inputProps={{ min: 1, max: 100 }}
                  value={selected.points}
                  onChange={e => handlePointsChange(selected.id, parseInt(e.target.value))}
                  style={{ width: '100px', marginRight: '8px' }}
                  onBlur={e => {
                    const value = parseInt(e.target.value);
                    if (value < 1) {
                      handlePointsChange(selected.id, 1);
                    } else if (value > 100) {
                      handlePointsChange(selected.id, 100);
                    }
                  }}
                />
                <StyledButton onClick={() => handleRemoveAttraction(selected.id)}>Usuń</StyledButton>
              </div>
            );
          })}
        </ScrollableBox>
        {!!errors.attractions && <Body error>{errors.attractions}</Body>}
        <StyledButton onClick={handleSubmit}>Zapisz Wyzwanie</StyledButton>
      </ListContainer>
    </FormContainer>
  );
};

export default NewChallengeForm;
