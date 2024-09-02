/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import { useAuth } from "../Providers/AuthContext";
import { Attraction } from "../types"; 
import { Title } from '../Styles/Typography';
import { bodyMixin } from "../Styles/Typography";

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

const StyledListItem = styled(ListItem)`
  &:hover {
    background-color: #d0d0d0;
  }
`;

const StyledListItemText = styled(ListItemText)`
  .MuiListItemText-primary {
    ${bodyMixin}
  }
`;

const AttractionsList: React.FC<ListProps> = ({
  attractions,
  isManaging,
  onDelete,
  onSave
}) => {
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
      <Title>Atrakcje</Title>
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
                onClick={() => onDelete && onDelete(attraction.id)}
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
              <StyledListItemText primary={attraction.name} />
            </Button>
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default AttractionsList;
