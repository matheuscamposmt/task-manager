import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Snackbar, Slide, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Register from './components/Register';
import Home from './Home';
import Login from './components/Login';
import TaskManager from './components/TaskManager';
import './App.css';
import axios from 'axios';

import logo from './assets/logo.webp';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.username); // Adjust according to the user data structure
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleRegisterSuccess = () => {
    setSnackbarSeverity('success');
    setSnackbarMessage('Usuário registrado com sucesso');
    setShowSnackbar(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    handleClose();
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={showSnackbar}
          autoHideDuration={1000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          severity="success"
          TransitionComponent={SlideTransition}
        />
        <AppBar position="fixed" style={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="primary">
                  <Box display="flex" alignItems="center" >
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={logo} alt="Logo" style={{ maxHeight: 40, marginRight: 10, marginTop:9 }} />
                    </Link>

                    Gira
                  </Box>
              </Typography>
            </Box>
            {token ? (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="primary"
                >
                <Typography variant="body1" color="primary" style={{ marginRight: 10 }}>
                  {user}
                </Typography>
                <AccountCircle ></AccountCircle>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Perfil</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <div>
                <Button component={Link} to="/login" color="primary" sx={{ mr: 2 }}>
                  Login
                </Button>
                <Button component={Link} to="/register" color="primary">
                  Registrar
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/register" element={<Register handleRegisterSuccess={handleRegisterSuccess} />} />
          <Route path="/login" element={<Login setToken={setToken} fetchUser={fetchUser} />} />
          <Route path="/tasks" element={token ? <TaskManager token={token} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Home isAuthenticated={token}/>} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
