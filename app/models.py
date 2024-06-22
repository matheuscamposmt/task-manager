from . import db
from datetime import datetime

# Association table for many-to-many relationship between users and groups
user_groups = db.Table('user_groups',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('group.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    groups = db.relationship('Group', secondary=user_groups, back_populates='users')

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    users = db.relationship('User', secondary=user_groups, back_populates='groups')
    tasks = db.relationship('Task', backref='group', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='todo')
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'))
    deadline = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'group_id': self.group_id,
            'assigned_to': self.assigned_to,
            'deadline': self.deadline.strftime('%d/%m/%Y') if self.deadline else None,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
