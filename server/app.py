from config import create_app, db
from flask_restful import Api, Resource
from flask import request, jsonify, make_response, session, url_for, redirect
from models import Transaction, Account, User, Notification, Location, Category
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

load_dotenv()
app = create_app()
api = Api(app)

oauth = OAuth(app)

api_url = 'https://n8jqr8.api.infobip.com/sms/2/text/advanced'
api_key = os.getenv('INFO_API_KEY')

google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri=os.getenv('GOOGLE_REDIRECT_URI'),
    client_kwargs={'scope': 'openid profile email'}
)
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

@app.route('/')
def Home():
    return "Repay API"

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
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Upload file to Cloudinary (or handle it appropriately in your context)
        try:
            if profile == 'image':
                # Ensure you have your uploader configured
                upload_result = uploader.upload(file_to_upload, resource_type='image')
            else:
                return jsonify({"error": "Profile must be an image"}), 400
        except Exception as e:
            app.logger.error(f"Error uploading file to Cloudinary: {e}")
            return jsonify({"error": "File upload failed"}), 500

        file_url = upload_result.get('url')

        # Assuming your User model has the correct constructor and to_dict method
        location_obj = Location.query.filter(Location.name == location).first()
        if not location_obj:
            return jsonify({"error": "Invalid location"}), 400

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

        return jsonify({'message': 'User created successfully', 'user': new_user.to_dict()})


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
            return jsonify({"error": "User not found"}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    
   
    
    def put(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        app.logger.info(f"Form data: {request.form}")
        app.logger.info(f"Files: {request.files}")

        data = request.form
        file_to_upload = request.files.get('file')

        if not file_to_upload or file_to_upload.filename == '':
            return jsonify({"error": "File is required"}), 400

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
            return jsonify({"error": "Invalid location"}), 400

        # Check if the email already exists (excluding the current user)
        existing_user = User.query.filter(User.email == email).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({"error": "Email already exists"}), 400

        try:
            if file_to_upload.content_type.startswith('image/'):
                upload_result = uploader.upload(file_to_upload, resource_type='image')
            else:
                return jsonify({"error": "Profile must be an image"}), 400
        except Exception as e:
            app.logger.error(f"Error uploading file to Cloudinary: {e}")
            return jsonify({"error": "File upload failed"}), 500

        file_url = upload_result.get('url')

        # Update user fields
        user.username = username
        user.email = email
        if password:  # Only update password if provided
            user.set_password(password)
        user.location_id = location_obj.id
        user.phone = phone
        user.account_type = account_type
        user.profile = file_url  # Update the profile field with the new file URL

        try:
            db.session.commit()
        except Exception as e:
            app.logger.error(f"Error updating user: {e}")
            db.session.rollback()
            return jsonify({"error": "An error occurred while updating the user"}), 500

        return jsonify(user.to_dict()), 200



api.add_resource(UserId, '/users/<int:id>')




@app.route('/login/google')
def login_google():
    redirect_uri = url_for('authorized', _external=True)
    return google.authorize_redirect(redirect_uri)


class GoogleLogin(Resource):
    @staticmethod
    def authorized():
        if request.method == 'GET':
            token = google.authorize_access_token()
            user_info = google.parse_id_token(token)
            email = user_info['email']
            username = user_info['name']  # Assuming 'name' field contains the username
            
            # Check if the user exists in the database
            user = User.query.filter_by(email=email).first()
            if not user:
                # If the user doesn't exist, register the user using Google info
                user = User(username=username, email=email)
                db.session.add(user)
                db.session.commit()

            # Generate JWT tokens for the user
            access_token = create_access_token(identity={"email": user.email, "role": user.role, "id": user.id})
            refresh_token = create_refresh_token(identity={"email": user.email, "role": user.role, "id": user.id})

            # Return the tokens and user info in the response
            return jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user.to_dict()  # Assuming to_dict() method returns user info as a dictionary
            })
    
    def post(self):
        access_token = request.json.get('access_token')
        if access_token:
            # Retrieve the nonce value stored in session or elsewhere
            nonce = session.get('nonce')

            if nonce:
                user_info = google.parse_id_token(access_token, nonce=nonce)
                email = user_info['email']
                username = user_info['name'] 
                user = User.query.filter_by(email=email).first()
                if user:
                    access_token = create_access_token(identity={"email": user.email, "role": user.role, "id": user.id})
                    refresh_token = create_refresh_token(identity={"email": user.email, "role": user.role, "id": user.id})
                    return jsonify({
                        'access_token': access_token,
                        'id': user.id,
                        'content': user.to_dict(),
                        'username': user.username,
                        'role': user.role,
                        'refresh_token': refresh_token
                    }), 200
                else:
                    return jsonify({'message': 'User not found'}), 404
            else:
                return jsonify({'message': 'Nonce not found'}), 400
        else:
            return jsonify({'message': 'Access token not provided'}), 400

api.add_resource(GoogleLogin, '/login/authorized')

class Login(Resource):
    def post(self):
        if request.content_type != 'application/json':
            return jsonify({"error": "Content-Type must be application/json"}), 415
     
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
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
        return accounts, 200

    def post(self):
        data = request.get_json()
        category = data.get('category')
        account_number = data.get('accountNumber')
        password = data.get('password')
        user_id = data.get('user_id')

        if not all([category, account_number, password, user_id]):
            return {"error": "Missing data fields"}, 400

        try:
            account = Account(number=account_number, password=password, category_id=category, user_id=user_id)
            db.session.add(account)
            db.session.commit()
            return jsonify(account.to_dict()), 201
        except ValueError as e:
            db.session.rollback()
            return {"error": str(e)}, 400


api.add_resource(Accounts, '/accounts')

class MakeTransaction(Resource):
    def post(self):
        # check for the contentType
        if request.content_type != 'application/json':
            return jsonify({"error": "Content-Type must be application/json"}), 415

        data = request.json  # Change request.form to request.json

        # required data from the front end
        required_keys = ['account_name', 'amount', 'password', 'account', 'sender_id']
        missing_keys = [key for key in required_keys if key not in data]

        if missing_keys:
            return jsonify({"error": f"Missing keys: {', '.join(missing_keys)}"}), 400

        # received data
        try:
            account_name = data.get('account_name')
            amount = data.get('amount')
            account_number = data.get('account')
            sender_id = data.get('sender_id')
            transaction_type = data.get('transaction_type', 'received')
            password = data['password']

            account = Account.query.filter(Account.category.has(name=account_name)).first()
            sender_account = Account.query.filter(Account.user_id == sender_id).first()
            third_party_account = Account.query.filter(Account.number == account_number).first()

            app.logger.info(
                f"Received Data: account_name:{account_name}, amount:{amount}, account_number:{account_number}, sender_id:{sender_id}, transaction_type:{transaction_type}"
            )

            if not account:
                return jsonify({"error": "Account not found"}), 404

            if not sender_account:
                return jsonify({"error": "Sender account not found"}), 404

            if not sender_account.check_password(password):
                return jsonify({"error": "Invalid password"}), 401

            if not third_party_account:
                return jsonify({"error": "Recipient account not found"}), 404

            if transaction_type not in ['received', 'sent']:
                return jsonify({"error": "Invalid transaction type"}), 400

            try:
                amount = float(amount)
                if amount <= 0:
                    return jsonify({"error": "Amount must be a positive number"}), 400
            except ValueError:
                return jsonify({"error": "Amount must be a valid number"}), 400

            if transaction_type == 'received':
                third_party_account.received(amount)
            elif transaction_type == 'sent':
                sender_account.sent(amount)
                third_party_account.received(amount)

            transaction = Transaction(
                amount=amount,
                date=db.func.current_timestamp(),
                user_id=sender_id,
                account_id=sender_account.id,
                thirdParty_id=third_party_account.user_id,  # Corrected typo
                type=transaction_type
            )

            db.session.add(transaction)
            db.session.commit()

            # Notification for the sender
            notification_sendmessage = (
                f"Transaction of {amount} {transaction_type} to account {third_party_account.number}. "
                f"Your new balance is {sender_account.balance}."
            )
            notification_sender = Notification(
                message=notification_sendmessage,
                transaction_id=transaction.id,
                user_id=sender_account.user_id
            )
            db.session.add(notification_sender)
            db.session.commit()

            # Notification for the receiver
            notification_receivedmessage = (
                f"You have received {amount} from account {sender_account.number}. "
                f"Your new balance is {third_party_account.balance}."
            )
            notification_receiver = Notification(
                message=notification_receivedmessage,
                transaction_id=transaction.id,
                user_id=third_party_account.user_id
            )
            db.session.add(notification_receiver)
            db.session.commit()

            return jsonify(sender_account.to_dict()), 200

        except Exception as e:
            app.logger.error(f"Error processing transaction: {e}")
            return jsonify({"error": "An error occurred while processing the transaction"}), 500

api.add_resource(MakeTransaction, '/transactions')



class MakeWithdrawal(Resource):
    def post(self):
        # check for the contentType
        if request.content_type != 'application/json':
            return jsonify({"error": "Content-Type must be application/json"}), 415

        data = request.json  # Change request.form to request.json

        # required data from the front end
        required_keys = ['Fromaccount_name', 'amount', 'password', 'Toaccount_name', 'sender_id']
        missing_keys = [key for key in required_keys if key not in data]

        if missing_keys:
            return jsonify({"error": f"Missing keys: {', '.join(missing_keys)}"}), 400

        # received data
        try:
            Fromaccount_name = data.get('Fromaccount_name')
            amount = data.get('amount')
            Toaccount_name = data.get('Toaccount_name')
            sender_id = data.get('sender_id')
            transaction_type = data.get('transaction_type', 'withdrawal')
            password = data['password']

            Fromaccount = Account.query.filter(Account.category.has(name=Fromaccount_name)).first()
            sender_account = Account.query.filter(Account.user_id == sender_id).first()
            third_party_account = Account.query.filter(Account.category.has(name= Toaccount_name)).first()

            app.logger.info(
                f"Received Data: Fromaccount_name:{Fromaccount_name}, amount:{amount}, Toaccount_name:{Toaccount_name}, sender_id:{sender_id}, transaction_type:{transaction_type} ,password:{password}"
            )

            if not Fromaccount_name:
                return jsonify({"error": "Account not found"}), 404

            if not sender_account:
                return jsonify({"error": "Sender account not found"}), 404

            if not Fromaccount.check_password(password):
                return jsonify({"error": "Invalid password"}), 401

            if not third_party_account:
                return jsonify({"error": "Recipient account not found"}), 404

            if transaction_type not in ['withdrawal']:
                return jsonify({"error": "Invalid transaction type"}), 400

            try:
                amount = float(amount)
                if amount <= 0:
                    return jsonify({"error": "Amount must be a positive number"}), 400
            except ValueError:
                return jsonify({"error": "Amount must be a valid number"}), 400

            if Fromaccount_name != Toaccount_name:
                third_party_account.received(amount)
                Fromaccount.withdraw(amount)
            else:
                return jsonify({"error": "From and To accounts cannot be the same"}), 400


            transaction = Transaction(
                amount=amount,
                date=db.func.current_timestamp(),
                user_id=sender_id,
                account_id=Fromaccount.id,
                thirdParty_id=third_party_account.id,
                type=transaction_type
            )

            db.session.add(transaction)
            db.session.commit()

            # Notification for the sender
            notification_sendmessage = (
                f"Withdarwal of {amount} {transaction_type} to account {third_party_account.number}. "
                f"Your new balance is {sender_account.balance}."
            )
            notification_sender = Notification(
                message=notification_sendmessage,
                transaction_id=transaction.id,
                user_id=sender_account.user_id
            )
            db.session.add(notification_sender)
            db.session.commit()

            # Notification for the receiver
            notification_receivedmessage = (
                f"You have received {amount} from account {sender_account.number}. "
                f"Your new balance is {third_party_account.balance}."
            )
            notification_receiver = Notification(
                message=notification_receivedmessage,
                transaction_id=transaction.id,
                user_id=third_party_account.user_id
            )
            db.session.add(notification_receiver)
            db.session.commit()

            return jsonify(sender_account.to_dict()), 200

        except Exception as e:
            app.logger.error(f"Error processing transaction: {e}")
            return jsonify({"error": "An error occurred while processing the transaction"}), 500

api.add_resource(MakeWithdrawal, '/withdrawal')
class CheckBalance(Resource):
    def post(self):
        data=request.json
        account_name=data['account']
        user_id=data['user_id']
        password=data['password']
        account=Account.query.filter(Account.category.has(name=account_name)).first()
        user_account=Account.query.filter(Account.user_id==user_id).first()
        if not account and user_account.check_password(password):
            return jsonify({"error": "Check account info"}), 404
        
        notification_message=(
            f"Your account balance is ${user_account.balance}"
        )
        notification=Notification(message=notification_message,user_id=user_id)
        db.session.add(notification)
        db.session.commit()
api.add_resource(CheckBalance,'/checkbalance')
class Transactions(Resource):
    def get(self):
        transactions = [transaction.to_dict() for transaction in Transaction.query.all()]
        return jsonify(transactions)
    
    # @jwt_required()
    # def post(self):
    #     data = request.get_json()
    #     transaction = Transaction(amount=data['amount'], date=data['date'], user_id=data['user_id'], account_id=data['account_id'])
    #     db.session.add(transaction)
    #     db.session.commit()
    #     return jsonify(transaction)

api.add_resource(Transactions, '/transactions')


class Notifications(Resource):
    def get(self):
        notifications = [notification.to_dict() for notification in Notification.query.all()]
        return jsonify(notifications)

api.add_resource(Notifications, '/notifications')

class Categories(Resource):
    def get(self):
        categories = [category.to_dict() for category in Category.query.all()]
        return jsonify(categories)
api.add_resource(Categories, '/categories')

class Locations(Resource):
    def get(self):
        locations = [location.to_dict() for location in Location.query.all()]
        return jsonify(locations)
api.add_resource(Locations, '/locations')

if __name__ == '__main__':
    with app.app_context():
        app.run(port=5555, debug=True)

    
