from app import app
from models import User, Account, Category

from config import db

with app.app_context():
    db.drop_all()
    db.create_all()
    
    
    users=[]
    
    users.append(User(username='Simon Mwangi',email='simon.mwangi@repay.com',password="7889Kangi",account_type='personal'))
    for user in users:
        db.session.add(user)
        db.session.commit()
        
    accounts=[]
    
    accounts.append(Account(number=123456789,password="7889Kangi",balance=10000,category_id=1, user_id=1))
    for account in accounts:
        db.session.add(account)
        db.session.commit()
        
    categories=[]
    
    categories.append(Category(name='Equity'))
    categories.append(Category(name='Co-operative'))
    categories.append(Category(name='KCB'))
    categories.append(Category(name='I&M'))
    categories.append(Category(name='Stanbic'))
    categories.append(Category(name='Family'))
    for category in categories:
        db.session.add(category)
        db.session.commit()
    
    