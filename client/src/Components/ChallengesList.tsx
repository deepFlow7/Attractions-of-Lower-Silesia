/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import { Challenge } from "../types"; 
import { useAuth } from "../Providers/AuthContext";

interface ListProps {
  challenges: Challenge[];
  isManaging?: boolean;
  onDelete?: (id : number) => void; 
}

const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

const Title = styled(Typography)`
  font-weight: bold;
`;

const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  &:nth-of-type(odd) {
    background-color: #f5f5f5; 
  }
  &:hover {
    background-color: #d0d0d0;
  }
`;


const ChallengesList: React.FC<ListProps> = ({ challenges, isManaging, onDelete }) => {
  const { isAuthenticated, role } = useAuth();

  return (
    <StyledList>
      <Title variant="h5" gutterBottom>
        Wyzwania
      </Title>
        <List>
          {challenges.map(challenge => (
            <StyledListItem key={challenge.id}>
              <Button component={Link} to={'/challenge/'+challenge.id} color="inherit"  style={{ flexGrow: 1 }}>
                  <ListItemText primary={challenge.name} />
              </Button>
              {isAuthenticated && role === 'admin' && isManaging && (
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => onDelete!(challenge.id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </StyledListItem>
          ))}
        </List>
    </StyledList>
  );
};

export default ChallengesList;