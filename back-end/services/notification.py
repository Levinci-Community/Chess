from bson import ObjectId
from database.mongodb import get_db
from datetime import datetime

class NotificationService():
    def __init__(self) -> None:
        self.db = get_db()
        self.notifications_collection = self.db['notifications']

    def map(self, notification):
        notification['_id'] = str(notification['_id'])
        return notification

    def get_all(self):
        data = self.notifications_collection.find({}).sort('updated_at', -1)
        data = [self.map(notification) for notification in data]
        return data
    
    def get(self, _id):
        return self.map(self.notifications_collection.find_one({'_id': ObjectId(_id)}))

    def create(self, notification):
        if '_id' in notification:
            raise ValueError("Cannot create a notification with an existing _id")

        notification["created_at"] = datetime.now().isoformat()
        notification["updated_at"] = datetime.now().isoformat()
        result = self.notifications_collection.insert_one(notification)
        return self.map(self.notifications_collection.find_one({'_id': result.inserted_id}))
    
    def update(self, _id, notification):
        existing_notification = self.notifications_collection.find_one({'_id': ObjectId(_id)})
        if not existing_notification:
            return None  

        if '_id' in notification:
            del notification['_id'] 

        notification["updated_at"] = datetime.now().isoformat()

        result = self.notifications_collection.update_one({'_id': ObjectId(_id)}, {'$set': notification})
        if result.modified_count == 0:
            return False
        return True

    def delete(self, notification_id):
        result = self.notifications_collection.delete_one({'_id': ObjectId(notification_id)})
        return result.deleted_count > 0
    
    def get_top(self):
        data = self.notifications_collection.find({}).sort('updated_at', -1).limit(5)
        data = [self.map(notification) for notification in data]
        return data