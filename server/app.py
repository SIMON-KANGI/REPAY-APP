from config import create_app,db
from flask_restful import Api,Resource
from flask import request,jsonify,make_response,session
from models import Transaction,Account,User, Notification
from flask_jwt_extended import create_access_token,create_refresh_token, jwt_required, get_jwt_identity,unset_jwt_cookies #import the jwt extensions


app=create_app()
api=Api(app)
@app.route('/')
def Home():
    return "Repay API"


class Users(Resource):
    def get(self):
        users=[user.to_dict() for user in User.query.all()]
        return jsonify(users)
    
    def post(self):
        data=request.get_json()
        new_user=User(username=data['username'],email=data['email'],password=data['password'],account_type=data['account_type'], accounts=data['accounts'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user)
    
api.add_resource(Users, '/users')

class Login(Resource):
    def post(self):
        if request.content_type != 'application/json':
            return jsonify({"error": "Content-Type must be application/json"}), 415
        data=request.get_json()
        email=data['email']
        password=data['password']
        user=User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            access_token=create_access_token(identity=user.id)
            refresh_token=create_refresh_token(identity=user.id)
            print(access_token)
            response=make_response(jsonify({
                'access_token':access_token,
                'refresh_token':refresh_token,
                'user':user.to_dict(),
                'id':user.id
            }),200)
        if response:
            return response
            
        return jsonify({'message':'invalid credentials'}), 401
    
class Logout(Resource):
    @jwt_required()
    def delete(self):
        
        current_user = get_jwt_identity()
        
        response = make_response(jsonify({'message': f'Logged out user {current_user}'}), 200)
        unset_jwt_cookies(response)
        return response
    
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
       
class Accounts(Resource):
    def get(self):
        accounts=[account.to_dict() for account in Account.query.all()]
        return jsonify(accounts)
    @jwt_required()
    def post(self):
        data=request.get_json()
        account=Account(number=data['number'],password=data['password'],balance=data['balance'],category_id=data['category_id'],user_id=data['user_id'])
        db.session.add(account)
        db.session.commit()
        return jsonify(account)
    
class MakeTransaction(Resource):
    @jwt_required()
    def put(self):
        if request.content_type != 'application/json':
            return jsonify({"error": "Content-Type must be application/json"}), 415
        
        data = request.get_json()
        
        try:
            account_id = data['account_id']
            amount = data['amount']
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
            
            # Save changes to the database
            db.session.commit()
            
            return jsonify(account.to_dict()), 200  # Use .to_dict() for serialization
        except KeyError as e:
            return jsonify({"error": f"Missing key: {e.args[0]}"}), 400
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

api.add_resource(MakeTransaction, '/transaction')
        
    
        
    
api.add_resource(Accounts, '/accounts')
class Transactions(Resource):
    def get(self):
        transactions=[transaction.to_dict() for transaction in Transaction.query.all()]
        return jsonify(transactions)
    @jwt_required()
    def post(self):
        data=request.get_json()
        transaction=Transaction(amount=data['amount'],date=data['date'],user_id=data['user_id'],account_id=data['account_id'])
        db.session.add(transaction)
        db.session.commit()
        return jsonify(transaction)

if __name__ == '__main__':
    app.run(port=5555, debug=True)