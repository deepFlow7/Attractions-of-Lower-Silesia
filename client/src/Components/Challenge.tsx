/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import Map from './Map';
import AttractionsList from './AttractionsList';
import RankingTable from './Ranking';
import { Challenge, Ranking } from '../types';

interface ChallengeViewProps {
  rankings: Ranking[];
  challenge: Challenge;
}

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

const ChallengeView: React.FC<ChallengeViewProps> = ({ rankings, challenge }) => {
  const x = 51.1079;
  const y = 17.0385;

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Section>
            <CardContent>
              <Map x={x} y={y} />
            </CardContent>
          </Section>
        </Grid>
        <Grid item xs={12} md={4}>
          <Section>
            <CardContent>
              <AttractionsList items={challenge.attractions} />
            </CardContent>
          </Section>
        </Grid>
        <Grid item xs={12} md={3}>
          <Section>
            <CardContent>
              <Title variant="h5">Ranking</Title>
              <RankingTable rankings={rankings} />
            </CardContent>
          </Section>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChallengeView;
