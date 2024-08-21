/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React, { useState } from 'react';
import api from '../API/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Providers/AuthContext';
import { User } from '../types';
import { ViewContainer } from '../Styles/View';
import StyledTextField from '../Styles/TextField';
import { InputContainer} from '../Styles/TextField';

import { StyledButton } from '../Styles/Button';
import {Title} from '../Styles/Typography';
import { Grid, Typography, TextField, Button } from '@mui/material';

const FormContainer = styled(ViewContainer)`
  display: flex; /* Ustawienie flexboxa */
  flex-direction: column; /* Układanie elementów w kolumnie */
  align-items: center; /* Wyśrodkowanie elementów wzdłuż osi X */
  & > * {
    width: 50vw;
    margin: 0 0;
    padding: 1rem;
    box-sizing: border-box;  /* Zapewnia, że border nie wpływa na rozmiar elementu */
  }
`;


const LoginForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(username, password);
      if (returnUrl)
        navigate(returnUrl);
      else
        navigate('/');
    } catch (error: any) {
      var status = error.response.status;
      if (status == 400) {
        alert("błędne hasło lub nieznany użytkownik");
      } else {
        alert("błąd serwera, odczekaj chwilę i spróbuj ponownie");
      }
    }
  };

  return (
    <FormContainer>
      <Title>Logowanie</Title>
      <InputContainer>
      <StyledTextField fullWidth label="Login" value={username} onChange={(e) => setUsername(e.target.value)} />
      </InputContainer><InputContainer>
      <StyledTextField fullWidth label="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </InputContainer>
      <StyledButton variant="contained" color="primary" onClick={handleSubmit} fullWidth>Zaloguj się</StyledButton>
      <Button component={Link} to='/signup' variant="contained" color="secondary" fullWidth>Zarejestruj</Button>
    </FormContainer>
  );
};

export default LoginForm;
