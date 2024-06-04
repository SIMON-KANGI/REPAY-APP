from app import app
from models import User, Account, Category
from config import db

with app.app_context():
    print("Dropping all tables...")
    db.drop_all()
    print("Creating all tables...")
    db.create_all()
    
    print("Adding users...")
    users = [
        User(username='Simon Mwangi', email='simon.mwangi@repay.com', password="7889Kangi", account_type='personal'),
        User(username='Ngethe Mwas', email='simonmwangi@gmail.com', password="7889Kangi", account_type='personal'),
        User(username='Ngethe Mwas', email='simonkangi@gmail.com', password="7889Kangi", account_type='business')
    ]
    for user in users:
        db.session.add(user)
    db.session.commit()
    
    print("Adding accounts...")
    accounts = [
        Account(number='123456789', password="7889Kangi", balance=10000, category_id=1, user_id=1)
    ]
    for account in accounts:
        db.session.add(account)
    db.session.commit()
    
    print("Adding categories...")
    categories = [
        Category(name='Equity'),
        Category(name='Co-operative'),
        Category(name='KCB'),
        Category(name='I&M'),
        Category(name='Stanbic'),
        Category(name='Family')
    ]
    for category in categories:
        db.session.add(category)
    db.session.commit()
    
    print("Setup complete.")
