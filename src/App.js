import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Register from './components/Register';
import Login from './components/Login';
import TaskManager from './components/TaskManager';
import './App.css';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState('');

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
      setUser(response.data.name); // Ajuste conforme o campo de nome do usuário na resposta
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    handleClose();
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        {token && (
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Task Manager
              </Typography>
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {user}
                  </Typography>
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
                  <MenuItem onClick={handleLogout}>Sair</MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
        )}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} fetchUser={fetchUser} />} />
          <Route path="/tasks" element={token ? <TaskManager token={token} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? "/tasks" : "/login"} />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
