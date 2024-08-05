# auth.py
from flask import Blueprint, jsonify, request, make_response, session, url_for, redirect
from flask_restful import Api, Resource
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from authlib.integrations.flask_client import OAuth
from models import User
from config import create_app, db
from dotenv import load_dotenv
import os

app = create_app()
api = Api(app)
load_dotenv()

auth_blueprint = Blueprint('auth', __name__, url_prefix='/auth')
api = Api(auth_blueprint)
# Initialize OAuth
oauth = OAuth()
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    client_kwargs={'scope': 'openid profile email'}
)



@auth_blueprint.route('/login/google')
def login_google():
    redirect_uri = url_for('auth.authorized', _external=True)
    return google.authorize_redirect(redirect_uri)

class GoogleLogin(Resource):
    def get(self):
        token = google.authorize_access_token()
        user_info = google.parse_id_token(token)
        email = user_info['email']
        username = user_info['name']
        
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(username=username, email=email)
            db.session.add(user)
            db.session.commit()

        access_token = create_access_token(identity={"email": user.email, "role": user.role, "id": user.id})
        refresh_token = create_refresh_token(identity={"email": user.email, "role": user.role, "id": user.id})

        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        })

    def post(self):
        access_token = request.json.get('access_token')
        if access_token:
            nonce = session.get('nonce')
            if nonce:
                user_info = google.parse_id_token(access_token, nonce=nonce)
                email = user_info['email']
                user = User.query.filter_by(email=email).first()
                if user:
                    access_token = create_access_token(identity={"email": user.email, "role": user.role, "id": user.id})
                    refresh_token = create_refresh_token(identity={"email": user.email, "role": user.role, "id": user.id})
                    return jsonify({
                        'access_token': access_token,
                        'refresh_token': refresh_token,
                        'user': user.to_dict()
                    }), 200
                return jsonify({'message': 'User not found'}), 404
            return jsonify({'message': 'Nonce not found'}), 400
        return jsonify({'message': 'Access token not provided'}), 400

api.add_resource(GoogleLogin, '/login/authorized')

class Login(Resource):
    def post(self):
        if request.content_type != 'application/json':
            return jsonify({"error": "Content-Type must be application/json"}), 415
        
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        app.logger.info(f"Recieved Data: email={email} ,password={password}")
        user = User.query.filter_by(email=email).first()
        
        try:
            if user and user.check_password(password):
                access_token = create_access_token(identity={"email": user.email,  'username':user.username, "role": user.role, "id": user.id, 'user': user.to_dict(),})
                refresh_token = create_refresh_token(identity={"email": user.email, "role": user.role, "id": user.id})
                data={
                    'access_token': access_token,
                   
                }
               
                if data:
                    
                    # response= make_response(jsonify(data), 200)
                    
                    return data
                
                else:
                    return jsonify({"error": "No user found"}), 404
            return jsonify({"message": "Invalid username or password"}), 401
        except Exception as e:
            print({"error": str(e)})
            return jsonify({"error": "An error occurred while processing your request"}), 500

api.add_resource(Login, '/login')

class UserToken(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return jsonify({'token': current_user}, 200)

api.add_resource(UserToken, '/user/token')

class Logout(Resource):
    @jwt_required()
    def delete(self):
        response = jsonify({'message': 'Successfully logged out'})
        unset_jwt_cookies(response)
        return response, 200

api.add_resource(Logout, '/logout')
