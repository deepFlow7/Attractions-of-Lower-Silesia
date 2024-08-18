/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import { Attraction } from "../types"; 
import { useAuth } from "../Providers/AuthContext";

interface ListProps {
  attractions: Attraction[];
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

const AttractionsList: React.FC<ListProps> = ({ attractions, isManaging, onDelete }) => {
  const { isAuthenticated, role } = useAuth();

  return (
    <StyledList>
       <Title variant="h5" gutterBottom>
        Atrakcje
      </Title>
      {attractions.map((attraction) => (
        <StyledListItem key={attraction.id}>
          <Button
            component={Link}
            to={`/attraction/${attraction.id}`}
            color="inherit"
            style={{ flexGrow: 1 }}
          >
            <ListItemText primary={attraction.name} />
          </Button>
          {isAuthenticated && role === 'admin' && isManaging && (
            <IconButton
              edge="end"
              color="error"
              onClick={() => onDelete!(attraction.id)}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default AttractionsList;
