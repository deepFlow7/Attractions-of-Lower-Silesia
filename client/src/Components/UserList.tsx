import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import styled from "@emotion/styled";

interface UsersListProps {
  users: string[];
}

// Styled components
const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

const StyledListItem = styled(ListItem)`
  &:nth-of-type(odd) {
    background-color: #f0f0f0;
  }
  &:hover {
    background-color: #d0d0d0;
  }
`;

const Title = styled(Typography)`
  font-weight: bold;
`;

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  return (
    <StyledList>
      <Title variant="h5" gutterBottom>
        Lista Użytkowników
      </Title>
      {users.map((user, index) => (
        <StyledListItem key={index}>
          <ListItemText primary={user} />
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default UsersList;
