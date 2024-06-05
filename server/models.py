from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rule=()
    serialize_only=('id','username','email','role','account_type')
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    profile = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    _password = db.Column(db.String(255), nullable=False)  # Changed column name to _password
    is_active = db.Column(db.Boolean, default=True)
    role = db.Column(db.String(255), nullable=False)
    account_type = db.Column(db.String(255), nullable=False)
    accounts = db.relationship('Account', back_populates="users")
    created_at = db.Column( db.DateTime, server_default=db.func.now())
    notifications = db.relationship('Notification',cascade="all, delete-orphan", back_populates="users")
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
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'account_type': self.account_type,
            'accounts':[{'id':account.id, "number": account.number, 'balance': account.balance}for account in self.accounts]
        }
class Account(db.Model, SerializerMixin):
    __tablename__ = 'accounts'
    serialize_rule=()
    serialize_only=('id','number','balance','category_id','user_id')
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, nullable=False)
    _password = db.Column(db.String(255), nullable=False)  # Changed column name to _password
    balance = db.Column(db.Integer, default=50000, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    users = db.relationship('User', back_populates="accounts")
    category = db.relationship('Category', back_populates='accounts')
    created_at = db.Column( db.DateTime, server_default=db.func.now())
    @property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, plain_password_text):
        self._password = bcrypt.generate_password_hash(plain_password_text).decode('utf-8')
        
    def received(self, amount):
        self.balance += amount
        return self.balance
    
    def sent(self, amount):
        if self.balance < amount:
            raise ValueError('Insufficient funds')
        self.balance -= amount
        return self.balance
    
    def check_password_hash(self, password):
        return bcrypt.check_password_hash(self._password, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'number': self.number,
            'balance': self.balance,
            'category_id': self.category_id,
            'user_id': self.user_id,
            
        }
        

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    accounts = db.relationship('Account', back_populates='category')

class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    created_at = db.Column( db.DateTime, server_default=db.func.now())

class Notification(db.Model, SerializerMixin):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column( db.DateTime, server_default=db.func.now())
    message = db.Column(db.String(255), nullable=False)
    transaction_id = db.Column(db.Integer, db.ForeignKey("transactions.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    users=db.relationship('User',  back_populates='notifications')
