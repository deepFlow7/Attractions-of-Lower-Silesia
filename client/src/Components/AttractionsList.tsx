/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Link } from "react-router-dom";
import { Attraction } from "../types";
import { useAuth } from "../Providers/AuthContext";

interface ListProps {
  attractions: Attraction[];
  isManaging?: boolean;
  onDelete?: (id: number) => void;
  onSave?: (id: number, newName: string) => void;
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

const AttractionsList: React.FC<ListProps> = ({ attractions, isManaging, onDelete, onSave }) => {
  const { isAuthenticated, role } = useAuth();
  const [editedAttractions, setEditedAttractions] = useState<{ [id: number]: string }>({});

  const handleInputChange = (id: number, newName: string) => {
    setEditedAttractions({
      ...editedAttractions,
      [id]: newName,
    });
  };

  const handleSave = (id: number) => {
    if (onSave && editedAttractions[id]) {
      onSave(id, editedAttractions[id]);
    }
  };

  return (
    <StyledList>
      <Title variant="h5" gutterBottom>
        Atrakcje
      </Title>
      {attractions.map((attraction) => (
        <StyledListItem key={attraction.id}>
          {isAuthenticated && role === 'admin' && isManaging ? (
            <>
              <TextField
                value={editedAttractions[attraction.id] || attraction.name}
                onChange={(e) => handleInputChange(attraction.id, e.target.value)}
                fullWidth
              />
              <IconButton
                edge="end"
                color="primary"
                onClick={() => handleSave(attraction.id)}
                aria-label="save"
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                edge="end"
                color="error"
                onClick={() => onDelete!(attraction.id)}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <Button
              component={Link}
              to={`/attraction/${attraction.id}`}
              color="inherit"
              style={{ flexGrow: 1 }}
            >
              <ListItemText primary={attraction.name} />
            </Button>
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default AttractionsList;
