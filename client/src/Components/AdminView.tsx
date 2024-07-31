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
            <CardActions>
              <Button size="small" color="primary">
                Manage Users
              </Button>
            </CardActions>
          </Card>
          </AdminContainer>
          <AdminContainer>
          <Card>
            <CardContent>
              
              <AttractionsList attractions={attractions} />
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Manage Attractions
              </Button>
            </CardActions>
          </Card>
          </AdminContainer>
          <AdminContainer>
          <Card>
              <ChallengesList challenges={challenges} />
            <CardActions>
              <Button size="small" color="primary">
                Manage Challenges
              </Button>
            </CardActions>
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
