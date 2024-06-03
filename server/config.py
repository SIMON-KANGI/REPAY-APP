from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import secrets
db = SQLAlchemy()
migrate=Migrate()
bcrypt=Bcrypt()
# secret_key=secrets.token_urlsafe(32)
# print(secret_key)

def create_app():
    app = Flask(__name__)
    CORS(app,supports_credentials=True)
    app.config['SECRET_KEY']='v3DqpM9dN_IhDaD0zNrPybgwgoF5zQnx0NNPXZfZvVQ'#secret key
    app.config['JWT_SECRET_KEY']='1TZTcxUSuWa_D1afcqD4c9soQdR3ogR3BkPT9vZFUxY'#secret key
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 600
    app.config["SQLALCHEMY_DATABASE_URI"]='sqlite:///repay.db'
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    jwt=JWTManager(app) #create a jwt token


    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app) #attach a jwt token to the app
    migrate.init_app(app,db)
    
    return app
