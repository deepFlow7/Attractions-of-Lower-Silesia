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
import { colors, sizes } from '../Styles/Themes';
const LoginForm: React.FC = () => {
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
      if (returnUrl) {
        navigate(returnUrl);
      } else {
        navigate('/');
      }
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
      <FormContent>
      <Title>Logowanie</Title>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={false}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Hasło"
            type="password"
            value={password}
            error={false}

            onChange={(e) => setPassword(e.target.value)}
          />
        </InputContainer>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <StyledButton onClick={handleSubmit} fullWidth>
          Zaloguj się
        </StyledButton>
        <Button
  component={Link}
  to="/signup"
  style={{
    color: colors.tertiary,
    fontFamily: "'Englebert', sans-serif",
    textDecoration: 'none',
    fontSize: sizes.fontSize,
  }}
>
  Zarejestruj
</Button>

      </FormContent>
    </FormContainer>
  );
};

export default LoginForm;
