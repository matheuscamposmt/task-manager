from flask import Blueprint, jsonify, request, render_template
from . import db
from .models import User, Task, Group
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import cross_origin
from datetime import datetime

bp = Blueprint('api', __name__)

@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if the user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 409
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 409

    hashed_password = generate_password_hash(data['password'])
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
    db.session.add(new_user)

    # Automatically create a group for the new user
    new_group = Group(name=f"{new_user.username}'s Group")
    new_group.users.append(new_user)
    db.session.add(new_group)

    db.session.commit()

    return jsonify({"message": "User and group created successfully"}), 201

@bp.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.id)
        response = jsonify(access_token=access_token)
        response.headers.add('Access-Control-Allow-Credentials', '*')
        return response
    
    response = jsonify({"message": "Invalid credentials"})
    return response, 401

def is_user_in_group(user_id, group_id):
    group = Group.query.get(group_id)

    if group and any(user.id == user_id for user in group.users):
        return True
    return False

@bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user_id = get_jwt_identity()

    group_id = request.args.get('group_id')

    if not is_user_in_group(current_user_id, group_id):
        return jsonify({"message": "Permission denied"}), 403
    tasks = Task.query.filter_by(group_id=group_id).all()
    return jsonify([task.to_dict() for task in tasks])

@bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    group_id = data['group_id']
    if not is_user_in_group(current_user_id, group_id):
        return jsonify({"message": "Permission denied"}), 403
    new_task = Task(
        title=data['title'],
        description=data.get('description'),
        assigned_to=data.get('assigned_to'),
        deadline=datetime.strptime(data.get('deadline'), '%Y-%m-%d'),
        group_id=group_id
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    if not is_user_in_group(current_user_id, task.group_id):
        return jsonify({"message": "Permission denied"}), 403
    data = request.get_json()
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.status = data.get('status', task.status)
    db.session.commit()
    return jsonify(task.to_dict())

@bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    if not is_user_in_group(current_user_id, task.group_id):
        return jsonify({"message": "Permission denied"}), 403
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"})

@bp.route('/join_group', methods=['POST'])
@jwt_required()
def join_group():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    group_id = data.get('group_id')
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"message": "Group not found"}), 404
    user = User.query.get(current_user_id)
    group.users.append(user)
    db.session.commit()
    return jsonify({"message": "Successfully joined group!"}), 200

@bp.route('/user', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    response = jsonify({"username": user.username, "email": user.email})
    return response

# Route to get groups the user belongs to
@bp.route('/groups', methods=['GET'])
@jwt_required()
def get_groups():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    groups = user.groups
    return jsonify([{'id': group.id, 'name': group.name} for group in groups])

# Route to get tasks for a specific group
@bp.route('/groups/<int:group_id>/tasks', methods=['GET'])
@jwt_required()
def get_group_tasks(group_id):
    current_user_id = get_jwt_identity()
    if not is_user_in_group(current_user_id, group_id):
        return jsonify({"message": "Permission denied"}), 403
    tasks = Task.query.filter_by(group_id=group_id).all()
    return jsonify([task.to_dict() for task in tasks])
