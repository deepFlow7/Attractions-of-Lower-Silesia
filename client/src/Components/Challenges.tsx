/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { Challenge } from '../types'; // Importujemy interfejs Challenge
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ChallengesProps {
  completedChallenges: Challenge[] ;
}

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1%;
`;

const Section = styled(Card)`
  width: 45%;
  padding: 16px;
`;

const SectionTitle = styled(Typography)`
  font-weight: bold;
  margin: 1%;
`;

const Challenges: React.FC<ChallengesProps> = ({ completedChallenges }) => {
    const [allChallenges,setAllChallenges] = useState<Challenge[]|null>(null);

    useEffect(() => {
        axios.get('/api/challenges')
          .then(response => {
            setAllChallenges(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching challenges:', error);
          });
      }, []);
    if(!allChallenges){
        return <div>Loading...</div>
    }
  return (
    <Container>
      <Section>
        <CardContent>
          <SectionTitle variant="h5">Wszystkie wyzwania</SectionTitle>
          <List>
            {allChallenges.map(challenge => (
                <Button component={Link} to={'/challenge/'+challenge.id} color="inherit">
                    <ListItem key={challenge.id+1}>
                        <ListItemText primary={challenge.name} />
                    </ListItem>
                </Button>
            ))}
          </List>
        </CardContent>
      </Section>
      <Section>
        <CardContent>
          <SectionTitle variant="h5">Ukończone wyzwania</SectionTitle>
          <List>
            {completedChallenges.map(challenge => (
              <ListItem key={challenge.id}>
                <ListItemText primary={challenge.name} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Section>
    </Container>
  );
};

export default Challenges;
