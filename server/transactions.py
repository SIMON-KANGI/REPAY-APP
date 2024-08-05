from config import create_app, db
from flask_restful import Api, Resource
from flask import request, jsonify, make_response, session, url_for, redirect
from models import Transaction, Account, User, Notification, Location, Category,Contact,Invoice,Product
from flask import Blueprint
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies
app = create_app()
api = Api(app)

transaction_blueprint= Blueprint('transaction', __name__)
api = Api(transaction_blueprint)
class Transactions(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        if current_user:
            transactions = [transaction.to_dict() for transaction in Transaction.query.all()]
            return jsonify(transactions)
        return jsonify({"error": "User not authenticated"}), 401
    
    # @jwt_required()
    # def post(self):
    #     data = request.get_json()
    #     transaction = Transaction(amount=data['amount'], date=data['date'], user_id=data['user_id'], account_id=data['account_id'])
    #     db.session.add(transaction)
    #     db.session.commit()
    #     return jsonify(transaction)

api.add_resource(Transactions, '/transactions')


class MakeTransaction(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        if current_user:
        # Check for the contentType
            if request.content_type != 'application/json':
                return jsonify({"error": "Content-Type must be application/json"}), 415

            data = request.json

            # Required data from the front end
            required_keys = ['account_name', 'amount', 'password', 'account', 'sender_id']
            missing_keys = [key for key in required_keys if key not in data]

            if missing_keys:
                return jsonify({"error": f"Missing keys: {', '.join(missing_keys)}"}), 400

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
                    return ({"error": "Account not found"}), 404

                if not sender_account:
                    return ({"error": "Sender account not found"}), 404

                if not sender_account.check_password(password):
                    return ({"error": "Invalid password"}), 401

                if not third_party_account:
                    return ({"error": "Recipient account not found"}), 404

                if transaction_type not in ['received', 'sent']:
                    return ({"error": "Invalid transaction type"}), 400

                try:
                    amount = float(amount)
                    if amount <= 0:
                        return jsonify({"error": "Amount must be a positive number"}), 400
                except ValueError:
                    return ({"error": "Amount must be a valid number"}), 400

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
                    thirdParty_id=third_party_account.user_id,
                    type=transaction_type
                )

                db.session.add(transaction)
                db.session.commit()

                # Get the current time and format it
                current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                # Notification for the sender
                notification_sendmessage = (
                    f"Transaction of {amount} {transaction_type} to account {third_party_account.number} on {current_time}."
                    f" Your new balance is {sender_account.balance}."
                )
                notification_sender = Notification(
                    sender=account_name,
                    message=notification_sendmessage,
                    transaction_id=transaction.id,
                    user_id=sender_account.user_id
                )
                db.session.add(notification_sender)
                db.session.commit()

                # Notification for the receiver
                notification_receivedmessage = (
                    f"You have received {amount} from account {sender_account.number} on {current_time}."
                    f" Your new balance is {third_party_account.balance}."
                )
                app.logger.info(f"Preparing to send notification to receiver: {third_party_account.user_id}")
                notification_receiver = Notification(
                    sender=third_party_account.category.name if hasattr(third_party_account.category, 'name') else str(third_party_account.category),
                    message=notification_receivedmessage,
                    transaction_id=transaction.id,
                    user_id=third_party_account.user_id
                )
                db.session.add(notification_receiver)
                db.session.commit()
                app.logger.info(f"Notification to receiver sent successfully: {third_party_account.user_id}")

                return ('Transaction successfull'), 200

            except Exception as e:
             app.logger.error(f"Error processing transaction: {e}")
            # db.session.rollback()  # Ensure any changes are rolled back on error
            # return jsonify({"error": "An error occurred while processing the transaction"}), 500

api.add_resource(MakeTransaction, '/transactions')



class MakeWithdrawal(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        if current_user:
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
                    return ({"error": "Account not found"}), 404

                if not sender_account:
                    return ({"error": "Sender account not found"}), 404

                if not Fromaccount.check_password(password):
                    return ({"error": "Invalid password"}), 401

                if not third_party_account:
                    return ({"error": "Recipient account not found"}), 404

                if transaction_type not in ['withdrawal']:
                    return ({"error": "Invalid transaction type"}), 400

                try:
                    amount = float(amount)
                    if amount <= 0:
                        return jsonify({"error": "Amount must be a positive number"}), 400
                except ValueError:
                    return ({"error": "Amount must be a valid number"}), 400

                if Fromaccount_name != Toaccount_name:
                    third_party_account.received(amount)
                    Fromaccount.withdraw(amount)
                else:
                    return ({"error": "From and To accounts cannot be the same"}), 400


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
                    f"Withdrawal of {amount} {transaction_type} to account {third_party_account.number}. "
                    f"Your new balance is {sender_account.balance}."
                )
                notification_sender = Notification(
                    sender=Fromaccount_name,
                    message=notification_sendmessage,
                    transaction_id=transaction.id,
                    user_id=sender_account.user_id
                )
                db.session.add(notification_sender)
                db.session.commit()

                # Notification for the receiver
                notification_receivedmessage = (
                    f"You have received {amount} from account {sender_account.category.name} of account number {sender_account.number}. "
                    f"Your new balance is {third_party_account.balance}."
                )
                notification_receiver = Notification(
                    sender=third_party_account.category.name,
                    message=notification_receivedmessage,
                    transaction_id=transaction.id,
                    user_id=third_party_account.user_id
                )
                db.session.add(notification_receiver)
                db.session.commit()

                return 'Widthdrawal made successfully', 200

            except Exception as e:
                app.logger.error(f"Error processing transaction: {e}")
                return ({"error": "An error occurred while processing the transaction"}), 500

api.add_resource(MakeWithdrawal, '/withdrawal')
