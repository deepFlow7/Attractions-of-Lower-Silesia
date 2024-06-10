
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Card, CardContent, Grid, Typography } from '@mui/material';

import Map from './Map';
import AttractionsList from './AttractionsList';
import RankingTable from './Ranking';
import { Challenge } from '../types';




const Container = styled.div`
  padding: 20px;
`;

const Section = styled(Card)`
  margin-bottom: 20px;
`;

const Title = styled(Typography)`
  text-align: center;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ChallengeView: React.FC = () => {
  const x = 51.1079;
  const y = 17.0385;
  const [challenge, setChallenge] = useState<Challenge|null>(null);

  const {id} = useParams();

  useEffect(() => {
    axios.get('/api/challenge/'+id)
      .then(response => {
        setChallenge(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  if(!challenge){return <div>Loading...</div>;}
   

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Section>
            <CardContent>
              <Map x={x} y={y} attractions={challenge.attractions}/>
            </CardContent>
          </Section>
        </Grid>
        <Grid item xs={12} md={4}>
          <Section>
            <CardContent>
              <AttractionsList attractions={challenge.attractions} />
            </CardContent>
          </Section>
        </Grid>
        <Grid item xs={12} md={3}>
          <Section>
            <CardContent>
              <Title variant="h5">Ranking</Title>
              <RankingTable />
            </CardContent>
          </Section>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChallengeView;
