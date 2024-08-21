import React from "react";
import { List, ListItem, ListItemText, Typography, Button } from "@mui/material";
import styled from "@emotion/styled";
import {UserWithLogin} from "../types";
import { useAuth } from "../Providers/AuthContext";

interface UsersListProps {
  users: UserWithLogin[];
  isManaging?: boolean;
  changeUserBlock?: (id : number) => void;
  blockedUsers? : number [];
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

const UsersList: React.FC<UsersListProps> = ({ users, isManaging, changeUserBlock, blockedUsers }) => {
  const { isAuthenticated, role } = useAuth();
  const isUserBlocked = (id: number) => {
    return blockedUsers?.includes(id);
  };

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
          {isAuthenticated && role === 'admin' && isManaging && (
            <Button
              variant="contained"
              color={isUserBlocked(user.id) ? "secondary" : "primary"}
              onClick={() => changeUserBlock!(user.id)}
            >
              {isUserBlocked(user.id) ? "Odblokuj" : "Zablokuj"}
            </Button>
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default UsersList;
