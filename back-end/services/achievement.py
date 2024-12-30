from bson import ObjectId
from database.mongodb import get_db
from datetime import datetime

class AchievementService():
    def __init__(self) -> None:
        self.db = get_db()
        self.achievements_collection = self.db['achievements']

    def map(self, achievement):
        achievement['_id'] = str(achievement['_id'])
        return achievement

    def get_all(self):
        data = self.achievements_collection.find({}).sort('updated_at', -1)
        data = [self.map(achievement) for achievement in data]
        return data
    
    def get_honor_list(self):
        # get all
        data = self.achievements_collection.find({})
        
        # group
        grouped_data = {}
        events = []
        for item in data:
            time = item["time"]
            obj = {"event": item["event"], "member": item["member"], "reward": item["reward"]}
            if time not in grouped_data:
                grouped_data[time] = [obj]
                events.append({"time": time, "event": item["event"]})
            else: grouped_data[time].append(obj)
        return grouped_data, events
    
    def get(self, _id):
        return self.map(self.achievements_collection.find_one({'_id': ObjectId(_id)}))

    def create(self, achievement):
        if '_id' in achievement:
            raise ValueError("Cannot create a achievement with an existing _id")

        achievement["created_at"] = datetime.now().isoformat()
        achievement["updated_at"] = datetime.now().isoformat()
        result = self.achievements_collection.insert_one(achievement)
        return self.map(self.achievements_collection.find_one({'_id': result.inserted_id}))
    
    def update(self, _id, achievement):
        existing_achievement = self.achievements_collection.find_one({'_id': ObjectId(_id)})
        if not existing_achievement:
            return None  

        if '_id' in achievement:
            del achievement['_id'] 

        achievement["updated_at"] = datetime.now().isoformat()

        result = self.achievements_collection.update_one({'_id': ObjectId(_id)}, {'$set': achievement})
        if result.modified_count == 0:
            return False
        return True

    def delete(self, achievement_id):
        result = self.achievements_collection.delete_one({'_id': ObjectId(achievement_id)})
        return result.deleted_count > 0
    
    def get_top(self, number):
        data = self.achievements_collection.find({}).sort('updated_at', -1).limit(number)
        data = [self.map(achievement) for achievement in data]
        return data