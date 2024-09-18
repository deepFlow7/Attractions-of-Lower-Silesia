import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Card, CardContent, CardActions } from '@mui/material';

import api from '../API/api';
import UsersList from './UsersList';
import ChallengesList from './ChallengesList';
import AttractionsList from './AttractionsList';
import Home from './Home';
import { UserWithLogin, Attraction, Challenge } from '../types';
import { ViewContainer } from '../Styles/View';
import { AdminContainer } from '../Styles/List';
import { StyledButton } from '../Styles/Button';
import { colors, sizes } from '../Styles/Themes';

const Container = styled.div`
  box-sizing: border-box;
  padding: 1rem;
  background-color: ${colors.secondary};
  position: absolute;
  left: -5px;
  top: ${sizes.navbarHeight};
  width: calc(100vw + 5px);
`;

const AdminView: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<UserWithLogin[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
  const [isAdminPanel, setIsAdminPanel] = useState<boolean>(true);
  const [manageAttractions, setManageAttractions] = useState<boolean>(false);
  const [manageChallenges, setManageChallenges] = useState<boolean>(false);
  const [manageUsers, setManageUsers] = useState<boolean>(false);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await api.get('/api/attractions');
        setAttractions(response.data);
      } catch (error) {
        console.error('There was an error fetching the attractions data!', error);
      }
    };

    const fetchChallenges = async () => {
      try {
        const response = await api.get('/api/challenges');
        setChallenges(response.data);
      } catch (error) {
        console.error('There was an error fetching the challenges data!', error);
      }
    };

    const fetchUsers = async () => {
      api.get('/api/users')
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
    };

    const fetchBlockedUsers = async () => {
      api.get('/api/users/blocked')
        .then(response => {
          setBlockedUsers(response.data.blocked_users);
        })
        .catch(error => {
          console.error('There was an error fetching the blocked users data!', error);
        });
    };

    fetchAttractions();
    fetchChallenges();
    fetchUsers();
    fetchBlockedUsers();
  }, []);

  const toggleView = () => {
    setIsAdminPanel(prevState => !prevState);
  };

  const toggleManageAttractions = () => {
    setManageAttractions(prevState => !prevState);
  };

  const toggleManageChallenges = () => {
    setManageChallenges(prevState => !prevState);
  };

  const toggleManageUsers = () => {
    setManageUsers(prevState => !prevState);
  };

  const deleteAttraction = async (attractionId: number) => {
    const isConfirmed = window.confirm('Czy na pewno chcesz usunąć tę atrakcję?');
    if (!isConfirmed) return;

    try {
      await api.post(`/api/attractions/${attractionId}/delete`);
      setAttractions(prevAttractions =>
        prevAttractions.filter(attraction => attraction.id !== attractionId)
      );
    } catch (error) {
      console.error('Error deleting attraction:', error);
    }
  };

  const changeAttractionName = async (attractionId: number, newName: string) => {
    try {
      await api.post(`/api/attractions/${attractionId}/update`, { newName });
      setAttractions(prevAttractions =>
        prevAttractions.map(attraction =>
          attraction.id === attractionId ? { ...attraction, name: newName } : attraction
        )
      );
    } catch (error) {
      console.error('Error updating attraction:', error);
    }
  };

  const deleteChallenge = async (challengeId: number) => {
    const isConfirmed = window.confirm('Czy na pewno chcesz usunąć to wyzwanie?');
    if (!isConfirmed) return;

    try {
      await api.post(`/api/challenges/${challengeId}/delete`);
      setChallenges(prevChallenges =>
        prevChallenges.filter(challenge => challenge.id !== challengeId)
      );
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const changeChallengeName = async (challengeId: number, newName: string) => {
    try {
      await api.post(`/api/challenges/${challengeId}/update`, { newName });
      setChallenges(prevChallenges =>
        prevChallenges.map(challenge =>
          challenge.id === challengeId ? { ...challenge, name: newName } : challenge
        )
      );
    } catch (error) {
      console.error('Error updating challenge:', error);
    }
  };

  const blockUser = async (userId: number) => {
    const isConfirmed = window.confirm('Czy na pewno chcesz zablokować tego użytkownika?');
    if (!isConfirmed) return;

    try {
      await api.post(`/api/users/${userId}/block`);
      setBlockedUsers(prevBlocked =>
        [...prevBlocked, userId]
      );
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const unblockUser = async (userId: number) => {
    const isConfirmed = window.confirm('Czy na pewno chcesz odblokować tego użytkownika?');
    if (!isConfirmed) return;

    try {
      await api.post(`/api/users/${userId}/unblock`);
      setBlockedUsers(prevBlocked =>
        prevBlocked.filter(userId => userId !== userId)
      );
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const changeUserBlock = async (userId: number) => {
    if (blockedUsers.includes(userId)) {
      await unblockUser(userId);
    } else {
      await blockUser(userId);
    }
  };

  return (
    <Container>
      <StyledButton onClick={toggleView} background={true}>
        {isAdminPanel ? 'Przełącz na widok główny' : 'Przełącz na panel administratora'}
      </StyledButton>

      {isAdminPanel ? (
        <ViewContainer buttonOnTop>
          <AdminContainer>
            <Card>
              <CardActions>
                <StyledButton size="small" color="primary" onClick={toggleManageUsers}>
                  {manageUsers ? 'Wyjdź z trybu zarządzania' : 'Tryb zarządzania'}
                </StyledButton>
              </CardActions>
              <CardContent>
                <UsersList
                  users={users}
                  isManaging={manageUsers}
                  changeUserBlock={changeUserBlock}
                  blockedUsers={blockedUsers}
                />
              </CardContent>
            </Card>
          </AdminContainer>

          <AdminContainer>
            <Card>
              <CardActions>
                <StyledButton size="small" color="primary" onClick={toggleManageAttractions}>
                  {manageAttractions ? 'Wyjdź z trybu zarządzania' : 'Tryb zarządzania'}
                </StyledButton>
              </CardActions>
              <CardContent>
                <AttractionsList
                  attractions={attractions}
                  isManaging={manageAttractions}
                  onDelete={deleteAttraction}
                  onSave={changeAttractionName}
                />
              </CardContent>
            </Card>
          </AdminContainer>

          <AdminContainer>
            <Card>
              <CardActions>
                <StyledButton size="small" color="primary" onClick={toggleManageChallenges}>
                  {manageChallenges ? 'Wyjdź z trybu zarządzania' : 'Tryb zarządzania'}
                </StyledButton>
              </CardActions>
              <CardContent>
                <ChallengesList
                  challenges={challenges}
                  isManaging={manageChallenges}
                  onDelete={deleteChallenge}
                  onSave={changeChallengeName}
                />
              </CardContent>
            </Card>
          </AdminContainer>
        </ViewContainer>
      ) : (
        <AdminContainer>
          <Home />
        </AdminContainer>
      )}
    </Container>
  );
};

export default AdminView;
