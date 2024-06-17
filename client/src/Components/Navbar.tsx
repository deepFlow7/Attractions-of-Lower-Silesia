import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Button, InputBase } from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Providers/AuthContext';
import { useSearch } from '../Providers/SearchContext';



const Navbar = () => {
    const {isAuthenticated,logout, user, updateUser} = useAuth();
    const {search, setSearch} = useSearch();

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


    const onChange = (event:React.ChangeEvent) => {
        setSearch(event.target.value);
    }
    

    

    
  return (
    <AppBar className='navbar' position="static">
      <Toolbar>
        <Typography  variant="h2" component="div" sx={{ flexGrow: 1 }}>
            <Button component={Link} to="/" color="inherit">
                    Atrakcje Dolnego Śląska
            </Button>
        </Typography>
        <InputBase
          placeholder="Wyszukaj..."
          inputProps={{ 'aria-label': 'search' }}
          onChange={onChange}
          startAdornment={
            <IconButton sx={{ p: 0 }} disabled aria-label="search" >
              <SearchIcon />
            </IconButton>
          }
          sx={{ mr: 2, flexGrow: 1 }}
        />

        
        <Button component={Link} to="/challenges" color="inherit">
            Wyzwanie
        </Button>
        <IconButton color="inherit">
          <SettingsIcon />
        </IconButton>
        <IconButton color="inherit">
          <ThumbUpAltIcon />
        </IconButton>
        <IconButton color="inherit">
          <EmojiObjectsIcon />
        </IconButton>
        {isAuthenticated?
            (
                <>
                    <Typography  variant="h6" component="div">
                        {user!.name}
                    </Typography>

                    <Button onClick={onLogout} color="inherit">
                        Wyloguj
                    </Button> 
                
                </>
        ) : (
                <>
                    <Button component={Link} to='login' color="inherit">
                        Zaloguj
                    </Button>     
                </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
