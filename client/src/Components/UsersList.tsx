import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { UserWithLogin } from "../types";
import { Title, bodyMixin } from "../Styles/Typography";
import { shadows , colors} from "../Styles/Themes";
interface UsersListProps {
  users: UserWithLogin[];
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

const UsersList: React.FC<UsersListProps> = ({ users }) => {
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
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default UsersList;
