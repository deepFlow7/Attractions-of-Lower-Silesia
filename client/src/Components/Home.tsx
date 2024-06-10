/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { Grid, Card } from '@mui/material';
import Filter from './Filter';
import Map from './Map';
import AttractionsList from './AttractionsList';
import { Attraction, possible_type } from '../types';

interface HomeProps {
}

const TileCard = styled(Card)`
  margin: 1%;
`;
const Container = styled.div`
  margin: 1% 1%;
`;


const Home: React.FC<HomeProps> = () => {
    const filterOptions=["ladne", "nieladne", "a"];
  const x = 51.1079;
  const y = 17.0385;
  const [attractions,setAttractions] = useState<Attraction[]|null>(null);

    useEffect(() => {
        axios.get('/api/attractions')
            .then(response => {
            setAttractions(response.data);
            })
            .catch(error => {
            console.error('There was an error fetching the data!', error);
            });
    }, []);

    if(!attractions){
        return <div> Loading...</div>;
    }

  function handleFilterChange() {
    // Tutaj można dodać logikę obsługi zmiany filtru, jeśli jest potrzebna
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <TileCard>
            <Map x={x} y={y} attractions={attractions}/>
          </TileCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <TileCard>
            <AttractionsList attractions={attractions} type_filter={filterOptions as possible_type[]}/>
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
