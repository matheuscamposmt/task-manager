import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setToken, fetchUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      fetchUser(token); // Obtém os detalhes do usuário
      navigate('/tasks'); // Redirecionar para a página de tarefas
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        // use material-ui snackbar to show error message
        alert('Invalid email or password');

      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
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
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
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
      </Box>
    </Container>
  );
};

export default Login;
