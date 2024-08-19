import React, { useState, useEffect } from "react";
import { Typography, Button,  Grid, Card, CardContent, CardActions } from "@mui/material";
import api from '../API/api';
import UsersList from "./UsersList";
import ChallengesList from "./ChallengesList";
import AttractionsList from "./AttractionsList";
import styled from "@emotion/styled";
import Home from "./Home";
import { UserWithLogin, Attraction, Challenge} from "../types";
import { ViewContainer } from "../Styles/View";
import { AdminContainer } from "../Styles/List";


const StyledTypography = styled(Typography)`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  && {
    margin-right: 10px;
    margin-top: 10px;
  }
`;

const AdminView: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]); 
  const [challenges, setChallenges] = useState<Challenge[]>([]); 
  const [users, setUsers] = useState<UserWithLogin[]>([]); 
  const [isAdminPanel, setIsAdminPanel] = useState<boolean>(true); 
  const [manageAttractions, setManageAttractions] = useState(false);
  const [manageChallenges, setManageChallenges] = useState(false);

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

    fetchAttractions(); 
    fetchChallenges(); 
    fetchUsers(); 
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

  return (
    <ViewContainer>

      <StyledTypography variant="h4" gutterBottom>
        {isAdminPanel ? "Panel administratora" : "Widok główny"}
      </StyledTypography>
      
      <StyledButton variant="contained" color="secondary" onClick={toggleView}>
        {isAdminPanel ? "Przełącz na widok główny" : "Przełącz na panel administratora"}
      </StyledButton>

    {isAdminPanel ? (
      <ViewContainer>
        <AdminContainer>
          <Card>
            <CardContent>
              <UsersList users={users} />
            </CardContent>
          </Card>
          </AdminContainer>
          <AdminContainer>
          <Card>
            <CardActions>
              <Button size="small" color="primary" onClick={toggleManageAttractions}>
              {manageAttractions ? 'Wyjdź z trybu edycji' : 'Tryb edycji'}
              </Button>
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
                <Button size="small" color="primary" onClick={toggleManageChallenges}>
                {manageChallenges ? 'Wyjdź z trybu edycji' : 'Tryb edycji'}
                </Button>
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
      <Home/>
    )};
    </ViewContainer>
  );
};

export default AdminView;
