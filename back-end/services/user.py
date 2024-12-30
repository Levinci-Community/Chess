from bson import ObjectId
from database.mongodb import get_db
from models.users import User

class UserService():
    def __init__(self) -> None:
        self.db = get_db()
        self.users_collection = self.db['users']

    def map_user(self, user_data):
        user = User(
            user_id=user_data['_id'], 
            username=user_data['username'], 
            email=user_data['email'], 
            name=user_data['name'], 
            is_verified=user_data["is_verified"], 
            is_locked=user_data["is_locked"], 
            role=user_data["role"],
            rating=user_data["rating"],
            is_vip=user_data.get("is_vip")
            )
        return user

    def get_all(self):
        users = list(self.users_collection.find())
        return [self.map_user(user).to_json() for user in users]

    def get_by_id(self, user_id: str):
        user_data = self.users_collection.find_one({'_id': ObjectId(user_id)})
        if not user_data:
            return None
        user = self.map_user(user_data)
        return user
    
    def get_by_username(self, username: str):
        user_data = self.users_collection.find_one({'username': username})
        if not user_data:
            return None
        user = self.map_user(user_data)
        return user
    
    def get_by_email(self, email: str):
        user_data = self.users_collection.find_one({'email': email})
        if not user_data:
            return None
        user = self.map_user(user_data)
        return user
    
    def update_current_user(self, user_id, username = None, email = None, name = None):
        updated = {}
        if username != None: 
            updated['username'] = username
        if email != None: 
            updated['email'] = email
        if name != None: 
            updated['name'] = name
        
        result = self.users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': updated}
        )

        if result.modified_count == 0:
            return False, "Failed to update profile."
        return True, "Profile updated successfully."


    def get_all_admin(self):
        admins = list(self.users_collection.find({'role': 'ADMIN'}))
        return [self.map_user(admin).to_json() for admin in admins]
    
    def set_role(self, user_id, role):
        if role == 'ADMIN' or role == 'PLAYER':
            result = self.users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'role': role}}
            )

            if result.modified_count == 0:
                return False, "Failed to update."
            return True, "Updated successfully."
        return False, "Invalid role."
    
    def toggle_status(self, user_id):
        user = self.users_collection.find_one({'_id': ObjectId(user_id)})
        if user:
            new_status = not user.get('status', False)  # Toggle the status
            result = self.users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'status': new_status}}
            )
            if result.modified_count > 0:
                return True, f"Status toggled to {'active' if new_status else 'inactive'} successfully."
            else:
                return False, "Failed to toggle status."
        else:
            return False, "User not found."
    
    
    def get_friends(self, user_id: str):
        user_data = self.users_collection.find_one({'_id': ObjectId(user_id)})
        if not user_data:
            return None
        friends_ids = user_data.get('friends', [])
        friends = []
        for friend_id in friends_ids:
            friend_data = self.users_collection.find_one({'_id': ObjectId(friend_id)})
            if friend_data:
                friends.append(self.map_user(friend_data).to_json())
        return friends
    
    def add_friend(self, user_id: str, friend_id: str):
        user = self.users_collection.find_one({'_id': ObjectId(user_id)})
        friend = self.users_collection.find_one({'_id': ObjectId(friend_id)})
        
        if not user or not friend:
            return False, "User or friend not found."

        if friend_id in user.get('friends', []):
            return False, "Friend already added."

        result = self.users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {'friends': friend_id}}
        )
        
        if result.modified_count == 0:
            return False, "Failed to add friend."

        return True, "Friend added successfully."
    
    def find_users(self, user_id: str, query: str):
        user_data = self.users_collection.find_one({'_id': ObjectId(user_id)})
        if not user_data:
            return []
        friend_requests = user_data.get('friend_requests', [])
        friends = user_data.get('friends', [])

        filter = {
            "_id": {"$ne": ObjectId(user_id)},
            "_id": {"$nin": friend_requests},
            "_id": {"$nin": friends},
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"username": {"$regex": query, "$options": "i"}},
                {"email": {"$regex": query, "$options": "i"}}
            ]
        }
        users = list(self.users_collection.find(filter))

        return [self.map_user(u).to_json() for u in users]

    def send_friend_request(self, user_id, friend_id):
        existing_request = self.users_collection.find_one({
            '_id': ObjectId(friend_id),
            'friend_requests': {
                '$elemMatch': {
                    '_id': ObjectId(user_id)
                }
            }
        })
        if existing_request:
            return False, 'Friend request already sent'
        result = self.users_collection.update_one(
            {'_id': ObjectId(friend_id)},
            {'$addToSet': {'friend_requests': {'_id': ObjectId(user_id)}}}
        )
        if result.modified_count > 0:
            return True, 'Friend request sent successfully'
        else:
            return False, 'Failed to send friend request'
        
    def get_friend_requests(self, user_id):
        user = self.users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return []
        friend_requests = user.get('friend_requests', [])
        friend_ids = [request['_id'] for request in friend_requests]
        friends = self.users_collection.find({'_id': {'$in': friend_ids}})
        return [self.map_user(friend).to_json() for friend in friends]

    def accept_friend_request(self, user_id, request_id):
        result = self.users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$pull': {'friend_requests': {'_id': ObjectId(request_id)}}}
        )

        if result.modified_count == 0:
            return False, 'Failed to accept friend request'

        self.users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$addToSet': {'friends': ObjectId(request_id)}}
        )

        self.users_collection.update_one(
            {'_id': ObjectId(request_id)},
            {'$addToSet': {'friends': ObjectId(user_id)}}
        )

        return True, 'Friend request accepted successfully'

    def decline_friend_request(self, user_id, request_id):
        result = self.users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$pull': {'friend_requests': {'_id': ObjectId(request_id)}}}
        )

        if result.modified_count > 0:
            return True, 'Friend request declined successfully'
        else:
            return False, 'Failed to decline friend request'

    def unfriend(self, user_id, friend_id):
        # Removing friend_id from user_id's friends list
        result1 = self.users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$pull': {'friends': ObjectId(friend_id)}}
        )

        # Removing user_id from friend_id's friends list
        result2 = self.users_collection.update_one(
            {'_id': ObjectId(friend_id)},
            {'$pull': {'friends': ObjectId(user_id)}}
        )

        if result1.modified_count == 0 or result2.modified_count == 0:
            return False, 'Failed to unfriend'

        return True, 'Unfriended successfully'
    
    def set_vip_status(self, user_id, vip_status, vip_expiry=None):
        update_fields = {'is_vip': vip_status}
        if vip_expiry:
            update_fields['vip_expiry'] = vip_expiry
        result = self.users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_fields}
        )
        if result.modified_count == 0:
            return False, "Failed to update VIP status."
        return True, "VIP status updated successfully."
    
    def get_vip_status(self, user_id):
        user_data = self.users_collection.find_one({'_id': ObjectId(user_id)})
        if not user_data:
            return None, "User not found."
        vip_status = user_data.get('is_vip', False)
        vip_expiry = user_data.get('vip_expiry')
        return vip_status, vip_expiry

    def get_user_report(self):
        users = self.users_collection.find()
        
        report = {
            'count': 0,
            'vefify': {
                'is_verified': 0,
                'not_verified': 0
            },
            'lock': {
                'is_locked': 0,
                'not_locked': 0
            },
            'rating': {
                '<1000': 0,
                '<1500': 0,
                '<2000': 0,
                '>2000': 0,
                'average': 0
            },
            'role': {
                'user': 0,
                'admin': 0
            }
        }
        for user in users:
            report['count'] += 1
            if user['is_verified']:
                report['vefify']['is_verified'] += 1 
            else: 
                report['vefify']['not_verified'] += 1
            if user['is_locked']:
                report['lock']['is_locked'] += 1 
            else: 
                report['lock']['not_locked'] += 1
            rating = user["rating"]["chess"]["mu"]
            if rating < 1000:
                report['rating']['<1000'] += 1
            elif rating < 1500:
                report['rating']['<1500'] += 1
            elif rating < 2000:
                report['rating']['<2000'] += 1
            else:
                report['rating']['>2000'] += 1
            if user['role'] == 'ADMIN':
                report['role']['admin'] += 1
            else:
                report['role']['user'] += 1

        return report