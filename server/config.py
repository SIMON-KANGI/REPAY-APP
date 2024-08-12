from flask import Flask
import os
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
load_dotenv()  # Load environment variables from .env file

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})
    # resources={r"/*": {"origins": "http://localhost:8081"}}
    socketio = SocketIO(app, cors_allowed_origins="*")
    app.config['SECRET_KEY'] = 'v3DqpM9dN_IhDaD0zNrPybgwgoF5zQnx0NNPXZfZvVQ' # secret key
    app.config['JWT_SECRET_KEY'] = '1TZTcxUSuWa_D1afcqD4c9soQdR3ogR3BkPT9vZFUxY' # secret key
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 100000
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", 'sqlite:///repay.db')
    # print("Database URI:", app.config["SQLALCHEMY_DATABASE_URI"])
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    jwt = JWTManager(app)  # create a JWT token

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)  # attach a JWT token to the app
    migrate.init_app(app, db)
    
    return app
