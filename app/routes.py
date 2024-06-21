from flask import Blueprint, jsonify, request, render_template
from . import db
from .models import User, Task
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import cross_origin

bp = Blueprint('api', __name__)

@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

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
    response.headers.add('Access-Control-Allow-Credentials', '*')
    print(response.headers)
    return response, 401

@bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=current_user_id).all()
    return jsonify([task.to_dict() for task in tasks])

@bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_task = Task(
        title=data['title'],
        description=data.get('description'),
        user_id=current_user_id
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user_id = get_jwt_identity()
    task = db.session.get(Task, task_id)

    if not task:
        return jsonify({"message": "Task not found"}), 404

    if task.user_id != current_user_id:
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
    task = db.session.get(Task, task_id)

    if not task:
        return jsonify({"message": "Task not found"}), 404

    if task.user_id != current_user_id:
        return jsonify({"message": "Permission denied"}), 403
    
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"})
