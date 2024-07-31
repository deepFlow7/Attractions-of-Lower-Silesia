/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { Challenge, completedChallenge } from '../types'; 
import ChallengesList from './ChallengesList';
import api from '../API/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../Providers/AuthContext';
import { ViewContainer } from '../Styles/View';
import {Title} from '../Styles/Typhography';
import { ChallengesContainer } from '../Styles/List';

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
    <ViewContainer>
      <ChallengesContainer>
        <ChallengesList challenges={allChallenges}/>
      </ChallengesContainer>
      {isAuthenticated && role=="user" && (
        <ChallengesContainer>
          <Title>Ukończone wyzwania</Title>
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
        </ChallengesContainer>
     )}
    </ViewContainer>
  );
};

export default Challenges;
