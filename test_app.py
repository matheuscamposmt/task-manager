import os
import pytest
from app import create_app, db
from flask import json

@pytest.fixture
def app():
    os.environ['FLASK_ENV'] = 'testing'
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def register_user(client):
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    response = client.post('/register', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 201

def login_user(client):
    data = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    response = client.post('/login', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 200
    json_data = response.get_json()
    return json_data['access_token']

def test_register(client):
    register_user(client)

def test_login(client):
    register_user(client)
    token = login_user(client)
    assert token is not None

def test_create_task(client):
    register_user(client)
    token = login_user(client)
    data = {
        "title": "Test Task",
        "description": "This is a test task."
    }
    response = client.post('/tasks', data=json.dumps(data), content_type='application/json', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 201
    json_data = response.get_json()
    print(json_data)
    assert json_data['title'] == "Test Task"

def test_get_tasks(client):
    register_user(client)
    token = login_user(client)
    response = client.get('/tasks', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    json_data = response.get_json()
    assert isinstance(json_data, list)

def test_update_task(client):
    register_user(client)
    token = login_user(client)

    # First, create a task
    data = {
        "title": "Test Task",
        "description": "This is a test task."
    }
    response = client.post('/tasks', data=json.dumps(data), content_type='application/json', headers={'Authorization': f'Bearer {token}'})
    task_id = response.get_json()['id']

    # Then, update the task
    update_data = {
        "title": "Updated Task",
        "description": "This is an updated test task."
    }
    response = client.put(f'/tasks/{task_id}', data=json.dumps(update_data), content_type='application/json', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['title'] == "Updated Task"

def test_delete_task(client):
    register_user(client)
    token = login_user(client)

    # First, create a task
    data = {
        "title": "Test Task",
        "description": "This is a test task."
    }
    response = client.post('/tasks', data=json.dumps(data), content_type='application/json', headers={'Authorization': f'Bearer {token}'})
    task_id = response.get_json()['id']

    # Then, delete the task
    response = client.delete(f'/tasks/{task_id}', headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['message'] == "Task deleted"
