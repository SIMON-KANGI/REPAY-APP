from config import create_app, db
from flask_restful import Api, Resource
from flask import request, jsonify, make_response, session
from models import Transaction, Account, User, Notification, Location
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies
import cloudinary
from cloudinary import uploader
import cloudinary.api
import os
import requests
from dotenv import load_dotenv

load_dotenv()
app = create_app()
api = Api(app)

api_url = 'https://n8jqr8.api.infobip.com/sms/2/text/advanced'
api_key = os.getenv('INFO_API_KEY')

cloudinary.config(
    cloud_name=os.getenv('CLOUD_NAME'),
    api_key=os.getenv('API_KEY'),
    api_secret=os.getenv('API_SECRET')
)
app.config['SEND_API_KEY'] = os.getenv('SEND_API_KEY')

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

    # Send the request
    response = requests.post(api_url, headers=headers, json=payload)

    # Check the response
    if response.status_code == 200:
        print("Message sent successfully!")
    else:
        print(f"Failed to send message. Status code: {response.status_code}, Response: {response.json()}")

@app.route('/')
def Home():
    return "Repay API"

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return jsonify(users)
    
    def post(self):
        if request.content_type != 'application/json':
            return jsonify({"error": "Content-Type must be application/json"}), 415
        
        data = request.get_json()
        
        # Log form data and uploaded files
        app.logger.info(f"Form data: {request.form}")
        app.logger.info(f"Files: {request.files}")
        
        # Extract data from the request
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        location = data.get('location')
        phone = data.get('phone')
        account_type = data.get('account_type')
        profile = data.get('profile')
        file_to_upload = request.files.get('file')
        
        location = Location.query.filter(Location.name == location).first()
        location_id = location.id
        
        # Validate required fields
        missing_fields = []
        if not all([username, email, phone, password, account_type, location_id, profile, file_to_upload]):
            missing_fields.append("username")
            missing_fields.append("email")
            missing_fields.append("phone")
            missing_fields.append("password")
            missing_fields.append("location_id")
            missing_fields.append("account_type")
            missing_fields.append("profile")
            missing_fields.append("file")
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400
        
        # Upload profile image to Cloudinary
        try:
            if profile == 'image':
                upload_result = uploader.upload(file_to_upload, resource_type='image')
            else:
                return jsonify({"error": "Profile must be an image"}), 400
        except Exception as e:
            app.logger.error(f"Error uploading file to Cloudinary: {e}")
            return jsonify({"error": "File upload failed"}), 500
        
        # Get the uploaded file URL
        file_url = upload_result.get('url')
        
        # Create a new user with the provided data
        new_user = User(username=username, email=email, phone=phone, location_id=location_id, profile=file_url, password=password, account_type=account_type)
        
        # Add the user to the database
        db.session.add(new_user)
        db.session.commit()
        
        # Send welcome email and SMS
        send_welcome_email(new_user.email)
        send_welcome_sms(new_user.phone)
        
        return jsonify({'message': 'User created successfully', 'user': new_user.to_dict()})

api.add_resource(Users, '/users')

class Login(Resource):
    def post(self):
        if request.content_type != 'application/json':
            return jsonify({"error": "Content-Type must be application/json"}), 415
     
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if user and user.check_password_hash(password):
            access_token = create_access_token(identity={"email": user.email, "role": user.role, "id": user.id})
            refresh_token = create_refresh_token(identity={"email": user.email, "role": user.role, "id": user.id})
            
            response = make_response(jsonify({
                'access_token': access_token,
                'id': user.id,
                'content': user.to_dict(),
                'username': user.username,
                'role': user.role,
                'refresh_token': refresh_token
            }), 200)
            
            return response
        
        return jsonify({"message": "Invalid username or password"}), 401

api.add_resource(Login, '/login')

class Logout(Resource):
    @jwt_required()
    def delete(self):
        current_user = get_jwt_identity()
        response = make_response(jsonify({'message': f'Logged out user {current_user}'}), 200)
        unset_jwt_cookies(response)
        return response

api.add_resource(Logout, '/logout')

class Accounts(Resource):
    def get(self):
        accounts = [account.to_dict() for account in Account.query.all()]
        return jsonify(accounts)
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        account = Account(number=data['number'], password=data['password'], balance=data['balance'], category_id=data['category_id'], user_id=data['user_id'])
        db.session.add(account)
        db.session.commit()
        return jsonify(account)

api.add_resource(Accounts, '/accounts')

class MakeTransaction(Resource):
    @jwt_required()
    def post(self):
        if request.content_type != 'application/json':
            return jsonify({"error": "Content-Type must be application/json"}), 415
        
        data = request.get_json()
        
        try:
            account_id = data['account_id']
            amount = data['amount']
            sender_id = data.get('sender_id')
            transaction_type = data.get('transaction_type', 'received')  # default to 'received'

            # Fetch the account by ID
            account = Account.query.get(account_id)
            if not account:
                return jsonify({"error": "Account not found"}), 404
            
            # Perform the transaction
            if transaction_type == 'received':
                account.received(amount)
            elif transaction_type == 'sent':
                account.sent(amount)
            else:
                return jsonify({"error": "Invalid transaction type"}), 400
            
            # Create a new transaction record
            transaction = Transaction(
                amount=amount,
                date=db.func.current_timestamp(),
                user_id=account.user_id,
                sender_id=sender_id,
                account_id=account_id
            )
            db.session.add(transaction)
            db.session.commit()

            # Create a new notification
            notification_message = f"Transaction of {amount} {transaction_type} on account {account.number}"
            notification = Notification(
                message=notification_message,
                transaction_id=transaction.id,
                user_id=account.user_id
            )
            db.session.add(notification)
            db.session.commit()
            
            return jsonify(account.to_dict()), 200  # Use .to_dict() for serialization

        except KeyError as e:
            return jsonify({"error": f"Missing key: {e.args[0]}"}), 400
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

api.add_resource(MakeTransaction, '/transaction')

class Transactions(Resource):
    def get(self):
        transactions = [transaction.to_dict() for transaction in Transaction.query.all()]
        return jsonify(transactions)
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        transaction = Transaction(amount=data['amount'], date=data['date'], user_id=data['user_id'], account_id=data['account_id'])
        db.session.add(transaction)
        db.session.commit()
        return jsonify(transaction)

api.add_resource(Transactions, '/transactions')

class Notifications(Resource):
    def get(self):
        notifications = [notification.to_dict() for notification in Notification.query.all()]
        return jsonify(notifications)

api.add_resource(Notifications, '/notifications')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
