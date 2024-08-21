import React, { useState, useEffect } from "react";
import api from '../API/api';
import UsersList from "./UsersList";
import ChallengesList from "./ChallengesList";
import AttractionsList from "./AttractionsList";
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
    <Container>
      <StyledButton onClick={toggleView}>
        {isAdminPanel ? "Przełącz na widok główny" : "Przełącz na panel administratora"}
      </StyledButton>

      {isAdminPanel ? (
        <ViewContainer buttonOnTop>
          
          <AdminContainer>
          <StyledButton>
              Manage Users
            </StyledButton>
            <UsersList users={users} />
          </AdminContainer>
          <AdminContainer>
            <StyledButton>
              Manage Attractions
            </StyledButton>
            <AttractionsList attractions={attractions} />
          </AdminContainer>
          <AdminContainer>
            <StyledButton>
              Manage Challenges
            </StyledButton>
            <ChallengesList challenges={challenges} />
          </AdminContainer>
        </ViewContainer>

      ) : (
        <Home />
      )};
    </Container>
  );
};

export default AdminView;
