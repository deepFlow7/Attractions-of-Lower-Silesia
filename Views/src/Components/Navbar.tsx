import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Button, InputBase } from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Atrakcje Dolnego Śląska
        </Typography>
        <InputBase
          placeholder="Wyszukaj..."
          inputProps={{ 'aria-label': 'search' }}
          startAdornment={
            <IconButton sx={{ p: 0 }} disabled aria-label="search">
              <SearchIcon />
            </IconButton>
          }
          sx={{ mr: 2, flexGrow: 1 }}
        />
        <Button color="inherit">Wyzwanie</Button>
        <IconButton color="inherit">
          <SettingsIcon />
        </IconButton>
        <IconButton color="inherit">
          <ThumbUpAltIcon />
        </IconButton>
        <IconButton color="inherit">
          <EmojiObjectsIcon />
        </IconButton>
        <Button color="inherit">Zaloguj</Button> {/* Dodajemy przycisk logowania */}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
