import React, { useState } from 'react';

const Task = ({ task, handleStatusUpdate, handleUpdateTask, handleDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({ title: task.title, description: task.description });

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={updatedTask.title}
            onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
          />
          <textarea
            value={updatedTask.description}
            onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
          ></textarea>
          <button onClick={() => handleUpdateTask(task.id, updatedTask)}>Save</button>
        </div>
      ) : (
        <div className="task-content">
          <input type="checkbox" />
          <div className="task-info">
            <h3>{task.title}</h3>
            <p><strong>Prazo:</strong> {task.dueDate}</p>
            <p><strong>Responsável:</strong> {task.assignedTo}</p>
          </div>
        </div>
      )}
      <div className="task-actions">
        <button onClick={() => handleStatusUpdate(task.id, 'todo')}>To Do</button>
        <button onClick={() => handleStatusUpdate(task.id, 'in_progress')}>In Progress</button>
        <button onClick={() => handleStatusUpdate(task.id, 'completed')}>Completed</button>
        <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
      </div>
    </div>
  );
};

export default Task;
