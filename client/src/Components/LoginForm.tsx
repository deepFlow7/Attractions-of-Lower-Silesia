/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { Login } from '../types';

interface LoginProps {
  onLogin: (loginData: Login) => void;
}

const FormContainer = styled.div`
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin: 10% auto; /* Ustawienie góra/dół na 10%, a lewo/prawo na auto powoduje, że kontener jest wyśrodkowany poziomo */
  display: flex; /* Ustawienie flexboxa */
  flex-direction: column; /* Układanie elementów w kolumnie */
  align-items: center; /* Wyśrodkowanie elementów wzdłuż osi X */
`;


const Title = styled(Typography)`
  text-align: center;
  margin-bottom: 20px;
`;

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
    <FormContainer>
      <div>
        <Title variant="h4">Logowanie</Title>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Login" value={login} onChange={(e) => setLogin(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Zaloguj się</Button>
          </Grid>
        </Grid>
      </div>
    </FormContainer>
  );
};

export default LoginForm;
