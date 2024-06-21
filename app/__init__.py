from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, template_folder='templates')
    CORS(app, supports_credentials=True)
    app.config.from_object('app.config.Config')

    db.init_app(app)

    migrate.init_app(app, db)
    jwt.init_app(app)

    from app import models
   
    with app.app_context():
        db.create_all()

    from . import routes
    app.register_blueprint(routes.bp)

    return app
