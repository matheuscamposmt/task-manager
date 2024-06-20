document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
});

document.getElementById('addTaskButton').addEventListener('click', function() {
    addTask();
});

function login() {
    // Implementar a lógica de login
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Exemplo de chamada à API
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('tasks').style.display = 'block';
            loadTasks();
        } else {
            alert('Login falhou: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
}

function loadTasks() {
    // Implementar a lógica para carregar as tarefas
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.description;
                taskList.appendChild(li);
            });
        });
}

function addTask() {
    const taskDescription = prompt('Descrição da tarefa:');
    if (taskDescription) {
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: taskDescription }),
        })
        .then(response => response.json())
        .then(task => {
            const taskList = document.getElementById('taskList');
            const li = document.createElement('li');
            li.textContent = task.description;
            taskList.appendChild(li);
        });
    }
}
