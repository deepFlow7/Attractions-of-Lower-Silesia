/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Typography } from '@mui/material';
import api from '../API/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthContext';
import { NewUser } from '../types';
import StyledTextField from '../Styles/TextField';
import { InputContainer } from '../Styles/TextField';
import { StyledButton } from '../Styles/Button';
import { Title } from '../Styles/Typography';
import { FormContainer, FormContent } from '../Styles/Form';



const Registration = () => {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [registerError, setRegisterError] = useState<string>('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
    if (!mail) newErrors.mail = 'Adres email jest wymagany';
    else if (!emailPattern.test(mail)) newErrors.mail = 'Podaj poprawny adres email';

    if (!password) newErrors.password = 'Hasło jest wymagane';
    else if (!passwordPattern.test(password)) newErrors.password = 'Hasło musi mieć co najmniej 8 znaków i zawierać co najmniej jedną wielką literę, jedną małą literę, jedną cyfrę oraz jeden znak specjalny';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onRegister = (newUser: NewUser): Promise<boolean> => {
    return api.post('/api/signup', { newUser })
      .then(response => {
        return response.data.success;
      })
      .catch(error => {
        console.error('There was an error sending the data!', error);
        return false;
      });
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

    const success = await onRegister(newUser);

    if (success) {
      setName('');
      setSurname('');
      setLogin('');
      setMail('');
      setPassword('');
      alert("Pomyślnie zarejestrowano użytkownika.")
      navigate('/login');
    } else {
      setRegisterError('Użytkownik o tym loginie lub adresie email już istnieje');
    }
  };

  return (
    <FormContainer>
      <Title>Rejestracja</Title>
      {registerError && (
        <Typography color="error" style={{ marginBottom: '1rem' }}>{registerError}</Typography>
      )}
      <FormContent>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Imię"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Nazwisko"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            error={!!errors.surname}
            helperText={errors.surname}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            error={!!errors.login}
            helperText={errors.login}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Adres e-mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            error={!!errors.mail}
            helperText={errors.mail}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField
            fullWidth
            label="Hasło"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
        </InputContainer>
        <StyledButton onClick={handleSubmit} fullWidth>
          Zarejestruj się
        </StyledButton>
      </FormContent>
    </FormContainer>
  );
};

export default Registration;
