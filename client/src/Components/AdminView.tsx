import React, { useState, useEffect } from "react";
import api from '../API/api';
import UsersList from "./UsersList";
import ChallengesList from "./ChallengesList";
import AttractionsList from "./AttractionsList";
import { Card, CardContent, CardActions } from "@mui/material";
import styled from "@emotion/styled";
import Home from "./Home";
import { UserWithLogin, Attraction, Challenge } from "../types";
import { ViewContainer } from "../Styles/View";
import { AdminContainer } from "../Styles/List";
import { StyledButton } from "../Styles/Button";
import { colors, sizes } from "../Styles/Themes";

const Container = styled.div`
background-color: ${colors.secondary};
position: absolute;
  left: -5px;
  top: ${sizes.navbarHeight};
  width: calc(100vw + 5px);
  height: calc(100vh - ${sizes.navbarHeight});
`

const AdminView: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]); 
  const [challenges, setChallenges] = useState<Challenge[]>([]); 
  const [users, setUsers] = useState<UserWithLogin[]>([]); 
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]); 
  const [isAdminPanel, setIsAdminPanel] = useState<boolean>(true); 
  const [manageAttractions, setManageAttractions] = useState(false);
  const [manageChallenges, setManageChallenges] = useState(false);
  const [manageUsers, setManageUsers] = useState(false);

  useEffect(() => {
    const fetchAttractions = async () => {
      api.get('/api/attractions')
        .then(response => {
          setAttractions(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
    };

    const fetchChallenges = async () => {
      api.get('/api/challenges')
        .then(response => {
          setChallenges(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
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
        console.error('There was an error fetching the data!', error);
      });
    };

    fetchAttractions(); 
    fetchChallenges(); 
    fetchUsers(); 
    fetchBlockedUsers();
  }, []); 

  const toggleView = () => {
    setIsAdminPanel(!isAdminPanel);
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

  const deleteAttraction = async (id: number) => {
    const isConfirmed = window.confirm("Czy na pewno chcesz usunąć tę atrakcję?");
    if (!isConfirmed) return; 
  
    try {
      await api.post(`/api/attraction/delete`, { attractionId: id });
      setAttractions(prevAttractions => 
        prevAttractions.filter(attraction => attraction.id !== id)
      );
    } catch (error) {
      console.error('Error deleting attraction:', error);
    }
  };

  const changeAttractionName = async (id: number, newName : string) => {
    try {
      await api.post(`/api/attraction/update`, { attractionId: id, newName: newName });
      setAttractions(prevAttractions =>
        prevAttractions.map(attraction =>
          attraction.id === id ? { ...attraction, name: newName } : attraction
        )
      );
    } catch (error) {
      console.error('Error updating attraction:', error);
    }
  };

  const deleteChallenge = async (id: number) => {
    const isConfirmed = window.confirm("Czy na pewno chcesz usunąć to wyzwanie?");
    if (!isConfirmed) return; 
  
    try {
      await api.post(`/api/challenge/delete`, { challengeId: id });
      setChallenges(prevChallenges => 
        prevChallenges.filter(challenge => challenge.id !== id)
      );
    } catch (error) {
      console.error('Error deleting challange:', error);
    }
  };

  const changeChallengeName = async (id: number, newName : string) => {
    try {
      await api.post(`/api/challenge/update`, { challengeId: id, newName: newName });
      setChallenges(prevChallenges =>
        prevChallenges.map(challenge =>
          challenge.id === id ? { ...challenge, name: newName } : challenge
        )
      );
    } catch (error) {
      console.error('Error updating challenge:', error);
    }
  };

  const blockUser = async (id: number) => {
    const isConfirmed = window.confirm("Czy na pewno chcesz zablokować tego użytkownika?");
    if (!isConfirmed) return; 
  
    try {
      await api.post(`/api/user/block`, { user_id: id });
      setBlockedUsers(prevBlocked => 
        [...prevBlocked, id]
      );
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const unblockUser = async (id: number) => {
    const isConfirmed = window.confirm("Czy na pewno chcesz odblokować tego użytkownika?");
    if (!isConfirmed) return; 
  
    try {
      await api.post(`/api/user/unblock`, { user_id: id });
      setBlockedUsers(prevBlocked => 
        prevBlocked.filter(userId => userId !== id)
      );
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const changeUserBlock = async (id: number) => {
    if (blockedUsers?.includes(id)) 
      await unblockUser(id);
    else
      await blockUser(id);
  }


  return (
    <Container>
      <StyledButton onClick={toggleView}>
        {isAdminPanel ? "Przełącz na widok główny" : "Przełącz na panel administratora"}
      </StyledButton>

    {isAdminPanel ? (
      <ViewContainer  buttonOnTop>
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
            <ChallengesList 
              challenges={challenges} 
              isManaging={manageChallenges} 
              onDelete={deleteChallenge}
              onSave={changeChallengeName}
            />
          </Card>
          </AdminContainer>
        </ViewContainer>
      ) : (
        <AdminContainer>
        <Home /></AdminContainer>
      )};
    </Container>
  );
};

export default AdminView;
