import React from "react";
import styled from "@emotion/styled";
import { List, ListItem, ListItemText, Typography, Button } from "@mui/material";

import { UserWithLogin } from "../types";
import { useAuth } from "../Providers/AuthContext";
import { Title, bodyMixin } from "../Styles/Typography";
import { shadows, colors } from "../Styles/Themes";

interface UsersListProps {
  users: UserWithLogin[];
  isManaging?: boolean;
  changeUserBlock?: (id: number) => void;
  blockedUsers?: number[];
}

const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

const StyledListItem = styled(ListItem)`
  &:hover {
    text-shadow: ${shadows.active};
  }
`;

const StyledPrimaryTypography = styled(Typography)`
  ${bodyMixin}
  color: ${colors.gray};
`;

const StyledSecondaryTypography = styled.span`
  ${bodyMixin}
`;

const UsersList: React.FC<UsersListProps> = ({
  users,
  isManaging,
  changeUserBlock,
  blockedUsers,
}) => {
  const { isAuthenticated, role } = useAuth();

  const isUserBlocked = (id: number) => {
    return blockedUsers?.includes(id);
  };

  return (
    <StyledList>
      <Title>Użytkownicy</Title>
      {users.map((user, index) => (
        <StyledListItem key={index}>
          <ListItemText
            primary={
              <StyledPrimaryTypography>
                {`${user.name} ${user.surname}`}
              </StyledPrimaryTypography>
            }
            secondary={
              <StyledSecondaryTypography>
                {`${user.login} ${user.mail}`}
              </StyledSecondaryTypography>
            }
          />
          {isAuthenticated && role === "admin" && isManaging && (
            <Button
              variant="contained"
              color={isUserBlocked(user.id) ? "secondary" : "primary"}
              onClick={() => changeUserBlock?.(user.id)}
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
