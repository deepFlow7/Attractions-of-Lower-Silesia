/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card } from '@mui/material';
import Map from './Map';
import AttractionsList from './AttractionsList';
import { possibleSubtypes, possibleTypes, Attraction, possible_type, subtypes } from '../types';
import FilterList from './FilterList';

interface HomeProps {
}

const TileCard = styled(Card)`
  margin: 1%;
`;
const Container = styled.div`
  margin: 1% 1%;
`;


const Home: React.FC<HomeProps> = () => {
  const x = 51.1079;
  const y = 17.0385;
  const [attractions, setAttractions] = useState<Attraction[] | null>(null);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  useEffect(() => {
    axios.get('/api/attractions')
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
    return attractions.filter(a => a.name.includes(input));
  }

  return (
    
    <Container>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <TileCard> 
            <Map x={x} y={y} attractions={filterBySearch(filteredAttractions, searchInput)} />
          </TileCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <TileCard>
            <AttractionsList attractions={filterBySearch(filteredAttractions, searchInput)}  />
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
