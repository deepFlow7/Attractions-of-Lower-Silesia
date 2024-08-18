import React, { useState, useRef, useEffect } from 'react';
import { Grid, Button, InputBase } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import api from '../API/api';
import Map, { MapRef } from './Map';
import { Attraction, possible_type, subtypes, possibleSubtypes, possibleTypes } from '../types';
import FilterList from './FilterList';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { ViewContainer } from '../Styles/View';
import { MapContainer, DropListContainer } from '../Styles/Map';
import { ListContainer } from '../Styles/List';
import { FilterContainer } from '../Styles/Filter';
import { Input } from '../Styles/Input';
import { Body, Title } from '../Styles/Typography';
import { StyledButton } from '../Styles/Button';
import {colors } from '../Styles/Themes';
const ScrollableBox = styled.div`
  overflow-y: auto;
`;

const RoutePlanner = () => {
  const [selectedAttractions, setSelectedAttractions] = useState<number[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<possible_type[]>(possibleTypes);
  const [selectedSubtypes, setSelectedSubtypes] = useState<subtypes[]>(possibleSubtypes);
  const initialMapView = { center: { x: 51.1079, y: 17.0385 }, zoom: 8 };
  const [search, setSearch] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

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
    setSelectedAttractions((prevSelected) => [...prevSelected, attractionId]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveAttraction = (attractionId: number) => {
    setSelectedAttractions((prevSelected) => prevSelected.filter(attraction => attraction !== attractionId));
  };

  const selectedAttractionsDetails = selectedAttractions.map(selected_attraction_id =>
    attractions.find(attraction => attraction.id === selected_attraction_id)!
  );

  function handleFilterChange(selectedTypes: possible_type[], selectedSubtypes: subtypes[]) {
    setSelectedTypes(selectedTypes);
    setSelectedSubtypes(selectedSubtypes);
  }

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      setSelectedAttractions(prevSelected => {
        const newArr = [...prevSelected];
        const temp = newArr[index];
        newArr[index] = newArr[index - 1];
        newArr[index - 1] = temp;
        return newArr;
      });
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < selectedAttractions.length - 1) {
      setSelectedAttractions(prevSelected => {
        const newArr = [...prevSelected];
        const temp = newArr[index];
        newArr[index] = newArr[index + 1];
        newArr[index + 1] = temp;
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
    return totalDistance.toFixed(2); // Zaokrąglamy do dwóch miejsc po przecinku
  };

  const calculateDistanceInKm = (coordsA: { x: number; y: number }, coordsB: { x: number; y: number }) => {
    const R = 6371; // Średnia ziemska promień w kilometrach
    const lat1 = deg2rad(coordsA.x);
    const lat2 = deg2rad(coordsB.x);
    const lon1 = deg2rad(coordsA.y);
    const lon2 = deg2rad(coordsB.y);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Odległość w kilometrach
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const calculate_shortest_path = () => {
    const adj_matrix = selectedAttractions.map((attr_a) => {
      return selectedAttractions.map((attr_b) => {
        return calculateDistanceInKm(
          attractions.find(attr => attr.id === attr_a)!.coords,
          attractions.find(attr => attr.id === attr_b)!.coords
        );
      });
    });

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
          if (dp[newMask][v] > dp[mask][u] + adj_matrix[u][v]) {
            dp[newMask][v] = dp[mask][u] + adj_matrix[u][v];
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


    const path = [];
    let mask = fullMask;
    while (endVertex !== -1) {
      path.push(endVertex);
      const temp = endVertex;
      endVertex = parent[mask][endVertex];
      mask ^= (1 << temp);
    }

    setSelectedAttractions(path.map(attr => selectedAttractions[attr]));
  }

  return (
    <ViewContainer>

      <MapContainer four onDrop={handleDrop} onDragOver={handleDragOver}>
        <Title small>Zaplanuj trasę</Title>

        <Map
          key={refreshKey}
          ref={mapRef}
          x={initialMapView.center.x}
          y={initialMapView.center.y}
          zoom={initialMapView.zoom}
          path={true}
          attractions={selectedAttractionsDetails}
        />
      </MapContainer>

      <DropListContainer four>
        <Title small>
          Atrakcje
        </Title>
        <Body margin>
          (przeciągnij wybrane na mapkę)
        </Body>
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
              <div
                key={index}
                draggable
                onDragStart={(event) => handleDragStart(event, attraction)}
                style={{ padding: '0.5rem', cursor: 'move' }}
              >
                <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: colors.dark, textDecoration: 'none' }}>

                  {attraction.name}
                </a>
              </div>
            )))}
        </ScrollableBox>
      </DropListContainer>

      <FilterContainer four>
        <FilterList key={refreshKey} onChange={handleFilterChange}></FilterList>
      </FilterContainer>

      <ListContainer four>
        <Title small>Długość trasy: {calculateTotalDistance()} km</Title>
        <Button onClick={reset}>
          <StyledButton>
            Zresetuj trasę
          </StyledButton>
        </Button>
        <Button onClick={calculate_shortest_path}>
          <StyledButton>

            Sprawdź najkrótszą trasę
          </StyledButton>

        </Button>
        <Title small>Wybrane atrakcje (dostosuj kolejność)</Title>
        <ScrollableBox>
          {selectedAttractions.map((selected, index) => {
            const attraction = attractions.find(attr => attr.id === selected);
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '8px', border: '1px solid black', marginBottom: '4px' }}>
                <IconButton onClick={() => handleMoveUp(index)} disabled={index === 0}>
                  <ArrowUpward />
                </IconButton>
                <IconButton onClick={() => handleMoveDown(index)} disabled={index === selectedAttractions.length - 1}>
                  <ArrowDownward />
                </IconButton>
                <Body>
                  {attraction &&
                    <a href={`/attraction/${attraction.id}`} target="_blank" style={{ color: 'black' }}>
                      {attraction.name}
                    </a>}
                </Body>
                <Button variant="contained" color="secondary" onClick={() => handleRemoveAttraction(selected)}>Usuń</Button>
              </div>
            );
          })}
        </ScrollableBox>
      </ListContainer>
    </ViewContainer>
  );
};

export default RoutePlanner;
