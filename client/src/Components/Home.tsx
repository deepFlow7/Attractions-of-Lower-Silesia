/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React from 'react';
import { Grid, Card } from '@mui/material';
import Filter from './Filter';
import Map from './Map';
import AttractionsList from './AttractionsList';
import { Attraction } from '../types';

interface HomeProps {
  attractions: Attraction[];
  filterOptions: string[];
}

const TileCard = styled(Card)`
  margin: 1%;
`;
const Container = styled.div`
  margin: 1% 1%;
`;


const Home: React.FC<HomeProps> = ({ attractions, filterOptions }) => {
  const x = 51.1079;
  const y = 17.0385;

  function handleFilterChange() {
    // Tutaj można dodać logikę obsługi zmiany filtru, jeśli jest potrzebna
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <TileCard>
            <Map x={x} y={y} />
          </TileCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <TileCard>
            <AttractionsList items={attractions} />
          </TileCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <TileCard>
            <Filter
              options={filterOptions}
              onChange={handleFilterChange}
            />
          </TileCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
