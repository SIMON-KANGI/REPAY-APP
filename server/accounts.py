from config import create_app, db
from flask_restful import Api, Resource
from flask import request, jsonify, make_response, session, url_for, redirect
from models import Transaction, Account, User, Notification, Location, Category,Contact,Invoice,Product
from flask import Blueprint

app = create_app()
api = Api(app)
account_blueprint = Blueprint('account', __name__)
api = Api(account_blueprint)

class Accounts(Resource):
    def get(self):
        accounts = [account.to_dict() for account in Account.query.all()]
        return accounts, 200
#  
    def post(self):
        data = request.get_json()
        category_id = data.get('category')
        account_number = data.get('accountNumber')
        password = data.get('password')
        user_id = data.get('user_id')

        if not all([category_id, account_number, password, user_id]):
            return {"error": "Missing data fields"}, 400

        try:
            # Verify if the category exists
            category = Category.query.filter(category_id ==Category.name).first()
            if not category:
                return {"error": "Invalid category ID"}, 400
            
            # Create a new account
            account = Account(number=account_number, password=password, category_id=category.id, user_id=user_id)
            db.session.add(account)
            db.session.commit()
            print('Account created successfully')
            
            # Create a notification
            notification_message = (
                f"You have successfully created a {category.name} account. "
                f"Your new balance is {account.balance}."
            )
            notification_sender = Notification(
                sender=category.name,
                message=notification_message,
                user_id=user_id
            )
            db.session.add(notification_sender)
            db.session.commit()
            print('Notification sent successfully')

            return 'Account created successfully', 200
        except ValueError as e:
            print({"error": str(e)})
            return {"error": str(e)}, 400
        except Exception as e:
            print({"error": str(e)})
            return {"error": "An error occurred while processing your request"}, 500

api.add_resource(Accounts, '/accounts')
class AccountId(Resource):
    def patch(self, id):
        data = request.get_json()
        account=Account.query.filter(Account.id == id).first()
        category = data.get('category')
        currency=data.get('currency')
        account_number = data.get('accountNumber')
        password = data.get('password')
        user_id = data.get('user_id')

        if not all([category, account_number, password, user_id]):
            return {"error": "Missing data fields"}, 400

        try:
            account = Account.query.get(id)
            account.number = account_number
            account.password =  password
            account.category_id = category
            account.currency = currency
            account.user_id = user_id
            db.session.commit()
            return jsonify(account.to_dict()), 200
        except ValueError as e:
            db.session.rollback()
            return {"error": str(e)}, 400
api.add_resource(AccountId, '/account/<int:id>')