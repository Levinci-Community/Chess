from flask_login import login_user, logout_user
from flask_jwt_extended import create_access_token, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from database.mongodb import get_db
from models.users import User
from services.email import EmailService
from services.token import generate_token, is_valid_token
from bson import ObjectId
from datetime import datetime, timezone

class AuthServices():
    def __init__(self) -> None:
        self.db = get_db()
        self.users_collection = self.db['users']
        self.proxy = 'https://chess.workon.space/api'
        self.email_service = EmailService()

    def register(self, username: str, password: str, email: str, name: str):
        # ensure username and email is unique
        if self.users_collection.find_one({'username': username}):
            return False, 'Username already taken. Please choose another one.'
        
        if self.users_collection.find_one({'email': email, 'is_verified': True}):
            return False, 'Email already taken. Please choose another one.'

        # hash the password
        hashed_password = generate_password_hash(password)

        # insert user data
        user_data = {
            'username': username, 'password': hashed_password, 
            'email': email, 'name': name, 'is_verified': False,
            'is_locked': False, 'role': 'PLAYER',
            'rating': {
                'chess': {'mu': 1500, 'phi': 350, 'sigma': 0.06, 'ltime': datetime.now(timezone.utc)},
                'xiangqi': {'mu': 1500, 'phi': 350, 'sigma': 0.06, 'ltime': datetime.now(timezone.utc)},
                'chess_puzzle': {'mu': 1500, 'phi': 350, 'sigma': 0.06, 'ltime': datetime.now(timezone.utc)},
                'xiangqi_puzzle': {'mu': 1500, 'phi': 350, 'sigma': 0.06, 'ltime': datetime.now(timezone.utc)}
            }
        }
        
        result = self.users_collection.insert_one(user_data)

        if not result:
            return False, 'Fail to register!'
        
        self.send_verification(email)
        return True, 'Registration successful!'
    
    def send_verification(self, email: str):
        token = generate_token()
        self.users_collection.update_one({"email": email}, {"$set": {"verification_token": token}})
        # send verification email 
        verify_url = f'{self.proxy}/verify-email?email={email}&token={token}'
        self.email_service.send_verification_email(email, verify_url)

    def verify(self, email: str, token: str):
        # find user
        user = self.users_collection.find_one({'email': email})
        if not user:
            return False, 'User not found.'
        
        stored_token = user['verification_token']

        # verify token
        if not is_valid_token(token, stored_token):
            return False, 'Invalid token.'

        # update password
        result = self.users_collection.update_one(
            {'email': email},
            {'$set': {"verification_token": None, "is_verified": True}}
        )

        if result.modified_count == 0:
            return False, 'Something went wrong.'

        return True, 'Verify email successfully.'


    def login(self, username: str, password: str):
        # find user
        user_data = self.users_collection.find_one({'username': username})

        # check password
        if not user_data or not check_password_hash(user_data['password'], password):
            return False, 'Invalid username or password. Please try again.'
        
        if not user_data.get("is_verified"):
            return False, 'Fail to login. You must to validate your email first.'

        user = User()
        user.id = user_data['_id']
        login_user(user)

        user_id = str(user.id)
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        return True, (access_token, refresh_token)

    def refresh_token(self, user_id: str):
        return create_access_token(identity=user_id)

    def logout(self):
        logout_user()

    def forgot_password(self, email:str):
        if not self.users_collection.find_one({'email': email}):
            return False, 'Invalid user.'

        # generate token
        token = generate_token()
        self.users_collection.update_one({"email": email}, {"$set": {"reset_password_token": token}})

        # send email
        reset_url = f'{self.proxy}/reset-password?email={email}&token={token}'
        self.email_service.send_reset_password_email(email, reset_url)
        return True, 'Reset password action has sent to your email.'

    def reset_password(self, email, token):
        # find user
        user = self.users_collection.find_one({'email': email})
        if not user:
            return False, 'User not found.'
        
        stored_token = user['reset_password_token']

        # verify token
        if not is_valid_token(token, stored_token):
            return False, 'Invalid token.'
        
        # generate new password
        new_password = generate_token(8)
        new_password_hashed = generate_password_hash(new_password)

        # update password
        result = self.users_collection.update_one(
            {'email': email},
            {'$set': {'password': new_password_hashed, "reset_password_token": None}}
        )

        if result.modified_count == 0:
            return False, 'User not found or password not updated.'
        
        self.email_service.send_new_password_email(email=email, password=new_password)

        return True, 'Reset password successfully.'
    
    def change_password(self, user_id: str, old_password: str, new_password: str):
        user = self.users_collection.find_one({'_id': ObjectId(user_id)})
    
        if not user or not check_password_hash(user['password'], old_password):
            return False, 'Invalid old password.'
        hashed_new_password = generate_password_hash(new_password)
    
        result = self.users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'password': hashed_new_password}}
        )
    
        if result.modified_count == 0:
            return False, 'Failed to update password.'
    
        return True, 'Password updated successfully.'

    def authenticate_user(self, user_id: str, current_password: str):
        user_data = self.users_collection.find_one({'_id': ObjectId(user_id)})
        if not user_data or not check_password_hash(user_data['password'], current_password):
            return False, 'Incorrect current password.'
        return True, 'Authentication successful.'