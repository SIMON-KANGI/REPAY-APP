from config import create_app,db
from flask_restful import Api,Resource
from flask import request,jsonify,make_response,flash,session
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
        user=User(username=data['username'],email=data['email'],password=data['password'],account_type=data['account_type'], accounts=data['accounts'])
        db.session.add(user)
        db.session.commit()
        return jsonify(user)
    
api.add_resource(Users, '/users')

class Accounts(Resource):
    def get(self):
        accounts=[account.to_dict() for account in Account.query.all()]
        return jsonify(accounts)
    
    def post(self):
        data=request.get_json()
        account=Account(number=data['number'],password=data['password'],balance=data['balance'],category_id=data['category_id'],user_id=data['user_id'])
        db.session.add(account)
        db.session.commit()
        return jsonify(account)
    
api.add_resource(Accounts, '/accounts')

if __name__ == '__main__':
    app.run(port=5555, debug=True)