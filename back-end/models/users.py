from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, user_id = None, username = None, email = None, name = None, is_verified=None, is_locked=None, role=None, rating=None, is_vip=False):
        self.id = str(user_id)
        self.username = username
        self.email = email
        self.name = name
        self.is_verified = is_verified
        self.is_locked = is_locked
        self.role = role
        self.rating = rating
        self.is_vip = is_vip
        
    def to_json(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'is_locked': self.is_locked,
            'is_verified': self.is_verified,
            'role': self.role,
            'rating': self.rating,
            'is_vip': self.is_vip
        }