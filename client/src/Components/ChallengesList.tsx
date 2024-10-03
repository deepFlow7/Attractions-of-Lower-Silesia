/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Providers/AuthContext";
import { ContrastProps, useColors } from '../Providers/Colors';
import StyledTextField from "../Styles/TextField";
import { Title, bodyMixin } from "../Styles/Typography";
import { Challenge } from "../types";

interface ListProps {
  challenges: Challenge[];
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

const StyledListItemText = styled(ListItemText) <ContrastProps>`
  .MuiListItemText-primary {
    ${({ colors }) => bodyMixin(colors)} 
  }
`;

const ChallengesList: React.FC<ListProps> = ({
  challenges,
  isManaging,
  onDelete,
  onSave
}) => {
  const { isAuthenticated, role } = useAuth();
  const [editedChallenges, setEditedChallenges] = useState<{ [id: number]: string }>({});
  const { colors } = useColors();

  const handleInputChange = (id: number, newName: string) => {
    setEditedChallenges({
      ...editedChallenges,
      [id]: newName
    });
  };

  const handleSave = (id: number) => {
    if (onSave && editedChallenges[id]) {
      onSave(id, editedChallenges[id]);
    }
  };

  return (
    <StyledList>
      <Title colors={colors}>Wyzwania</Title>
      {challenges.map((challenge) => (
        <StyledListItem key={challenge.id}>
          {isAuthenticated && role === "admin" && isManaging ? (
            <>
              <StyledTextField colors={colors}
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
                onClick={() => onDelete && onDelete(challenge.id)}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <Button
              component={Link}
              to={`/challenge/${challenge.id}`}
              color="inherit"
              style={{ flexGrow: 1 }}
            >
              <StyledListItemText colors={colors} primary={challenge.name} />
            </Button>
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default ChallengesList;
