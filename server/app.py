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
from auth import auth_blueprint 
from users import user_blueprint
from accounts import account_blueprint
from transactions import transaction_blueprint
from datetime import datetime
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









app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(account_blueprint, url_prefix='/account')
app.register_blueprint(transaction_blueprint, url_prefix='/transaction')

class ChangeCurrency(Resource):
    def patch(self, id):
        data = request.get_json()
        currency = data.get('currency')

        if not currency:
            return {"error": "Missing currency field"}, 400

        valid_currencies = ['USD', 'KSH']
        if currency not in valid_currencies:
            return {"error": "Invalid currency"}, 400

        account = Account.query.get(id)
        if not account:
            return {"error": "Account not found"}, 404

        try:
            if account.currency != currency:
                account.update_currency(currency)
            db.session.commit()
            return jsonify(account.to_dict()), 200
        except ValueError as e:
            db.session.rollback()
            return {"error": str(e)}, 400
        except Exception as e:
            db.session.rollback()
            return {"error": "An error occurred while updating the account"}, 500

api.add_resource(ChangeCurrency, '/account/<int:id>/currency')



class CheckBalance(Resource):
    def post(self):
        data = request.get_json()
        account_name = data.get('account')
        user_id = data.get('user_id')
        password = data.get('password')

        if not account_name or not user_id or not password:
            return jsonify({"error": "Account name, user ID, and password are required"}), 400

        account = Account.query.filter(Account.user_id == user_id, Account.category.has(name=account_name)).first()
        category=Category.query.filter(Category.name == account_name).first()
        if not account:
            app.logger.info("Account not found")
            return jsonify({"error": "Account not found"}), 404
        
        if not account.check_password(password):
            app.logger.info("Invalid password")
            return jsonify({"error": "Invalid password"}), 401

        notification_message = f"Your {category.name} balance is ${account.balance}"
        notification = Notification(sender=account_name,message=notification_message, user_id=user_id, transaction_id=1)
        db.session.add(notification)
        
        try:
            db.session.commit()
        except Exception as e:
            app.logger.error(f"An error occurred while processing the request: {e}")
            db.session.rollback()
            return ({"error": "An error occurred while processing your request"}), 500

        return ({"message": notification_message}), 200

api.add_resource(CheckBalance, '/checkbalance')


class Notifications(Resource):
    def get(self):
        notifications = [notification.to_dict() for notification in Notification.query.all()]
        return jsonify(notifications)

api.add_resource(Notifications, '/notifications')

class NotificationId(Resource):
    def delete(self,id):
        notification = Notification.query.get(id)
        db.session.delete(notification)
        db.session.commit()
        return 'notification deleted successfully'
    
api.add_resource(NotificationId, '/notifications/<int:id>')
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

class Contacts(Resource):
    def get(self):
        contacts = [contact.to_dict() for contact in Contact.query.all()]
        return jsonify(contacts)
    
    def post(self):
        data = request.get_json()
        contact = Contact(name=data['name'], email=data['email'], 
                          phone=data['phone'],account=data['account'], user_id=data['user_id'])
        db.session.add(contact)
        db.session.commit()
        return ({"message": "Contact created successfully"})
api.add_resource(Contacts, '/contacts')
class CreateInvoice(Resource):
    def get(self):
        
        invoices = Invoice.query.order_by(Invoice.created_at.desc()).all()
        invoice_list = [invoice.to_dict() for invoice in invoices]
        return jsonify(invoice_list)
    def post(self):
        # Check if the request content type is multipart/form-data
        if 'multipart/form-data' not in request.content_type:
            return jsonify({"error": "Content-Type must be multipart/form-data"}), 415

        # Get the form data and file
        name=request.form.get('name')
        customer_email = request.form.get('customer_email')
        customer_phone = request.form.get('customer_phone')
        account = request.form.get('account')
        amount=request.form.get('amount')
        status = request.form.get('status')
       
        user_id = request.form.get('user_id')
        file_to_upload = request.files.get('file')

        # Log the form data and files
        app.logger.info(f"Form Data: {request.form}")
        app.logger.info(f"Files: {request.files}")

        # Check if file is present
        if not file_to_upload or file_to_upload.filename == '':
            return ({"error": "File not found"}), 404

        # Retrieve company (user) information
        company = User.query.filter_by(id=user_id).first()
        if not company:
            return ({"error": "User not found"}), 404

        # Log the received data
        app.logger.info(
            f"Received Data: Customer_email: {customer_email}, phone: {customer_phone}, account: {account}"
        )

        # Validate the required fields
        if not customer_email or not customer_phone or not account:
            return ({"error": "Customer email, phone, account, and description are required"}), 400

        try:
            # Upload the file if it's a PDF
            if file_to_upload.mimetype == 'application/pdf':
                upload_result = uploader.upload(file_to_upload, resource_type='raw')
            else:
                return jsonify({"error": "Please upload a PDF file"}), 400
        except Exception as e:
            app.logger.error(f"Error uploading file: {e}")
            return ({"error": "An error occurred while uploading the file"}), 500

        # Get the file URL from the upload result
        file_url = upload_result.get('url')

        # Create a new invoice object
        new_invoice = Invoice(
            name=name,
            email=customer_email,
            phone=company.phone,
            CustomerPhone=customer_phone,
            account=account,
            amount=amount,
            status=status,
            description=file_url,
            user_id=user_id
        )

        # Add the new invoice to the database session and commit
        db.session.add(new_invoice)
        db.session.commit()

        # Return a success response
        return ({"message": "Invoice created successfully"}), 201

# Add the resource to the API

api.add_resource(CreateInvoice, '/invoices')

class InvoiceId(Resource):
    def get(self,id):
        invoice = Invoice.query.filter_by(id=id).first()
        return jsonify(invoice.to_dict())
    def delete(self,id):
        invoice = Invoice.query.get(id)
        db.session.delete(invoice)
        db.session.commit()
        return ({'message': 'Delete Invoice'})
    
    def patch(self,id):
        data = request.get_json()
        invoice = Invoice.query.get(id)
        invoice.status = data['status']
        db.session.add(invoice)
        db.session.commit()
        return 'invoice updated'

api.add_resource(InvoiceId, '/invoices/<int:id>')

class Products(Resource):
    def get(self):
        products=[product.to_dict() for product in Product.query.all()]
        return jsonify(products)
    
    def post(self):
        app.logger.info(f'Form data:{request.form}')
        app.logger.info(f'Files:{request.files}')
        
        data=request.form
        file_to_upload=request.files.get('file')
        
        if not file_to_upload or file_to_upload.filename=='':
            return jsonify({'error':"file is required"})
        
        name=data.get('name')
        description=data.get('description')
        price=data.get('price')
        category=data.get('category')
        user_id=data.get('user_id')
        profile=data.get('profile')
        stock=data.get('stock')
        
        app.logger.info(
            f"Received Data:name={name} ,description={description}, price={price} ,category={category}, user_id={user_id}, profile={profile}, stock={stock}"
        )
        try:
            if profile =='image':
                upload_result = uploader.upload(file_to_upload, resource_type='image')
            else:
                upload_result = uploader.upload(file_to_upload, resource_type='raw')
        except Exception as e:
            app.logger.error(f"Error uploading file: {e}")
            return jsonify({"error": "An error occurred while uploading the file"}), 500
        file_url=upload_result.get('url')
        new_product=Product(
            name=name,
            description=description,
            price=price,
            category=category,
            user_id=user_id,
            profile=file_url,
            stock=stock,
         
        )
        db.session.add(new_product)
        db.session.commit()
        
api.add_resource(Products, '/products') 
class ProductId(Resource):
    def get(self, id):
        product = Product.query.get(id)
        return jsonify(product.to_dict())
    
    def patch(self, id):
        data=request.get_json()
        product=Product.query.get(id)
        product.stock=data.get('stock')
        db.session.add(product)
        db.session.commit()
        
    def delete(self, id):
        product=Product.query.get(id)
        db.session.delete(product)
        db.session.commit()
        
api.add_resource(ProductId, '/products/<int:id>')
        

if __name__ == "__main__":
    app.run(port=5555, debug=True)

    
