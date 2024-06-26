import React from 'react';
import { Grid, Typography, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

// Import the logo correctly
import logo from './assets/logo.webp';

const HomePage = ({ isAuthenticated }) => {
  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>

      {/* Main Content */}
      <Grid item xs={12} textAlign="center" style={{ marginTop: 64 }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo ao app de gestão de tarefas colaborativo
        </Typography>
        <Typography variant="body1" gutterBottom>
          Gerencie suas tarefas de forma eficiente em grupos.
        </Typography>
        {/* Logo */}
        <Box mt={4} mb={4}>
          <img src={logo} alt="Logo" style={{ maxWidth: '30%', height: 'auto', borderRadius: 8 }} />
        </Box>
      </Grid>

      {isAuthenticated ? (
        <Grid item xs={12} textAlign="center">
            {/* Botão "Minhas Tarefas" */}
            <Button component={Link} to="/tasks" variant="contained" size="large" color="primary" style={{ textTransform: 'none', fontWeight: 'bold', padding: '12px 24px' }}>
                Minhas Tarefas
            </Button>
        </Grid>
      ) : (
        <Grid item xs={12} textAlign="center">
            {/* Botões de Registro */}
            <Button component={Link} to="/register" variant="contained" size="large" color="primary" style={{ textTransform: 'none', fontWeight: 'bold', padding: '12px 24px'}}>
                Fazer cadastro
            </Button>
        </Grid>
        )}

      {/* Footer with Authors Information */}
      <Grid item xs={12} textAlign="center" style={{ marginTop: 'auto', paddingBottom: 0 }}>
        <Paper elevation={3} style={{ padding: 20, backgroundColor: '#fff' }}>
          <Typography variant="body2" color="textSecondary">
            Desenvolvido por Matheus de Mattos e Douglas Souza
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HomePage;
