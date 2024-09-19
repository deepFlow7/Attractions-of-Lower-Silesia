import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, IconButton, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

import api from '../API/api';
import { Attraction, PossibleType, Subtypes, possibleSubtypes, possibleTypes } from '../types';
import Map, { MapRef } from './Map';
import FilterList from './FilterList';
import { ViewContainer } from '../Styles/View';
import { MapContainer, DropListContainer } from '../Styles/Map';
import { ListContainer } from '../Styles/List';
import { FilterContainer } from '../Styles/Filter';
import { Input } from '../Styles/Input';
import { Body, Title } from '../Styles/Typography';
import { StyledButton } from '../Styles/Button';
import { colors } from '../Styles/Themes';

const ScrollableBox = styled.div`
  overflow-y: auto;
`;

const RoutePlanner: React.FC = () => {
  const [selectedAttractions, setSelectedAttractions] = useState<number[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<PossibleType[]>(possibleTypes);
  const [selectedSubtypes, setSelectedSubtypes] = useState<Subtypes[]>(possibleSubtypes);
  const [search, setSearch] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  const mapRef = useRef<MapRef>(null);
  const isMobile = useMediaQuery('(max-width:1300px)');

  useEffect(() => {
    api.get('/api/attractions')
      .then(response => setAttractions(response.data))
      .catch(error => console.error('There was an error fetching the data!', error));
  }, []);

  const reset = () => {
    setSelectedAttractions([]);
    setRefreshKey(prev => prev + 1);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, attraction: Attraction) => {
    event.dataTransfer.setData('attraction', JSON.stringify(attraction.id));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const attractionId = JSON.parse(event.dataTransfer.getData('attraction')) as number;
    setSelectedAttractions(prevSelected => [...prevSelected, attractionId]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveAttraction = (attractionId: number) => {
    setSelectedAttractions(prevSelected => prevSelected.filter(id => id !== attractionId));
  };

  const selectedAttractionsDetails = selectedAttractions.map(id => attractions.find(attraction => attraction.id === id)!);

  const handleFilterChange = (selectedTypes: PossibleType[], selectedSubtypes: Subtypes[]) => {
    setSelectedTypes(selectedTypes);
    setSelectedSubtypes(selectedSubtypes);
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      setSelectedAttractions(prevSelected => {
        const newArr = [...prevSelected];
        [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
        return newArr;
      });
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < selectedAttractions.length - 1) {
      setSelectedAttractions(prevSelected => {
        const newArr = [...prevSelected];
        [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
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
    return totalDistance.toFixed(2); // Round to two decimal places
  };

  const calculateDistanceInKm = (coordsA: { x: number; y: number }, coordsB: { x: number; y: number }) => {
    const R = 6371; // Earth's radius in kilometers
    const lat1 = degToRad(coordsA.x);
    const lat2 = degToRad(coordsB.x);
    const lon1 = degToRad(coordsA.y);
    const lon2 = degToRad(coordsB.y);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  const degToRad = (deg: number) => deg * (Math.PI / 180);

  const calculateShortestPath = () => {
    const adjMatrix = selectedAttractions.map(attrA =>
      selectedAttractions.map(attrB =>
        calculateDistanceInKm(
          attractions.find(attr => attr.id === attrA)!.coords,
          attractions.find(attr => attr.id === attrB)!.coords
        )
      )
    );

    const n = selectedAttractions.length;
    const dp = Array.from({ length: 1 << n }, () => Array(n).fill(Infinity));
    const parent = Array.from({ length: 1 << n }, () => Array(n).fill(-1));

    for (let i = 0; i < n; i++) {
      dp[1 << i][i] = 0;
    }

    for (let mask = 0; mask < (1 << n); mask++) {
      for (let u = 0; u < n; u++) {
        if ((mask & (1 << u)) === 0) continue;
        for (let v = 0; v < n; v++) {
          if ((mask & (1 << v)) !== 0 || u === v) continue;
          const newMask = mask | (1 << v);
          if (dp[newMask][v] > dp[mask][u] + adjMatrix[u][v]) {
            dp[newMask][v] = dp[mask][u] + adjMatrix[u][v];
            parent[newMask][v] = u;
          }
        }
      }
    }

    const fullMask = (1 << n) - 1;
    let minCost = Infinity;
    let endVertex = -1;
    for (let i = 0; i < n; i++) {
      if (dp[fullMask][i] < minCost) {
        minCost = dp[fullMask][i];
        endVertex = i;
      }
    }

    const path: number[] = [];
    let mask = fullMask;
    while (endVertex !== -1) {
      path.push(endVertex);
      const temp = endVertex;
      endVertex = parent[mask][endVertex];
      mask ^= (1 << temp);
    }

    setSelectedAttractions(path.map(index => selectedAttractions[index]));
  };

  return (
    <ViewContainer>
      <MapContainer four onDrop={handleDrop} onDragOver={handleDragOver}>
        <Title small>Zaplanuj trasę</Title>
        <Map
          key={refreshKey}
          ref={mapRef}
          x={51.1079}
          y={17.0385}
          zoom={8}
          path={true}
          attractions={selectedAttractionsDetails}
        />
      </MapContainer>

      <DropListContainer four>
        <Title small>Atrakcje</Title>
        <Body margin>(przeciągnij wybrane na mapkę)</Body>
        <Input
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
            !selectedAttractions.includes(attraction.id) &&
            attraction.name.toLowerCase().includes(search.toLowerCase()) &&
            selectedSubtypes.includes(attraction.subtype) && selectedTypes.includes(attraction.type) && (
              isMobile ? (
                <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
                  <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: 'black', flexGrow: 1, textDecoration: 'none' }}>
                    {attraction.name}
                  </a>
                  <StyledButton
                    variant="contained"
                    big={true}
                    onClick={() => setSelectedAttractions((prevSelected) => [...prevSelected, attraction.id])}
                  >
                    +
                  </StyledButton>
                </div>
              ) : (
                <div
                  key={index}
                  draggable
                  onDragStart={(event) => handleDragStart(event, attraction)}
                  style={{ padding: '.5rem', cursor: 'move' }}
                >
                  <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: colors.dark, textDecoration: 'none' }}>
                    {attraction.name}
                  </a>
                </div>
              ))))}
        </ScrollableBox>
      </DropListContainer>

      <FilterContainer four>
        <FilterList key={refreshKey} onChange={handleFilterChange} />
      </FilterContainer>

      <ListContainer four>
        <Title small>Długość trasy: {calculateTotalDistance()} km</Title>
        <StyledButton onClick={reset}>
          Zresetuj trasę
        </StyledButton>
        <StyledButton onClick={calculateShortestPath}>
          Sprawdź najkrótszą trasę
        </StyledButton>
        <Title small>Wybrane atrakcje (dostosuj kolejność)</Title>
        <ScrollableBox>
          {selectedAttractions.map((selected, index) => {
            const attraction = attractions.find(attr => attr.id === selected);
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleMoveUp(index)} disabled={index === 0}>
                  <ArrowUpward />
                </IconButton>
                <IconButton onClick={() => handleMoveDown(index)} disabled={index === selectedAttractions.length - 1}>
                  <ArrowDownward />
                </IconButton>
                <Body>
                  {attraction &&
                    <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: colors.dark, textDecoration: 'none' }}>
                      {attraction.name}
                    </a>}
                </Body>

                <StyledButton onClick={() => handleRemoveAttraction(selected)}>Usuń</StyledButton>
              </div>
            );
          })}
        </ScrollableBox>
      </ListContainer>
    </ViewContainer>
  );
};

export default RoutePlanner;
