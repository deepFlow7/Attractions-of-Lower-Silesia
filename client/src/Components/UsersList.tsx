import React from "react";
import styled from "@emotion/styled";
import { List, ListItem, ListItemText, Typography, Button } from "@mui/material";

import { UserWithLogin } from "../types";
import { useAuth } from "../Providers/AuthContext";
import { Title, bodyMixin } from "../Styles/Typography";
import { shadows } from "../Styles/Themes";
import { StyledButton } from "../Styles/Button";
import { useColors, ContrastProps } from '../Providers/Colors'; 
import { Contrast } from "@mui/icons-material";

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

const StyledPrimaryTypography = styled(Typography)<ContrastProps>`
   ${({ colors }) => bodyMixin(colors)} 
  color: ${props => props.colors.gray};
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
  const { toggleTheme, colors } = useColors();

  return (
    <StyledList>
      <Title colors={colors}>Użytkownicy</Title>
      {users.map((user, index) => (
        <StyledListItem key={index}>
          <ListItemText
            primary={
              <StyledPrimaryTypography colors={colors}>
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
            <StyledButton colors={colors} 
              color={isUserBlocked(user.id) ? "secondary" : "primary"}
              onClick={() => changeUserBlock?.(user.id)}
            >
              {isUserBlocked(user.id) ? "Odblokuj" : "Zablokuj"}
            </StyledButton>
          )}
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default UsersList;
