/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../API/api';
import { useAuth } from '../Providers/AuthContext';
import { useColors } from '../Providers/Colors';
import { StyledButton } from '../Styles/Button';
import { FormContainer, FormContent } from '../Styles/Form';
import StyledTextField, { InputContainer } from '../Styles/TextField';
import { Title } from '../Styles/Typography';
import { NewUser } from '../types';

const Squeeze = styled.div`
  margin-bottom: -1rem;
`;
const Registration: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [registerError, setRegisterError] = useState<string>('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { colors } = useColors();

  if (isAuthenticated) navigate('/');

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^(?=.*[\p{Lowercase_Letter}])(?=.*[\p{Uppercase_Letter}])(?=.*\d)(?=.*[\W])[\p{Lowercase_Letter}\p{Uppercase_Letter}\d\W]{8,}$/u;
  const nameSurnamePattern = /^[\p{Letter}\s-]+$/u;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = 'Imię jest wymagane';
    else if (!nameSurnamePattern.test(name)) newErrors.name = 'Imię może zawierać tylko litery, spacje i myślniki';

    if (!surname) newErrors.surname = 'Nazwisko jest wymagane';
    else if (!nameSurnamePattern.test(surname)) newErrors.surname = 'Nazwisko może zawierać tylko litery, spacje i myślniki';

    if (!login) newErrors.login = 'Login jest wymagany';

    if (!mail) newErrors.mail = 'Adres e-mail jest wymagany';
    else if (!emailPattern.test(mail)) newErrors.mail = 'Podaj poprawny adres e-mail';

    if (!password) newErrors.password = 'Hasło jest wymagane';
    else if (!passwordPattern.test(password)) newErrors.password = 'co najmniej 8 znaków, wielką i małą literę, cyfrę i znak specjalny';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async (newUser: NewUser): Promise<boolean> => {
    try {
      const response = await api.post('/api/user/signup', { newUser });
      return response.data.success;
    } catch (error) {
      console.error('There was an error sending the data!', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    setRegisterError('');
    if (!validate()) return;

    const newUser: NewUser = {
      name,
      surname,
      mail,
      login,
      password
    };

    const success = await registerUser(newUser);

    if (success) {
      setName('');
      setSurname('');
      setLogin('');
      setMail('');
      setPassword('');
      alert("Pomyślnie zarejestrowano użytkownika.")
      navigate('/login');
    } else {
      setRegisterError('Użytkownik o tym loginie lub adresie e-mail już istnieje');
    }
  };

  return (
    <FormContainer colors={colors}>
      {registerError && (
        <Typography color="error" style={{ marginBottom: '1rem' }}>{registerError}</Typography>
      )}


      <FormContent>
        <Squeeze>
          <Title colors={colors}>Rejestracja</Title>
        </Squeeze>
        <InputContainer>
          <StyledTextField colors={colors} slim
            fullWidth
            label="Imię"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField colors={colors} slim
            fullWidth
            label="Nazwisko"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            error={!!errors.surname}
            helperText={errors.surname}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField colors={colors} slim
            fullWidth
            label="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            error={!!errors.login}
            helperText={errors.login}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField colors={colors} slim
            fullWidth
            label="Adres e-mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            error={!!errors.mail}
            helperText={errors.mail}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField colors={colors} slim
            fullWidth
            label="Hasło"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
        </InputContainer>
        <StyledButton colors={colors} onClick={handleSubmit} fullWidth>
          Zarejestruj się
        </StyledButton>
      </FormContent>
    </FormContainer>
  );
};

export default Registration;
