/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { useAuth } from '../Providers/AuthContext';
import StyledTextField from '../Styles/TextField';
import { InputContainer } from '../Styles/TextField';
import { StyledButton} from '../Styles/Button';
import { Title } from '../Styles/Typography';
import styled from '@emotion/styled';
import { FormContainer, FormContent } from '../Styles/Form';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      if (returnUrl) {
        navigate(returnUrl);
      } else {
        navigate('/');
      }
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 400) {
        alert('Błędne hasło lub nieznany użytkownik');
      } else {
        alert('Błąd serwera, odczekaj chwilę i spróbuj ponownie');
      }
    }
  };

  return (
    <FormContainer>
      <FormContent>
      <Title>Logowanie</Title>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Hasło"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputContainer>
        <StyledButton onClick={handleSubmit} fullWidth>
          Zaloguj się
        </StyledButton>
        <Button component={Link} to="/signup" fullWidth>
      Zarejestruj
    </Button>
      </FormContent>
    </FormContainer>
  );
};

export default LoginForm;
