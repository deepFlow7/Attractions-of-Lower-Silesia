/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { useColors, ContrastProps } from '../Providers/Colors'; 
import ChallengesList from './ChallengesList';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';
import { Challenge, BasicChallengeInfo } from '../types'; 
import { ViewContainer } from '../Styles/View';
import { Title } from '../Styles/Typography';
import { ChallengesContainer } from '../Styles/List';
import { bodyMixin } from '../Styles/Typography';

const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

const StyledListItem = styled(ListItem)`
  &:hover {
    background-color: #d0d0d0;
  }
`;

const StyledListItemText = styled(ListItemText)<ContrastProps>`
  .MuiListItemText-primary {
    ${({ colors }) => bodyMixin(colors)} 
  }
`;


const Challenges = () => {
  const [allChallenges, setAllChallenges] = useState<Challenge[] | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<BasicChallengeInfo[]>([]);
  const [challengesInProgress, setChallengesInProgress] = useState<BasicChallengeInfo[]>([]);
  const { isAuthenticated, user, role } = useAuth();
  const { toggleTheme, colors } = useColors();

  useEffect(() => {
    api.get('/api/challenges')
      .then(response => {
        setAllChallenges(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching challenges:', error);
      });

    if (user) {
      api.get(`/api/completed_challenges`)
        .then(response => {
          setCompletedChallenges(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching completed challenges:', error);
        });
      
        api.get(`/api/in_progress_challenges`)
        .then(response => {
          setChallengesInProgress(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching challenges in progress:', error);
        });
    }
  }, [user]);

  if (!allChallenges) {
    return <div>Loading...</div>;
  }

  return (
    <ViewContainer colors={colors}>
      <ChallengesContainer>
        <ChallengesList challenges={allChallenges} />
      </ChallengesContainer>
      {isAuthenticated && role === 'user' && (
        <>
          <ChallengesContainer>
            <Title colors={colors}>Podjęte wyzwania</Title>
            <StyledList>
              {challengesInProgress.map(challenge => (
                <Button
                  key={challenge.id}
                  component={Link}
                  to={`/challenge/${challenge.id}`}
                  color="inherit"
                  fullWidth
                >
                  <StyledListItem>
                    <StyledListItemText colors={colors} primary={challenge.name} />
                    <StyledListItemText colors={colors}
                      primary={challenge.points.toString()}
                      sx={{ marginLeft: 2 }}
                    />
                  </StyledListItem>
                </Button>
              ))}
            </StyledList>
        </ChallengesContainer>
        <ChallengesContainer>
          <Title colors={colors}>Ukończone wyzwania</Title>
          <StyledList>
            {completedChallenges.map(challenge => (
              <Button
                key={challenge.id}
                component={Link}
                to={`/challenge/${challenge.id}`}
                color="inherit"
                fullWidth
              >
                <StyledListItem>
                  <StyledListItemText colors={colors} primary={challenge.name} />
                  <StyledListItemText colors={colors}
                    primary={challenge.points.toString()}
                    sx={{ marginLeft: 2 }}
                  />
                </StyledListItem>
              </Button>
            ))}
          </StyledList>
        </ChallengesContainer>
        </>
      )
    }
    </ViewContainer>
  );
};

export default Challenges;
