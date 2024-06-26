import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Alert, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setToken, fetchUser, fetchGroups }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false); // State for displaying error
  const navigate = useNavigate(); // Hook para navegação

  // navigate to /tasks if there is a token
  if (localStorage.getItem('token')) {
    navigate('/tasks'); // Redirecionar para a página de tarefas
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const token = response.data.access_token;
      localStorage.setItem('token', token); // Salva o token no localStorage
      setToken(token);
      await fetchUser(response.data.token);
      await fetchGroups(response.data.token);
      navigate('/tasks'); // Redirecionar para a página de tarefas
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setShowError(true); // Show the error alert
      } else {
        // Handle other errors if needed
        console.error('Login error:', error);
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, padding: 4, backgroundColor: '#ffffff' }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Login
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Registrar
          </Button>
        </form>
        {showError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Email ou senha inválidos. Por favor, tente novamente.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default Login;
