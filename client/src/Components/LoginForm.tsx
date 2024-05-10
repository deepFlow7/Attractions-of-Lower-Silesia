import React, { useState } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { Login } from '../types';

interface LoginProps {
  onLogin: (loginData: Login) => void;
}

const LoginForm: React.FC<LoginProps> = ({ onLogin }) => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    const loginData: Login = {
      user_id: 0, // temporary placeholder value
      login,
      password,
      role: 'user' // temporary placeholder value
    };
    onLogin(loginData);
    // Clear form fields
    setLogin('');
    setPassword('');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>Logowanie</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Login" value={login} onChange={(e) => setLogin(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Zaloguj się</Button>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
