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
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { colors } from "../Styles/Themes";
import { useAuth } from "../Providers/AuthContext";
import { Attraction } from "../types";
import { Title } from "../Styles/Typography";
import { bodyMixin } from "../Styles/Typography";
import StyledTextField from "../Styles/TextField";

interface ListProps {
  attractions: Attraction[];
  isManaging?: boolean;
  onDelete?: (id: number) => void;
  onSave?: (id: number, newName: string) => void;
}

const StyledList = styled(List)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px; /* Add gap between items */
`;

const StyledListItem = styled(ListItem)`
  display: flex;
  flex: 1 0 200px; /* Flex-grow, flex-shrink, and flex-basis */
  min-width: 200px; /* Minimum width for wrapping */
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
  onSave,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState<boolean>(
    !isSmallScreen
  );
  const { isAuthenticated, role } = useAuth();
  const [editedAttractions, setEditedAttractions] = useState<{
    [id: number]: string;
  }>({});

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
    <>
        <Button onClick={() => setOpen(!open)}>

      <Title>
        Atrakcje{" "}
        {isSmallScreen ? (
          <svg
            width="1.5rem"
            height="1.5rem"
            viewBox="-10 0 30 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
              fill={colors.secondary}
            />
          </svg>
        ) : (
          <></>
        )}
      </Title>
</Button>
<Collapse in={open|| !isSmallScreen}>
      <StyledList>
        
        {attractions.map((attraction) => (
          <StyledListItem key={attraction.id}>
            {isAuthenticated && role === "admin" && isManaging ? (
              <>
                <StyledTextField
                  value={editedAttractions[attraction.id] || attraction.name}
                  onChange={(e) =>
                    handleInputChange(attraction.id, e.target.value)
                  }
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
                <StyledListItemText primary={attraction.name} />
              </Button>
            )}
          </StyledListItem>
        ))}
      </StyledList>
      </Collapse>
    </>
  );
};

export default AttractionsList;
