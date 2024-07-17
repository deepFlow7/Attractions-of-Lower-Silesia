/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import api from '../API/api';
import { Grid, Card, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Map from './Map';
import AttractionsList from './AttractionsList';

import { Attraction, possible_type, subtypes } from '../types';
import FilterList from './FilterList';
import { useSearch } from '../Providers/SearchContext';


interface HomeProps {
}

const TileCard = styled(Card)`
  margin: 1%;
`;
const Container = styled.div`
  margin: 1% 1%;
`;

const StyledInputBase = styled(InputBase)`
  margin: 10px 0;             
  border: 1px solid #ccc;      
  border-radius: 4px;          
  padding: 8px;  
  width: 100%;             

  &:focus {
    border-color: blue;        
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); 
  }
`;


const Home: React.FC<HomeProps> = () => {
  const x = 51.1079;
  const y = 17.0385;
  const [attractions, setAttractions] = useState<Attraction[] | null>(null);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const {search, setSearch} = useSearch();

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

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
}

  return (
    
    <Container>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <TileCard> 
            <Map x={x} y={y} attractions={filterBySearch(filteredAttractions, search)} />
          </TileCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <TileCard>
              <StyledInputBase
                placeholder="Wyszukaj..."
                inputProps={{ 'aria-label': 'search' }}
                onChange={onChange}
                startAdornment={
                  <IconButton sx={{ p: 0 }} disabled aria-label="search" >
                    <SearchIcon />
                  </IconButton>
                }
            />
            <AttractionsList attractions={filterBySearch(filteredAttractions, search)}  />
          </TileCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <TileCard>
            <FilterList
              onChange={handleFilterChange}
            />
          </TileCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
