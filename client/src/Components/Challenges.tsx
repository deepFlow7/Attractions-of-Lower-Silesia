/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { Challenge } from '../types'; 
import axios from 'axios';
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
    const [completedChallenges,setCompletedChallenges] = useState<Challenge[]>([]);
    const { isAuthenticated, user } = useAuth();


    useEffect(() => {
        axios.get('/api/challenges')
          .then(response => {
            setAllChallenges(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching challenges:', error);
          });

          if(user) {
            axios.get(`/api/completed_challenges/${user.id}`)
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
          <SectionTitle variant="h5">Wszystkie wyzwania</SectionTitle>
          <List>
            {allChallenges.map(challenge => (
                <Button key={challenge.id+1} component={Link} to={'/challenge/'+challenge.id} color="inherit">
                    <ListItem key={challenge.id+1}>
                        <ListItemText primary={challenge.name} />
                    </ListItem>
                </Button>
            ))}
          </List>
        </CardContent>
      </Section>
      {user && (
        <Section>
        <CardContent>
          <SectionTitle variant="h5">Ukończone wyzwania</SectionTitle>
          <List>
            {completedChallenges.map(challenge => (
             <Button key={challenge.id+1} component={Link} to={'/challenge/'+challenge.id} color="inherit">
              <ListItem key={challenge.id+1}>
                  <ListItemText primary={challenge.name} />
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
