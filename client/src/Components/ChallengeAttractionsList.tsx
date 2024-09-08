/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ChallengeAttraction } from "../types";
import { bodyMixin, Title, Body } from '../Styles/Typography'; // Importowanie bodyMixin
import { shadows } from "../Styles/Themes";
interface ListProps {
  attractions: ChallengeAttraction[];
  onClick: (attraction: ChallengeAttraction) => void;
  showVisitButtons: boolean;
  visitedAttractions: { attraction_id: number }[];
  loadingAttractions: { attraction_id: number }[];
}

// Stylowany komponent List
const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

// Stylowany komponent ListItem
const StyledListItem = styled(ListItem)`
  &:hover {
    shadow: ${shadows.active};
  }
`;


// Stylowany komponent VisitButton
const VisitButton = styled(Button)`
  && {
    background-color: #42a5f5;
    color: white;
    border-radius: 4px;
    margin: 8px auto 0 auto;
    display: block;
    width: 90%;
    padding: 5px 0px;
    &:hover {
      background-color: #1976d2;
    }
  }
`;


// Stylowany komponent ListItemText
const StyledListItemText = styled(ListItemText)`
  .MuiListItemText-primary {
    ${bodyMixin}
  }
`;

const ChallengeAttractionsList: React.FC<ListProps> = ({
  attractions,
  onClick,
  showVisitButtons,
  visitedAttractions,
  loadingAttractions
}) => {
  const isAttractionVisited = (attractionId: number) => {
    return visitedAttractions.some(
      (attraction) => attraction.attraction_id === attractionId
    );
  };

  const isAttractionLoading = (attractionId: number) => {
    return loadingAttractions.some(
      (attraction) => attraction.attraction_id === attractionId
    );
  };

  return (
    <StyledList>
      <Title >Lista Atrakcji</Title>
      <Box
        sx={{
          maxHeight: 400,
          overflowY: "auto",
        }}
      >
        <Grid container spacing={2}>
          {attractions.map((attraction) => (
            <Grid item xs={12} key={attraction.id}>

              <Button
                component={Link}
                to={`/attraction/${attraction.id}`}
                color="inherit"
                key={attraction.id}
                fullWidth
                style={{ justifyContent: "flex-start" }}
              >
                <StyledListItem>
                  <StyledListItemText primary={attraction.name} />
                  <StyledListItemText primary={`${attraction.points} punktów`} style={{ textAlign: 'right' }} />
                </StyledListItem>
              </Button>
              {showVisitButtons &&
                (isAttractionVisited(attraction.id) ? (
                  <Body gray>
                    Odwiedzone
                  </Body>
                ) : (
                  isAttractionLoading(attraction.id) ? (
                    <Body gray>
                      Sprawdzam lokalizację <CircularProgress size={15} />
                    </Body>
                  ) : (
                    <VisitButton onClick={() => onClick(attraction)}>
                      Odwiedź
                    </VisitButton>
                  )))}
            </Grid>
          ))}
        </Grid>
      </Box>
    </StyledList>
  );
};

export default ChallengeAttractionsList;
