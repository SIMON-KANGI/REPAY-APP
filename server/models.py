from config import db,bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates


class User(db.Model):
    __tablename__ = 'users'
    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(20),unique=True,nullable=False)
    email=db.Column(db.String(255),nullable=False, unique=True)
    password=db.Column(db.String(255),nullable=False)
    is_active=db.Column(db.Boolean,default=True)
    role=db.Column(db.String(255),nullable=False)
    account_type=db.Column(db.String(255),nullable=False)
   
    account=db.relationship('Account', back_populates="user")
    
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
    
    
    def check_password_hash(self,password):
        return bcrypt.check_password_hash(self.password,password)
    
class Account(db.Model):
    __tablename__ = 'accounts'
    
    id=db.Column(db.Integer,primary_key=True)
    number=db.Column(db.Integer,nullable=False)
    password=db.Column(db.String(20),nullable=False)
    balance=db.Column(db.Integer,nullable=False)
    category_id=db.Column(db.Integer, db.ForeignKey('categories.id'))
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'))
    user=db.relationship('User', back_populates="account")
    
    
    @property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, plain_password_text):
        self._password = bcrypt.generate_password_hash(plain_password_text).decode('utf-8')  
    
class Category(db.Model):
    __tablename__ = 'categories'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(255),nullable=False)   
    
class Transaction(db.Model):
    __tablename__ = 'transactions'
    id=db.Column(db.Integer,primary_key=True)
    amount=db.Column(db.Integer,nullable=False)
    date=db.Column(db.DateTime,nullable=False)
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'))
    account_id=db.Column(db.Integer, db.ForeignKey('accounts.id'))
    
class Notification(db.Model):
    __tablename__ = 'notifications'
    id=db.Column(db.Integer,primary_key=True)
    message=db.Column(db.String(255),nullable=False)
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'))