/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React, { useState } from 'react';
import api from '../API/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Providers/AuthContext';
import { User } from '../types';
import { ViewContainer } from '../Styles/View';
import StyledTextField from '../Styles/TextField';
import { InputContainer } from '../Styles/TextField';

import { StyledButton } from '../Styles/Button';
import { Title } from '../Styles/Typography';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { FormContainer, FormContent } from '../Styles/Form';


const LoginForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      setError('Nazwa użytkownika i hasło są wymagane!');
      return;
    }

    try {
      await login(username, password);
      if (returnUrl)
        navigate(returnUrl);
      else
        navigate('/');
    } catch (error: any) {
      var status = error.response.status;
      if (status == 401) {
        setError("Błędne hasło lub nieznany użytkownik");
        setUsername("");
        setPassword("");
      } else {
        alert("Błąd serwera, odczekaj chwilę i spróbuj ponownie");
      }
      return;
    }

    setError('');
  };

  return (
    <FormContainer>
      <Title>Logowanie</Title>
      <FormContent>
        <InputContainer>
          <StyledTextField fullWidth label="Login" value={username} onChange={(e) => setUsername(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <StyledTextField fullWidth label="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </InputContainer>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <StyledButton onClick={handleSubmit} fullWidth>Zaloguj się</StyledButton>
        <Button component={Link} to='/signup' fullWidth>Zarejestruj</Button>
      </FormContent>
    </FormContainer>
  );
};

export default LoginForm;
