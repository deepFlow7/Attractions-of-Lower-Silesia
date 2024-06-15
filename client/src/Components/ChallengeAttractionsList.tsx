/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ChallengeAttraction } from "../types";

interface ListProps {
  attractions: ChallengeAttraction[];
  onClick: (attraction: ChallengeAttraction) => void;
  showVisitButtons: boolean;
  visitedAttractions: { attraction_id: number }[];
}

const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

const StyledListItem = styled(ListItem)`
  &:nth-of-type(odd) {
  }
  &:hover {
    background-color: #d0d0d0;
  }
`;

const Title = styled(Typography)`
  font-weight: bold;
`;

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

const VisitedText = styled(Typography)`
  && {
    background-color: #d0d0d0;
    color: white;
    border-radius: 4px;
    margin: 8px auto 0 auto;
    display: block;
    text-align: center;
    width: 90%;
    padding: 5px 0px;
  }
`;

const ChallengeAttractionsList: React.FC<ListProps> = ({
  attractions,
  onClick,
  showVisitButtons,
  visitedAttractions,
}) => {
  const isAttractionVisited = (attractionId: number) => {
    return visitedAttractions.some(
      (attraction) => attraction.attraction_id === attractionId
    );
  };

  return (
    <StyledList>
      <Title variant="h5">Lista Atrakcji</Title>
      <Box
        sx={{
          maxHeight: 400, 
          overflowY: "auto",
        }}
      >
        <Grid container spacing={2}>
          {attractions.map((attraction) => (
            <Grid item xs={12} key={attraction.id}>
              <Box
                border={1}
                borderColor="grey.400"
                borderRadius={2}
                padding={2}
                marginBottom={2}
              >
                <Button
                  component={Link}
                  to={"/attraction/" + attraction.id}
                  color="inherit"
                  key={attraction.id}
                  fullWidth
                  style={{ justifyContent: "flex-start" }}
                >
                  <StyledListItem key={attraction.id}>
                    <ListItemText primary={attraction.name} />
                  </StyledListItem>
                </Button>
                {showVisitButtons &&
                  (isAttractionVisited(attraction.id) ? (
                    <VisitedText variant="body1">
                      Odwiedzone ({attraction.points} punktów)
                    </VisitedText>
                  ) : (
                    <VisitButton onClick={() => onClick(attraction)}>
                      Odwiedź ({attraction.points} punktów)
                    </VisitButton>
                  ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </StyledList>
  );
};

export default ChallengeAttractionsList;
