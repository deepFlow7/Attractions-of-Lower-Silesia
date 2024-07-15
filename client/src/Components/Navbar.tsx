import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import styled from '@emotion/styled';
import { useAuth } from '../Providers/AuthContext';

const Navbar = () => {
    const {isAuthenticated,logout, user, updateUser, username} = useAuth();
    const location = useLocation();
    const currentUrl = location.pathname + location.search; 

    const handleLoginClick = () => {
      navigate('/login', { state: { returnUrl: currentUrl } });
    };
    const navigate = useNavigate();

    const onLogout = async () => {
        try {
            await axios.get('/api/logout');
            updateUser(null);
            logout();
            navigate('/');
        } catch (error) {
            alert('Error logging out');
        }
    };
    
    
  return (
    <AppBar className='navbar' position="static">
      <Toolbar>
        <Typography  variant="h2" component="div" sx={{ flexGrow: 1 }}>
            <Button component={Link} to="/" color="inherit">
                    Atrakcje Dolnego Śląska
            </Button>
        </Typography>

        {isAuthenticated && (
          <Typography variant="h6" component="div" sx={{ mr: 2, flexGrow: 1 }}>
            Witaj {username}!
          </Typography>
        )}


      {isAuthenticated && (
        <Button component={Link} to="/new_attraction" color="inherit">
          Dodaj atrakcję
        </Button>
      )}
        <Button component={Link} to="/challenges" color="inherit">
            Wyzwania
        </Button>

        <Button component={Link} to="/route_planner" color="inherit">
            Trasy
        </Button>
        
        {isAuthenticated && user?
            (
              <Button onClick={onLogout} color="inherit">
                  Wyloguj
              </Button>  
        ) : (
              <Button color="inherit" onClick={handleLoginClick}>
                Zaloguj
              </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
