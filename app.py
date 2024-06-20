from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

tasks = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    # Simulação de autenticação
    if username == 'admin' and password == 'password':
        return jsonify(success=True)
    else:
        return jsonify(success=False, message='Usuário ou senha inválidos')

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'GET':
        return jsonify(tasks)
    if request.method == 'POST':
        data = request.get_json()
        task = {'description': data.get('description')}
        tasks.append(task)
        return jsonify(task), 201

if __name__ == '__main__':
    app.run(debug=True)
