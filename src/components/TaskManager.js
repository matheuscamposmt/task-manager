import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Modal, Box, IconButton, MenuItem, Select, InputLabel, FormControl, Alert,
} from '@mui/material';
import { Add, Edit, Delete, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import './TaskManager.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TaskManager = ({ token, selectedGroup }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', assigned_to: '', status: 'todo' });
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '', open: false });

  useEffect(() => {
    if (selectedGroup) {
      fetchTasks(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchTasks = async () => {
    if (!selectedGroup)
      return;
    try {
      const response = await axios.get(`http://localhost:5000/tasks?group_id=${selectedGroup}`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      console.log(selectedGroup);
      const response = await axios.post('http://localhost:5000/tasks', { ...newTask, group_id: selectedGroup }, { headers: { Authorization: `Bearer ${token}` } });
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', deadline: '', assigned_to: '', status: 'todo' });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
      setAlert({ type: 'success', message: 'Tarefa atualizada com sucesso!', open: true });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Falha ao atualizar tarefa.', open: true });
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(tasks.filter(task => task.id !== id));
      setAlert({ type: 'success', message: 'Tarefa excluída com sucesso!', open: true });
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Falha ao excluir tarefa.', open: true });
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
      setAlert({ type: 'success', message: 'Status da tarefa atualizado com sucesso!', open: true });
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Falha ao atualizar o status da tarefa.', open: true });
    }
  };

  const filteredTasks = tasks.filter(task => filter !== "all" ? task.status === filter : true);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {alert.open && (
          <Alert severity={alert.type} onClose={() => setAlert({ ...alert, open: false })}>
            {alert.message}
          </Alert>
        )}

        <div className="task-manager-header">

          <Button variant="contained" color="success" startIcon={<Add />} onClick={() => setIsModalOpen(true)}>
            Nova Tarefa
          </Button>
          <FormControl variant="outlined">
            <InputLabel>Filtro</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">
                <em>Todos</em>
              </MenuItem>
              <MenuItem value="todo">To-do</MenuItem>
              <MenuItem value="in_progress">Em Progresso</MenuItem>
              <MenuItem value="completed">Concluída</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={style}>
            <h2 id="modal-title">Criar Tarefa</h2>
            <form onSubmit={handleCreateTask}>
              <TextField
                label="Título"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <TextField
                label="Descrição"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                required
              />
              <TextField
                label="Prazo"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Responsável"
                variant="outlined"
                fullWidth
                margin="normal"
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Adicionar Tarefa
              </Button>
              <Button color="error" fullWidth onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
            </form>
          </Box>
        </Modal>
        <Modal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          aria-labelledby="edit-modal-title"
          aria-describedby="edit-modal-description"
        >
          <Box sx={style}>
            <h2 id="edit-modal-title">Editar Tarefa</h2>
            {editTask && (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateTask(editTask.id, editTask); }}>
                <TextField
                  label="Título"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  required
                />
                <TextField
                  label="Descrição"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                  required
                />
                <TextField
                  label="Prazo"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={editTask.deadline}
                  onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="Responsável"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={editTask.assigned_to}
                  onChange={(e) => setEditTask({ ...editTask, assigned_to: e.target.value })}
                  required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Atualizar Tarefa
                </Button>
                <Button color="secondary" fullWidth onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
              </form>
            )}
          </Box>
        </Modal>
        <TableContainer component={Paper} className="task-list">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Prazo</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.assigned_to}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <Select
                        value={task.status}
                        onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                      >
                        <MenuItem value="todo">To-do</MenuItem>
                        <MenuItem value="in_progress">Em Progresso</MenuItem>
                        <MenuItem value="completed">Concluída</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => { setEditTask(task); setIsEditModalOpen(true); }}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TaskManager;
