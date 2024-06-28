from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ()
    serialize_only = ('id', 'username', 'email', 'role', 'account_type', 'phone', 'profile', 'location_id')
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    profile = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    phone = db.Column(db.Integer, nullable=False, unique=True)
    location_id = db.Column(db.Integer, nullable=False)
    _password = db.Column(db.String(255), nullable=False)  # Changed column name to _password
    is_active = db.Column(db.Boolean, default=True)
    subscribed=db.Column(db.Boolean, default=False)
    role = db.Column(db.String(255), nullable=False)
    account_type = db.Column(db.String(255), nullable=False)
    accounts = db.relationship('Account', back_populates='users' ,cascade="all, delete-orphan")
    contacts = db.relationship('Contact', back_populates='users', cascade="all, delete-orphan")
    notifications = db.relationship('Notification', back_populates='users', cascade="all, delete-orphan")
    invoices=db.relationship('Invoice', back_populates='users', cascade="all, delete-orphan")
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError('Email cannot be blank')
        if not (email.endswith('@gmail.com') or email.endswith('@repay.com')):
            raise ValueError('Email must be either gmail.com or repay.com')
        
        existing_email = User.query.filter(User.email == email).first()
        if existing_email:
            raise ValueError('Email already exists')
        
        if email.endswith('@repay.com'):
            self.role = "admin"
        else:
            self.role = "user"
        
        return email
    
    @property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, plain_password_text):
        self._password = bcrypt.generate_password_hash(plain_password_text).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self._password, password)

    def to_dict(self):
        location=Location.query.filter(self.location_id==Location.id).first()
        
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'password':self.password,
            'account_type': self.account_type,
            'phone': self.phone,
            'profile': self.profile,
            'location':location.name,
            'notifications': [{'id': message.id, 'message': message.message} for message in self.notifications],
            'accounts': [{'id': account.id,'number': account.number, 'balance': account.balance} for account in self.accounts],
            'contacts': [{'id': contact.id, 'name': contact.name, 'phone': contact.phone} for contact in self.contacts]
        }

class Account(db.Model, SerializerMixin):
    __tablename__ = 'accounts'
    serialize_rules = ()
    serialize_only = ('id', 'number', 'balance', 'category_id', 'user_id')
    
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, nullable=False)
    _password = db.Column(db.String(255), nullable=False)  # Changed column name to _password
    balance = db.Column(db.Integer, default=50000, nullable=True)
    currency=db.Column(db.String(255), nullable=False, default='KSH')
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    users = db.relationship('User', back_populates='accounts')
    category = db.relationship('Category', back_populates='accounts')
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    @property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, plain_password_text):
        self._password = bcrypt.generate_password_hash(plain_password_text).decode('utf-8')
    
    
    
  
    def update_currency(self, new_currency):
        valid_currencies = ['USD', 'KSH']
        if new_currency not in valid_currencies:
            raise ValueError('Currency must be either USD or KSH')
        if new_currency == 'USD' and self.currency == 'KSH':
            self.balance /= 120
        elif new_currency == 'KSH' and self.currency == 'USD':
            self.balance *= 120
        self.currency = new_currency
            
        
    def received(self, amount):
        self.balance += amount
        return self.balance
    
    def sent(self, amount):
        if self.balance < amount:
            raise ValueError('Insufficient funds')
        self.balance -= amount
        return self.balance
    
    def withdraw(self, amount):
        if self.balance < amount:
            raise ValueError('Insufficient funds')
        self.balance -= amount
        return self.balance
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self._password, password)

    @validates('number')
    def validate_number(self, key, number):
        if not number:
            raise ValueError('Number cannot be blank')
        existing_number = Account.query.filter(Account.number == number).first()
        if existing_number:
            raise ValueError('Number already exists')
        return number

    def to_dict(self):
        category = Category.query.filter(Category.id == self.category_id).first()
        return {
            'id': self.id,
            'number': self.number,
            'balance': self.balance,
            'currency':self.currency,
            'category': category.name if category else None,
            'user_id': self.user_id,
        }

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    serialize_rules = ()
    serialize_only = {'id', 'name'}
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    accounts = db.relationship('Account', back_populates='category')

class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'
    serialize_rules = ()
    serialize_only = ('id', 'amount', 'date', 'type', 'user_id', 'thirdParty_id', 'account_id')
    
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    thirdParty_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    def to_dict(self):
        accountOne=Account.query.filter(self.account_id==Account.id).first()
        reciever=User.query.filter(self.thirdParty_id==User.id).first()
        return{
            'id': self.id,
            'amount': self.amount,
            'date': self.date,
            'type': self.type,
            'user_id': self.user_id,
            'thirdParty_id':self.thirdParty_id,
            'account_id': self.account_id,
            'accountOne': accountOne.number,
            'accountTwo': reciever.username if reciever else None,
            'accountTwoName': reciever.email if reciever else None,
        }

class Notification(db.Model, SerializerMixin):
    __tablename__ = 'notifications'
    serialize_rules = ()
    serialize_only = ('id','sender', 'message', 'transaction_id', 'user_id')
    
    id = db.Column(db.Integer, primary_key=True)
    sender=db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    message = db.Column(db.String(255), nullable=False)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transactions.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    users = db.relationship('User', back_populates='notifications')
    
    def to_dict(self):
        return {
            'id': self.id,
           'sender': self.sender,
           'message': self.message,
            'transaction_id': self.transaction_id,
            'user_id': self.user_id
        }

class Location(db.Model):
    __tablename__ = 'locations'
    serialize_rule=()
    serialize_only={'id', 'name'}
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Contact(db.Model):
    __tablename__ = 'contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.Integer, nullable=False, unique=True)
    account=db.Column(db.Integer, nullable=False, unique=True)
    email = db.Column(db.String(20), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    users = db.relationship('User', back_populates='contacts')
    
    def to_dict(self):
        return{
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'account': self.account,
            'email': self.email,
            'user_id': self.user_id
        }
        
class Invoice(db.Model):
    __tablename__ = 'invoices'
    
    id = db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(255), nullable=False)
    email=db.Column(db.String(255), nullable=False)
    phone=db.Column(db.Integer, nullable=False)
    CustomerPhone=db.Column(db.String(255), nullable=False)
    status=db.Column(db.String(255), nullable=False)
    account=db.Column(db.String(255), nullable=False)
    amount=db.Column(db.String(255), nullable=False)
    description=db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'))
    users = db.relationship('User', back_populates='invoices')
    
    def to_dict(self):
        return{
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'CustomerPhone': self.CustomerPhone,
            'account': self.account,
            'amount': self.amount,
            'status': self.status,
            'description': self.description,
            'created_at': self.created_at,
            'user_id': self.user_id
        }
        
class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(255), nullable=False)
    description=db.Column(db.String(255), nullable=False)
    stock=db.Column(db.String(255), nullable=False)
    category=db.Column(db.String(255), nullable=False)
    price=db.Column(db.Integer, nullable=False)
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    profile=db.Column(db.String(255), nullable=False)
    
    
    def to_dict(self):
        return{
            'id': self.id,
            'name': self.name,
            'description': self.description,
           'stock': self.stock,
            'price': self.price,
            'user_id': self.user_id,
            'profile': self.profile,
            'category': self.category
        }
    
