document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
});

document.getElementById('addTaskButton').addEventListener('click', function() {
    addTask();
});

function login() {
    // Implementar a lógica de login
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const base_url = 'http://localhost:5000';

    // Exemplo de chamada à API
    fetch(base_url+'/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({ email, password }),
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
    fetch(base_url+'/tasks')
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
        fetch(base_url+'/tasks', {
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
