import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Button } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';
import styled from "@emotion/styled";
import { colors, sizes } from "../Styles/Themes";
import { Title, Body } from '../Styles/Typography';

const StyledAppBar = styled(AppBar)`
  background-color: ${colors.primary};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 500;
  height: ${sizes.navbarHeight};
`;

const Navbar = () => {
  const { isAuthenticated, logout, user, role, updateUser, username } = useAuth();
  const location = useLocation();
  const currentUrl = location.pathname + location.search;

  const handleRedirectWithReturnUrl = (route: string) => {
    navigate(route, { state: { returnUrl: currentUrl } });
  };

  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await api.get('/api/logout');
      updateUser(null);
      logout();
      navigate('/');
    } catch (error) {
      alert('Error logging out');
    }
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Button component={Link} to="/" color="inherit">
          <Title>
            Atrakcje Dolnego Śląska
          </Title>

        </Button>

        {isAuthenticated && (
          <Body big>
            Witaj {username}!
          </Body>
        )}

        {isAuthenticated && (
          <Button onClick={() => handleRedirectWithReturnUrl('/new_attraction')} color="inherit">
            <Body big>

              Dodaj atrakcję
            </Body>

          </Button>
        )}

        {isAuthenticated && role === "admin" ? (
          <Button onClick={() => handleRedirectWithReturnUrl('/new_challenge')} color="inherit">
            <Body big>

              Dodaj wyzwanie
            </Body>

          </Button>
        ) : (
          <Button component={Link} to="/challenges" color="inherit">
            <Body big>
              Wyzwania
            </Body>
          </Button>
        )}

        <Button component={Link} to="/route_planner" color="inherit">
          <Body big>

            Trasy
          </Body>

        </Button>

        {isAuthenticated && user ? (
          <Button onClick={onLogout} color="inherit">
            <Body big>

              Wyloguj
            </Body>

          </Button>
        ) : (
          <Button color="inherit" onClick={() => handleRedirectWithReturnUrl('/login')}>
            <Body big>

              Zaloguj
            </Body>

          </Button>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar;
