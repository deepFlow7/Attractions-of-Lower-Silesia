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
  TextField
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import { Challenge } from "../types";
import { useAuth } from "../Providers/AuthContext";
import { useState } from "react";
import SaveIcon from '@mui/icons-material/Save';
import { Title, bodyMixin } from "../Styles/Typography";

interface ListProps {
  challenges: Challenge[];
  isManaging?: boolean;
  onDelete?: (id: number) => void;
  onSave?: (id: number, newName: string) => void;
}

// Stylowany komponent List
const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

// Stylowany komponent ListItem
const StyledListItem = styled(ListItem)`
  &:hover {
    background-color: #d0d0d0;
  }
`;

// Stylowany komponent ListItemText
const StyledListItemText = styled(ListItemText)`
  .MuiListItemText-primary {
    ${bodyMixin}
  }
`;

const ChallengesList: React.FC<ListProps> = ({ challenges, isManaging, onDelete, onSave }) => {
  const { isAuthenticated, role } = useAuth();
  const [editedChallenges, setEditedChallenges] = useState<{ [id: number]: string }>({});

  const handleInputChange = (id: number, newName: string) => {
    setEditedChallenges({
      ...editedChallenges,
      [id]: newName,
    });
  };

  const handleSave = (id: number) => {
    if (editedChallenges[id]) {
      onSave!(id, editedChallenges[id]);
    }
  };

  return (
    <StyledList>
      <Title>
        Wyzwania
      </Title>
      <List>
        {challenges.map((challenge) => (
          <StyledListItem key={challenge.id}>
            {isAuthenticated && role === "admin" && isManaging ? (
              <>
                <TextField
                  value={editedChallenges[challenge.id] || challenge.name}
                  onChange={(e) => handleInputChange(challenge.id, e.target.value)}
                  fullWidth
                />
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => handleSave(challenge.id)}
                  aria-label="save"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => onDelete!(challenge.id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              <Button component={Link} to={'/challenge/' + challenge.id} color="inherit" style={{ flexGrow: 1 }}>
                <ListItemText primary={challenge.name} />
              </Button>
            )}
          </StyledListItem>
        ))}
      </List>
    </StyledList>
  );
};

export default ChallengesList;
