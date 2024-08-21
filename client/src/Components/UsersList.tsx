import React from "react";
import { List, ListItem, ListItemText, Typography, Button } from "@mui/material";
import styled from "@emotion/styled";
import { UserWithLogin } from "../types";
import { Title, bodyMixin } from "../Styles/Typography";
import { shadows , colors} from "../Styles/Themes";
import { useAuth } from "../Providers/AuthContext";

interface UsersListProps {
  users: UserWithLogin[];
  isManaging?: boolean;
  changeUserBlock?: (id : number) => void;
  blockedUsers? : number [];
}
// Stylizacja Listy
const StyledList = styled(List)`
  border-radius: 8px;
  padding: 16px;
`;

// Stylizacja ListItem
const StyledListItem = styled(ListItem)`
  &:hover {
    text-shadow: ${shadows.active};
  }
`;

// Stylizacja Typography dla primary i secondary text
const StyledPrimaryTypography = styled(Typography)`
  ${bodyMixin} /* Zastosowanie mixin bodyMixin do primary */
  color: ${colors.gray};
`;

const StyledSecondaryTypography = styled(Typography)`
  ${bodyMixin} /* Zastosowanie mixin bodyMixin do secondary */
`;

const UsersList: React.FC<UsersListProps> = ({ users, isManaging, changeUserBlock, blockedUsers }) => {
  const { isAuthenticated, role } = useAuth();
  const isUserBlocked = (id: number) => {
    return blockedUsers?.includes(id);
  };

  return (
    <StyledList>
      <Title>
        Użytkownicy
      </Title>
      {users.map((user, index) => (
        <StyledListItem key={index}>
          <ListItemText
            primary={<StyledPrimaryTypography>{`${user.name} ${user.surname}`}</StyledPrimaryTypography>}
            secondary={<StyledSecondaryTypography>{`${user.login} ${user.mail}`}</StyledSecondaryTypography>}
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
