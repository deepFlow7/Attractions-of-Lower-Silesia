import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
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
  z-index: 1001;
  height: ${sizes.navbarHeight};
`;

const Navbar = () => {
  const { isAuthenticated, isBlocked, logout, user, role, updateUser, username } = useAuth();
  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  const navigate = useNavigate();

  const handleRedirectWithReturnUrl = (route: string) => {
    navigate(route, { state: { returnUrl: currentUrl } });
  };

  const handleRedirectToNewAttraction = () => {
    if (isBlocked) {
      alert("Twoje konto jest zablokowane, nie możesz dodawać atrakcji.")
      return;
    }
    handleRedirectWithReturnUrl('/new_attraction');
  }

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

  // Sprawdzamy szerokość ekranu
  const isMobile = useMediaQuery('(max-width:1300px)');
  const isSmallScreen = useMediaQuery('(max-width:750px)');

  // Stan do zarządzania menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        {/* Lewa część - Tytuł */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Button component={Link} to="/" color="inherit">
            <Title>
              Atrakcje Dolnego Śląska
            </Title>
          </Button>
        </Box>

        {/* Środkowa część - Witaj */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          {isAuthenticated && !isSmallScreen && (
            <Body big gray>
              Witaj {username}!
            </Body>
          )}
        </Box>

        {/* Prawa część - Przyciski */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {isSmallScreen && isAuthenticated && (
                  <MenuItem onClick={handleMenuClose}>
                    Witaj {username}!
                  </MenuItem>
                )}
                {isAuthenticated && (
                  <MenuItem onClick={() => { handleRedirectToNewAttraction(); handleMenuClose(); }}>
                    Dodaj atrakcję
                  </MenuItem>
                )}
                {isAuthenticated && role === "admin" ? (
                  <MenuItem onClick={() => { handleRedirectWithReturnUrl('/new_challenge'); handleMenuClose(); }}>
                    Dodaj wyzwanie
                  </MenuItem>
                ) : (
                  <MenuItem component={Link} to="/challenges" onClick={handleMenuClose}>
                    Wyzwania
                  </MenuItem>
                )}
                <MenuItem component={Link} to="/route_planner" onClick={handleMenuClose}>
                  Trasy
                </MenuItem>
                {isAuthenticated && user ? (
                  <MenuItem onClick={() => { onLogout(); handleMenuClose(); }}>
                    Wyloguj
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => { handleRedirectWithReturnUrl('/login'); handleMenuClose(); }}>
                    Zaloguj
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              {isAuthenticated && (
                <Button onClick={() => handleRedirectToNewAttraction()} color="inherit">
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
                  <Body big secondary>
                    Zaloguj
                  </Body>
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar;
