from app import app
from models import User, Account, Category, Location
from config import db

with app.app_context():
    print("Dropping all tables...")
    db.drop_all()
    print("Creating all tables...")
    db.create_all()
    
    print("Adding users...")
    # users = [
    #     User(username='Simon Mwangi',profile="img", email='simon.mwangi@repay.com', password="7889Kangi",phone='0797222488', location_id=1, account_type='personal'),
    #     User(username='Ngethe Mwas',profile="img", email='simonmwangi@gmail.com', password="0797222488kangi", phone='0793452488', location_id=4, account_type='personal'),
    #     User(username='Ngethe Mwas', profile='img', email='simonmwangikangi@gmail.com', password="7889Kangi", phone='0722447565', location_id=2, account_type='business')
    # ]
    # for user in users:
    #     db.session.add(user)
    # db.session.commit()
    
    print("Adding accounts...")
    accounts = [
        Account(number=123456789, password="7889Kangi", category_id=1, user_id=1)
       
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
        Category(name='Family'),
         Category(name='M-PESA'),
          Category(name='Absa')
    ]
    for category in categories:
        db.session.add(category)
    db.session.commit()
    
    locations = [
        Location(name='Nairobi'),
        Location(name='Kisumu'),
         Location(name='Mombasa'),
        Location(name='Eldoret'),
         Location(name='Kiambu'),
        Location(name='Nakuru'),
         Location(name='Mandera'),
        Location(name='Lamu'),
         Location(name='Kilifi'),
        Location(name='Thika'),
         Location(name='Nyeri'),
        Location(name='Kakamega'),
         Location(name='Muranga'),
    ]
    for location in locations:
        db.session.add(location)
    db.session.commit()
    
    print("Setup complete.")
