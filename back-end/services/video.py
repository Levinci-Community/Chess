from bson import ObjectId
from database.mongodb import get_db
from datetime import datetime

class VideoService():
    def __init__(self) -> None:
        self.db = get_db()
        self.videos_collection = self.db['videos']

    def map(self, video):
        video['_id'] = str(video['_id'])
        return video

    def get_all(self):
        data = self.videos_collection.find({}).sort('updated_at', -1)
        data = [self.map(video) for video in data]
        return data
    
    def get(self, _id):
        return self.map(self.videos_collection.find_one({'_id': ObjectId(_id)}))

    def create(self, video):
        if '_id' in video:
            raise ValueError("Cannot create a video with an existing _id")

        video["created_at"] = datetime.now().isoformat()
        video["updated_at"] = datetime.now().isoformat()
        result = self.videos_collection.insert_one(video)
        return self.map(self.videos_collection.find_one({'_id': result.inserted_id}))
    
    def update(self, _id, video):
        existing_video = self.videos_collection.find_one({'_id': ObjectId(_id)})
        if not existing_video:
            return None  

        if '_id' in video:
            del video['_id'] 

        video["updated_at"] = datetime.now().isoformat()

        result = self.videos_collection.update_one({'_id': ObjectId(_id)}, {'$set': video})
        if result.modified_count == 0:
            return False
        return True

    def delete(self, video_id):
        result = self.videos_collection.delete_one({'_id': ObjectId(video_id)})
        return result.deleted_count > 0
    
    def get_top(self, number):
        data = self.videos_collection.find({}).sort('updated_at', -1).limit(number)
        data = [self.map(video) for video in data]
        return data