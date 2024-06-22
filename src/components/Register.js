import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Alert, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ handleRegisterSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password, email });

      if (response.status === 201) {
        console.log(response.data);
        handleRegisterSuccess(); // Trigger Snackbar
        setShowError('');
        navigate('/login');
      }

    } catch (error) {
      if (error.response && error.response.status === 409) {
        setShowError(error.response.data.message);
      } else {
        console.error('Register error:', error);
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, padding: 4, backgroundColor: '#ffffff' }}>
        <Typography variant="h4" gutterBottom>
          Registrar novo usuário
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome de usuário"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            variant="outlined"
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Cadastre-se
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Voltar
          </Button>
        </form>
        {showError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {showError}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default Register;
