/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { Challenge } from '../types'; // Importujemy interfejs Challenge

interface ChallengesProps {
  allChallenges: Challenge[];
  completedChallenges: Challenge[];
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

const Challenges: React.FC<ChallengesProps> = ({ allChallenges, completedChallenges }) => {
  return (
    <Container>
      <Section>
        <CardContent>
          <SectionTitle variant="h5">Wszystkie wyzwania</SectionTitle>
          <List>
            {allChallenges.map(challenge => (
              <ListItem key={challenge.id}>
                <ListItemText primary={challenge.name} />
              </ListItem>
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
