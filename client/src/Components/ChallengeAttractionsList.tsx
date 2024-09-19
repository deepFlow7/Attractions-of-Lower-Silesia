/** @jsxImportSource @emotion/react */
import React from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { StyledButton } from "../Styles/Button";
import { ChallengeAttraction } from "../types";
import { bodyMixin, Title, Body } from '../Styles/Typography';
import { shadows } from "../Styles/Themes";
import { useColors, ContrastProps } from '../Providers/Colors'; 

const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

const StyledListItem = styled(ListItem)`
  &:hover {
    box-shadow: ${shadows.active};
  }
`;

const StyledListItemText = styled(ListItemText)<ContrastProps>`
  .MuiListItemText-primary {
    ${({ colors }) => bodyMixin(colors)} 
  }
`;

interface ListProps {
  attractions: ChallengeAttraction[];
  onClick: (attraction: ChallengeAttraction) => void;
  showVisitButtons: boolean;
  visitedAttractions: { attraction_id: number }[];
  loadingAttractions: { attraction_id: number }[];
}

const ChallengeAttractionsList: React.FC<ListProps> = ({
  attractions,
  onClick,
  showVisitButtons,
  visitedAttractions,
  loadingAttractions,
}) => {
  const isAttractionVisited = (attractionId: number) =>
    visitedAttractions.some((attraction) => attraction.attraction_id === attractionId);

  const isAttractionLoading = (attractionId: number) =>
    loadingAttractions.some((attraction) => attraction.attraction_id === attractionId);
  const { toggleTheme, colors } = useColors();

  return (
    <StyledList>
      <Title colors={colors}>Lista Atrakcji</Title>
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
                fullWidth
                style={{ justifyContent: "flex-start" }}
              >
                <StyledListItem>
                  <StyledListItemText colors={colors} primary={attraction.name} />
                  <StyledListItemText colors={colors}
                    primary={`${attraction.points} punktów`}
                    style={{ textAlign: 'right' }}
                  />
                </StyledListItem>
              </Button>
              {showVisitButtons && (
                isAttractionVisited(attraction.id) ? (
                  <Body colors={colors} gray>
                    Odwiedzone
                  </Body>
                ) : (
                  isAttractionLoading(attraction.id) ? (
                    <Body  colors={colors} gray>
                      Sprawdzam lokalizację <CircularProgress size={15} />
                    </Body>
                  ) : (
                    <StyledButton  colors={colors} onClick={() => onClick(attraction)}>
                      Odwiedź
                    </StyledButton>
                  )
                )
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </StyledList>
  );
};

export default ChallengeAttractionsList;
