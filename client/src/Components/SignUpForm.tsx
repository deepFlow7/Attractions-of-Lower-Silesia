import React, { useState } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { User } from '../types';
import styled from '@emotion/styled';

const FormContainer = styled.div`
  max-width: 400px;
  margin: 5% auto; 
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

interface RegistrationProps {
  onRegister: (user: User) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 1,
      name,
      surname,
      mail
    };
    onRegister(newUser);
    // Clear form fields
    setName('');
    setSurname('');
    setMail('');
    setPassword('');
  };

  return (
    <FormContainer>
      <Typography variant="h4" gutterBottom>Rejestracja</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Imię" value={name} onChange={(e) => setName(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Nazwisko" value={surname} onChange={(e) => setSurname(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Adres e-mail" value={mail} onChange={(e) => setMail(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Zarejestruj się</Button>
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default Registration;
