import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from "@emotion/styled";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, Box } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';
import { useColors, ContrastProps } from '../Providers/Colors';
import { sizes } from "../Styles/Themes";
import { Title, Body } from '../Styles/Typography';


const StyledAppBar = styled(AppBar)<ContrastProps>`
  background-color: ${props => props.colors.primary};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  height: ${sizes.navbarHeight};
`;

const StyledIconButton = styled(IconButton)<ContrastProps>`
  color: ${props => props.colors.secondary};
`;

const Navbar = () => {
  const { isAuthenticated, isBlocked, logout, user, role, updateUser, username } = useAuth();
  const { toggleTheme, colors } = useColors();
  const location = useLocation();
  const currentUrl = location.pathname + location.search;
  const navigate = useNavigate();

  const redirectWithReturnUrl = (route: string) => {
    navigate(route, { state: { returnUrl: currentUrl } });
  };

  const redirectToNewAttraction = () => {
    if (isBlocked) {
      alert("Twoje konto jest zablokowane, nie możesz dodawać atrakcji.");
      return;
    }
    redirectWithReturnUrl('/new_attraction');
  };

  const handleLogout = async () => {
    try {
      await api.get('/api/logout');
      updateUser(null);
      logout();
      navigate('/');
    } catch (error) {
      alert('Error logging out');
    }
  };

  const isMediumScreen = useMediaQuery('(max-width:1300px)');
  const isVerySmallScreen = useMediaQuery('(max-width:750px)');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static" colors={colors}>
      <Toolbar>
        
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Button component={Link} to="/" color="inherit">
            <Title colors={colors}>Atrakcje Dolnego Śląska</Title>
          </Button>
        </Box>


        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          {isAuthenticated && !isVerySmallScreen && (
            <Body colors={colors} big gray>Witaj {username}!</Body>
          )}
        </Box>
        <Button onClick={toggleTheme}>
        <svg fill={colors.dark as string} width="2rem" height="2rem" viewBox="0 4 40 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
<path d="M0 16q0 3.264 1.28 6.24t3.392 5.088 5.12 3.424 6.208 1.248q3.264 0 6.24-1.248t5.088-3.424 3.392-5.088 1.28-6.24-1.28-6.208-3.392-5.12-5.088-3.392-6.24-1.28q-3.264 0-6.208 1.28t-5.12 3.392-3.392 5.12-1.28 6.208zM4 16q0-3.264 1.6-6.016t4.384-4.352 6.016-1.632 6.016 1.632 4.384 4.352 1.6 6.016-1.6 6.048-4.384 4.352-6.016 1.6-6.016-1.6-4.384-4.352-1.6-6.048zM16 26.016q2.72 0 5.024-1.344t3.648-3.648 1.344-5.024-1.344-4.992-3.648-3.648-5.024-1.344v20z"></path>
</svg></Button>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {isMediumScreen ? (
            <>
              <StyledIconButton
               colors={colors}
                edge="end"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </StyledIconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {isVerySmallScreen && isAuthenticated && (
                  <MenuItem onClick={handleMenuClose}>Witaj {username}!</MenuItem>
                )}
                {isAuthenticated && (
                  <MenuItem onClick={() => { redirectToNewAttraction(); handleMenuClose(); }}>
                    Dodaj atrakcję
                  </MenuItem>
                )}
                {isAuthenticated && role === "admin" ? (
                  <MenuItem onClick={() => { redirectWithReturnUrl('/new_challenge'); handleMenuClose(); }}>
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
                  <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                    Wyloguj
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => { redirectWithReturnUrl('/login'); handleMenuClose(); }}>
                    Zaloguj
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              {isAuthenticated && (
                <Button onClick={redirectToNewAttraction} color="inherit">
                  <Body colors={colors} big>Dodaj atrakcję</Body>
                </Button>
              )}
              {isAuthenticated && role === "admin" ? (
                <Button onClick={() => redirectWithReturnUrl('/new_challenge')} color="inherit">
                  <Body  colors={colors}big>Dodaj wyzwanie</Body>
                </Button>
              ) : (
                <Button component={Link} to="/challenges" color="inherit">
                  <Body  colors={colors}big>Wyzwania</Body>
                </Button>
              )}
              <Button component={Link} to="/route_planner" color="inherit">
                <Body colors={colors} big>Trasy</Body>
              </Button>
              {isAuthenticated && user ? (
                <Button onClick={handleLogout} color="inherit">
                  <Body colors={colors} big>Wyloguj</Body>
                </Button>
              ) : (
                <Button color="inherit" onClick={() => redirectWithReturnUrl('/login')}>
                  <Body colors={colors} big secondary>Zaloguj</Body>
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
