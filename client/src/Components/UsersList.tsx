import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import styled from "@emotion/styled";
import {UserWithLogin} from "../types";

interface UsersListProps {
  users: UserWithLogin[];
}

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
        Użytkownicy
      </Title>
      {users.map((user, index) => (
        <StyledListItem key={index}>
           <ListItemText
            primary={`${user.name} ${user.surname}`}
            secondary={`${user.login} ${user.mail}`}
          />
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default UsersList;
