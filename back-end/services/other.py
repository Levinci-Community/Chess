from bson import ObjectId
from database.mongodb import get_db
from datetime import datetime

class OtherService():
    def __init__(self) -> None:
        self.db = get_db()
        self.others_collection = self.db['others']
        self.payment_history_collection = self.db['payment_history']
        self.videos_collection = self.db['videos']
        self.tournaments_collection = self.db['tournaments']
        self.lobbies_collection = self.db['lobbies']
        self.lessons_collection = self.db['lessons']
        self.books_collection = self.db['books']
        self.blogs_collection = self.db['blogs']
        self.achievements_collection = self.db['achievements']
        self.notifications_collection = self.db['notifications']
    
    def get_offline_calendar(self):
        data = self.others_collection.find().sort("updated_at", -1)
        data = [item for item in data]
        if not data:
            return {}
        record = data[0]
        record["_id"] = str(record["_id"])
        return record
    
    def set_offline_calendar(self, time, location):
        data = self.others_collection.find().sort("updated_at", -1)
        data = [item for item in data]
        offline_calendar_data = {
            'time': time,
            'location': location,
            'updated_at': datetime.now().isoformat()
        }

        if not data:
            self.others_collection.insert_one(offline_calendar_data)
            return True

        record = data[0]
        result = self.others_collection.update_one({'_id': record["_id"]}, {'$set': offline_calendar_data})
        return result.modified_count > 0
    
    def log_payment(self, type, status, orderId, response):
        payment_data = {
            'type': type,
            'orderId': orderId,
            'status': status,
            'timestamp': datetime.now().isoformat(),
            'response': response
        }
        self.payment_history_collection.insert_one(payment_data)
        return True
    
    def get_all_payments(self):
        payments = self.payment_history_collection.find().sort("timestamp", -1)
        return [self._convert_id(payment) for payment in payments]
    
    def _convert_id(self, payment):
        payment['_id'] = str(payment['_id'])
        return payment
    def get_all_data(self):
        all_data = {}

        all_data['videos'] = [{'title': doc['title'], 'description': doc['description']} for doc in self.videos_collection.find()]
        all_data['tournaments'] = [self._convert_document(doc) for doc in self.tournaments_collection.find()]
        all_data['lobbies'] = [self._convert_document(doc) for doc in self.lobbies_collection.find({"status": "OPEN"})]
        all_data['lessons'] = [{'title': doc['title'], 'description': doc['description']} for doc in self.lessons_collection.find()]
        all_data['books'] = [{'title': doc['title'], 'description': doc['description']} for doc in self.books_collection.find()]
        all_data['blogs'] = [{'title': doc['title']} for doc in self.blogs_collection.find()]
        all_data['notifications'] = [{'title': doc['title'], 'description': doc['description']} for doc in self.notifications_collection.find()]
        all_data['calendar_meeting'] = [{'location': doc['location'], 'time': doc['time']} for doc in self.others_collection.find()]

        return all_data

    def _convert_document(self, document):
        for key, value in document.items():
            if isinstance(value, ObjectId):
                document[key] = str(value)
            elif isinstance(value, datetime):
                document[key] = value.isoformat()
            elif isinstance(value, list):
                document[key] = [self._convert_document(item) if isinstance(item, dict) else item for item in value]
            elif isinstance(value, dict):
                document[key] = self._convert_document(value)
        return document