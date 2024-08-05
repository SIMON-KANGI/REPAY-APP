from config import create_app, db
from flask_restful import Api, Resource
from flask import request, jsonify, make_response, session, url_for, redirect
from models import Transaction, Account, User, Notification, Location, Category,Contact,Invoice,Product
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies
import cloudinary
from cloudinary import uploader
import cloudinary.api
import os
import requests
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import Blueprint
load_dotenv()
app = create_app()
api = Api(app)

user_blueprint = Blueprint('user', __name__)
api = Api(user_blueprint)

api_url = 'https://n8jqr8.api.infobip.com/sms/2/text/advanced'
api_key = os.getenv('INFO_API_KEY')
cloudinary.config(
    cloud_name=os.getenv('CLOUD_NAME'),
    api_key=os.getenv('API_KEY'),
    api_secret=os.getenv('API_SECRET')
)
app.config['SEND_API_KEY'] = os.getenv('SEND_API_KEY')
if not all([cloudinary.config().cloud_name, cloudinary.config().api_key, cloudinary.config().api_secret]):
    raise ValueError("No Cloudinary configuration found. Ensure CLOUD_NAME, API_KEY, and API_SECRET are set.")
def send_welcome_email(email):
    message = Mail(
        from_email=('simonmwangikangi@gmail.com', 'REPAY'),
        to_emails=email,
        subject='Welcome to REPAY!',
        html_content='<strong>Thank you for signing up!</strong>'
    )
    try:
        sg = SendGridAPIClient(app.config['SEND_API_KEY'])
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e)

def send_welcome_sms(phone):
    headers = {
        "Authorization": f"App {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [
            {
                "from": "REPAY",
                "destinations": [
                    {"to": phone}
                ],
                "text": "Welcome to REPAY! Thank you for signing up."
            }
        ]
    }

    response = requests.post(api_url, headers=headers, json=payload)
    if response.status_code == 200:
        print("Message sent successfully!")
    else:
        print(f"Failed to send message. Status code: {response.status_code}, Response: {response.json()}")

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return jsonify(users)
    
    def post(self):
        app.logger.info(f"Form data: {request.form}")
        app.logger.info(f"Files: {request.files}")

      
        data = request.form
        file_to_upload = request.files.get('file')

        if not file_to_upload or file_to_upload.filename == '':
            return jsonify({"error": "File is required"}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        location = data.get('location')
        phone = data.get('phone')
        account_type = data.get('account_type')
        profile = data.get('profile')
        app.logger.info(
            f"Recieved Data: username:{username}, email:{email}, phone:{phone},location:{location}, profile:{profile}, account_type:{account_type}"
        )
        # Validate missing fields
        missing_fields = [field for field in ["username", "email", "phone", "password", "location", "account_type", "profile"] if not data.get(field)]
        if missing_fields:
            return ({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Upload file to Cloudinary (or handle it appropriately in your context)
        try:
            if profile == 'image':
                # Ensure you have your uploader configured
                upload_result = uploader.upload(file_to_upload, resource_type='image')
            else:
                return ({"error": "Profile must be an image"}), 400
        except Exception as e:
            app.logger.error(f"Error uploading file to Cloudinary: {e}")
            return ({"error": "File upload failed"}), 500

        file_url = upload_result.get('url')

        # Assuming your User model has the correct constructor and to_dict method
        location_obj = Location.query.filter(Location.name == location).first()
        if not location_obj:
            return ({"error": "Invalid location"}), 400

        new_user = User(
            username=username,
            email=email,
            phone=phone,
            location_id=location_obj.id,
            profile=file_url,
            password=password,
            account_type=account_type
        )

        db.session.add(new_user)
        db.session.commit()

        # Send welcome email and SMS
        send_welcome_email(new_user.email)
        send_welcome_sms(new_user.phone)
        # response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')

        return ({'message': 'User created successfully', 'user': new_user.to_dict()})


api.add_resource(Users, '/users')

class UserId(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict())
    
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return ({"error": "User not found"}), 404
        db.session.delete(user)
        db.session.commit()
        return ({'message': 'User deleted successfully'})
    
   
    @jwt_required()
    def put(self, id):
        current_user= get_jwt_identity()
        if current_user:
            user = User.query.filter(User.id == id).first()
            if not user:
                return jsonify({"error": "User not found"}), 404

            app.logger.info(f"Form data: {request.form}")
            app.logger.info(f"Files: {request.files}")

            data = request.form
            file_to_upload = request.files.get('file')

            if not file_to_upload or file_to_upload.filename == '':
                return ({"error": "File is required"}), 400

            username = data.get('username', user.username)
            email = data.get('email', user.email)
            password = data.get('password', user.password)
            location = data.get('location', user.location_id)
            phone = data.get('phone', user.phone)
            account_type = data.get('account_type', user.account_type)
            profile = data.get('profile', user.profile)

            app.logger.info(
                f"Received Data: username:{username}, email:{email}, password:{password}, phone:{phone}, location:{location}, profile:{profile}, account_type:{account_type}"
            )

            location_obj = Location.query.filter(Location.name == location).first()
            if not location_obj:
                return ({"error": "Invalid location"}), 400

            # Check if the email already exists (excluding the current user)
            existing_user = User.query.filter(User.email == email).first()
            if existing_user and existing_user.id != user.id:
                return ({"error": "Email already exists"}), 400

            try:
                if file_to_upload.content_type.startswith('image/'):
                    upload_result = uploader.upload(file_to_upload, resource_type='image')
                else:
                    return ({"error": "Profile must be an image"}), 400
            except Exception as e:
                app.logger.error(f"Error uploading file to Cloudinary: {e}")
                return ({"error": "File upload failed"}), 500

            file_url = upload_result.get('url')

            # Update user fields
            user.username = username
            user.email = email
            if password: user.set_password(password)
            user.location_id = location_obj.id
            user.phone = phone
            user.account_type = account_type
            user.profile = file_url  # Update the profile field with the new file URL

            try:
                db.session.commit()
            except Exception as e:
                app.logger.error(f"Error updating user: {e}")
                db.session.rollback()
                return ({"error": "An error occurred while updating the user"}), 500

            return (user.to_dict()), 200



api.add_resource(UserId, '/users/<int:id>')