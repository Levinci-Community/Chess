from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token
from logging import error
from services.user import UserService
from datetime import datetime, timezone

authgg_bp = Blueprint('auth_google', __name__)

def register_google(email: str, name: str):
    try:
        user_data = {
            'username': email, 'password': None, 
            'email': email, 
            'name': name, 
            'is_verified': True,
            'is_locked': False, 
            'role': 'PLAYER',
            'rating': {
                'chess': {'mu': 1500, 'phi': 350, 'sigma': 0.06, 'ltime': datetime.now(timezone.utc)},
                'xiangqi': {'mu': 1500, 'phi': 350, 'sigma': 0.06, 'ltime': datetime.now(timezone.utc)},
                'chess_puzzle': {'mu': 1500, 'phi': 350, 'sigma': 0.06, 'ltime': datetime.now(timezone.utc)},
                'xiangqi_puzzle': {'mu': 1500, 'phi': 350, 'sigma': 0.06, 'ltime': datetime.now(timezone.utc)}
            }
        }
        
        result = UserService().users_collection.insert_one(user_data)
        return True, 'Registration successful!'
        
    except Exception as e:
        error(e)
        return "Fail to register.", 500


@authgg_bp.post('/api/login-google')
def login_google():
    try:
        data = request.get_json()
        email: str = data.get('email')
        name: str = data.get('name')
        user = UserService().get_by_email(email)
        if not user:
            register_google(email, name)
            user = UserService().get_by_email(email)
        
        user = user.to_json()
        access_token = create_access_token(identity=user["id"])
        refresh_token = create_refresh_token(identity=user["id"])
        return jsonify({'access_token': access_token, 'refresh_token': refresh_token, 'user': user}), 200
    except Exception as e:
        error(e)
        return 'Fail to log in.', 500