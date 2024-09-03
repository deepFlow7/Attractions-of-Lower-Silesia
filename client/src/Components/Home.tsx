/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { Input as MUIInput } from '@mui/material';
import styled from '@emotion/styled';

import api from '../API/api';
import Map from './Map';
import AttractionsList from './AttractionsList';
import FilterList from './FilterList';
import { Attraction, PossibleType, Subtypes } from '../types';
import { useSearch } from '../Providers/SearchContext';
import { ViewContainer } from '../Styles/View';
import { MapContainer } from '../Styles/Map';
import { ListContainer } from '../Styles/List';
import { FilterContainer } from '../Styles/Filter';
import { bodyMixin } from '../Styles/Typography';

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
`;

const StyledInput = styled(MUIInput)`
  & .MuiInputBase-input::placeholder {
    ${bodyMixin}
  }
`;

const Home: React.FC = () => {
  const initialLat = 51.1079;
  const initialLng = 17.0385;
  const [attractions, setAttractions] = useState<Attraction[] | null>(null);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const { search, setSearch } = useSearch();

  useEffect(() => {
    api.get('/api/attractions')
      .then(response => {
        setAttractions(response.data);
        setFilteredAttractions(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  if (!attractions) {
    return <div>Loading...</div>;
  }

  const handleFilterChange = (selectedTypes: PossibleType[], selectedSubtypes: Subtypes[]) => {
    if (attractions) {
      setFilteredAttractions(attractions.filter(attraction =>
        selectedSubtypes.includes(attraction.subtype) &&
        selectedTypes.includes(attraction.type)
      ));
    }
  };

  const filterBySearch = (attractions: Attraction[], searchTerm: string) => {
    return attractions.filter(attraction =>
      attraction.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <ViewContainer>
      <MapContainer>
        <Map
          x={initialLat}
          y={initialLng}
          attractions={filterBySearch(filteredAttractions, search)}
        />
      </MapContainer>
      <FilterContainer>
        <FilterList onChange={handleFilterChange} />
      </FilterContainer>
      <ListContainer>
        <InputContainer>
          <StyledInput
            placeholder="Wyszukaj..."
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearchChange}
            startAdornment={
              <IconButton sx={{ p: 0 }} disabled aria-label="search">
                <SearchIcon />
              </IconButton>
            }
          />
        </InputContainer>
        <AttractionsList attractions={filterBySearch(filteredAttractions, search)} />
      </ListContainer>
    </ViewContainer>
  );
};

export default Home;
