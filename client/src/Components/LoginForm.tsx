/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { User } from '../types';

interface LoginProps {
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

const LoginForm: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { isAuthenticated, login, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) =>  {
    e.preventDefault();
    try {
        await axios.post('/api/login', { login:username, password });
        const response = await axios.get('/api/profile');
        updateUser(response.data as User);
        login();
        navigate('/');
    } catch (error) {
        var status=error.response.status;
        if(status==400){
            alert("błędne hasło lub nieznany użytkownik");
        }else{
            alert("błąd serwera, odczekaj chwilę i spróbuj ponownie");
        }

    }
  };

  return (
    <FormContainer>
      <div>
        <Title variant="h4">Logowanie</Title>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Login" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Zaloguj się</Button>
          </Grid>

          <Grid item xs={12}>
            <Button  component={Link} to='/signup' variant="contained" color="secondary" fullWidth>Zarejestruj</Button>
          </Grid>

        </Grid>
      </div>
    </FormContainer>
  );
};

export default LoginForm;
