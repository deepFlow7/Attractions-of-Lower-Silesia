/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { Challenge, completedChallenge } from '../types'; 
import ChallengesList from './ChallengesList';
import api from '../API/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../Providers/AuthContext';

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

const Challenges = () => {
    const [allChallenges,setAllChallenges] = useState<Challenge[]|null>(null);
    const [completedChallenges,setCompletedChallenges] = useState<completedChallenge[]>([]);
    const { isAuthenticated, user, role } = useAuth();


    useEffect(() => {
        api.get('/api/challenges')
          .then(response => {
            setAllChallenges(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching challenges:', error);
          });

          if(user) {
            api.get(`/api/completed_challenges/${user.id}`)
              .then(response => {
                setCompletedChallenges(response.data);
              })
              .catch(error => {
                console.error('There was an error fetching challenges:', error);
            });}
      }, [user]);
      
    if(!allChallenges){
        return <div>Loading...</div>
    }
  return (
    <Container>
      <Section>
        <CardContent>
          <ChallengesList challenges={allChallenges}/>
        </CardContent>
      </Section>
      {isAuthenticated && role=="user" && (
        <Section>
        <CardContent>
          <SectionTitle variant="h5">Ukończone wyzwania</SectionTitle>
          <List>
            {completedChallenges.map(challenge => (
             <Button key={challenge.id+1} component={Link} to={'/challenge/'+challenge.id} color="inherit">
              <ListItem key={challenge.id+1}>
                  <ListItemText primary={challenge.name} />
                  <ListItemText primary={challenge.points} sx={{ marginLeft: 2 }}/>
              </ListItem>
            </Button>
            ))}
          </List>
        </CardContent>
      </Section>)}
    </Container>
  );
};

export default Challenges;
