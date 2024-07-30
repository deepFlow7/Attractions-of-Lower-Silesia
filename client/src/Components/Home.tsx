import React, { useEffect, useState } from 'react';
import api from '../API/api';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Map from './Map';
import AttractionsList from './AttractionsList';

import { Attraction, possible_type, subtypes } from '../types';
import FilterList from './FilterList';
import { useSearch } from '../Providers/SearchContext';
import { FilterContainer, MapContainer, ListContainer, HomeContainer, TileCard, StyledInputBase } from '../Styles/Home';

const Home = () => {
  const x = 51.1079;
  const y = 17.0385;
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
    return <div> Loading...</div>;
  }

  function handleFilterChange(selectedTypes: possible_type[], selectedSubtypes: subtypes[]) {
    if (attractions != null) {
      setFilteredAttractions(attractions.filter(a => selectedSubtypes.includes(a.subtype) && selectedTypes.includes(a.type)))
    }
  }

  function filterBySearch(attractions: Attraction[], input: string) {
    return attractions.filter(a => a.name.toLowerCase().includes(input.toLowerCase()));
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  return (
    <HomeContainer>
      <MapContainer>
        <TileCard>
          <Map x={x} y={y} attractions={filterBySearch(filteredAttractions, search)} />
        </TileCard>
      </MapContainer>
      <FilterContainer>
        <TileCard>
          <FilterList onChange={handleFilterChange} />
        </TileCard>
      </FilterContainer>
      <ListContainer>
        <TileCard>
          <StyledInputBase
            placeholder="Wyszukaj..."
            inputProps={{ 'aria-label': 'search' }}
            onChange={onChange}
            startAdornment={
              <IconButton sx={{ p: 0 }} disabled aria-label="search">
                <SearchIcon />
              </IconButton>
            }
          />
          <AttractionsList attractions={filterBySearch(filteredAttractions, search)} />
        </TileCard>
      </ListContainer>
     
    </HomeContainer>
  );
};
export default Home;
