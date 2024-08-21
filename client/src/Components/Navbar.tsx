import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';

const Navbar = () => {
    const {isAuthenticated,logout, user, role, updateUser, username, isBlocked} = useAuth();
    const location = useLocation();
    const currentUrl = location.pathname + location.search; 

    const handleRedirectWithReturnUrl = (route : string) => {
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
    
    const handleRedirectToNewAttraction = () => {
      if (isBlocked) {
        alert("Twoje konto jest zablokowane, nie możesz dodawać atrakcji.")
        return;
      }
      handleRedirectWithReturnUrl('/new_attraction');
    }
    
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
        <Button onClick={handleRedirectToNewAttraction} color="inherit">
          Dodaj atrakcję
        </Button> 
      )}

      {isAuthenticated && role == "admin" ? (
        <Button onClick={() => handleRedirectWithReturnUrl('/new_challenge')} color="inherit">
            Dodaj wyzwanie
        </Button>  
      ) : (
        <Button component={Link} to="/challenges" color="inherit">
          Wyzwania
        </Button>
      )}

        <Button component={Link} to="/route_planner" color="inherit">
            Trasy
        </Button>
        
        {isAuthenticated && user?
            (
              <Button onClick={onLogout} color="inherit">
                  Wyloguj
              </Button>  
        ) : (
              <Button color="inherit" onClick={() => handleRedirectWithReturnUrl('/login')}>
                Zaloguj
              </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
