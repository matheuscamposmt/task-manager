import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Snackbar, Slide, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Modal, TextField
} from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, AccountCircle } from '@mui/icons-material';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
      fetchGroups(storedToken);
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

  const fetchGroups = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/groups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data);

      if (response.data.length > 0) setSelectedGroup(response.data[0].id);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleJoinGroup = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/join_group',
        { group_id: newGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroups([...groups, response.data]);
      setSelectedGroup(response.data.id);
      toggleSidebar();
      setNewGroupName('');
      setIsJoinGroupModalOpen(false);
      setSnackbarSeverity('success');
      setSnackbarMessage('Grupo criado com sucesso');
      setShowSnackbar(true);
      //close sidebar
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Erro ao criar grupo');
      setShowSnackbar(true);
      console.error(error);
    }
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
          severity={snackbarSeverity}
          TransitionComponent={SlideTransition}
        />
        <AppBar position="fixed" style={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
          <Toolbar>
            {token? (
              <IconButton edge="start" color="primary" aria-label="menu" onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>
            ) : null}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="primary">
                <Box display="flex" alignItems="center">
                  <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={logo} alt="Logo" style={{ maxHeight: 40, marginRight: 10, marginTop: 9 }} />
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
                  <AccountCircle />
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
        <Drawer variant="persistent" anchor="left" open={isSidebarOpen}>
          <div>
            <IconButton onClick={toggleSidebar} >
              <ChevronLeftIcon/>
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setIsJoinGroupModalOpen(true)}>
                <Button variant="contained" color="primary" fullWidth>
                  Entrar em Novo Grupo
                </Button>
              </ListItemButton>
            </ListItem>
            {groups.map((group) => (
              <ListItem key={group.id} disablePadding>
                <ListItemButton onClick={() => setSelectedGroup(group.id)}>
                  <ListItemText primary={group.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Routes>
            <Route path="/register" element={<Register handleRegisterSuccess={handleRegisterSuccess} />} />
            <Route path="/login" element={<Login setToken={setToken} fetchUser={fetchUser} />} />
            <Route path="/tasks" element={token ? <TaskManager token={token} selectedGroup={selectedGroup} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Home isAuthenticated={token} />} />
          </Routes>
        </Box>
        <Modal open={isJoinGroupModalOpen} onClose={() => setIsJoinGroupModalOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Entrar em Novo Grupo
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Código do grupo"
              type="text"
              fullWidth
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Button onClick={handleJoinGroup} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Entrar
            </Button>
          </Box>
        </Modal>
      </Box>
    </Router>
  );
};

export default App;
