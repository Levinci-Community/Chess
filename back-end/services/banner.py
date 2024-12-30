from bson import ObjectId
from database.mongodb import get_db
from datetime import datetime
from services.image import ImageService
import uuid

class BannerService():
    def __init__(self) -> None:
        self.db = get_db()
        self.banners_collection = self.db['banners']

    def map(self, banner):
        banner['_id'] = str(banner['_id'])
        return banner

    def get_all(self):
        data = self.banners_collection.find({}).sort('updated_at', -1)
        data = [self.map(banner) for banner in data]
        return data
    
    def get(self, _id):
        return self.map(self.banners_collection.find_one({'_id': ObjectId(_id)}))

    def create(self, banner):
        if '_id' in banner:
            raise ValueError("Cannot create a banner with an existing _id")

        banner["created_at"] = datetime.now().isoformat()
        banner["updated_at"] = datetime.now().isoformat()
        image = banner["image"]
        status, message = ImageService().save_file(image, f"banner-{uuid.uuid4().hex}", image.filename.split('.')[-1])
        if not status:
            raise Exception(message)
        banner["image"] = message
        result = self.banners_collection.insert_one(banner)
        return self.map(self.banners_collection.find_one({'_id': result.inserted_id}))
    
    def update(self, _id, banner):
        existing_banner = self.banners_collection.find_one({'_id': ObjectId(_id)})
        if not existing_banner:
            return None  

        if '_id' in banner:
            del banner['_id'] 

        banner["updated_at"] = datetime.now().isoformat()

        image = banner["image"]
        old_file_name = existing_banner["image"]
        if image and type(image) != str:
            status, message = ImageService().save_file(image, old_file_name, image.filename.split('.')[-1])
            if not status:
                raise Exception(message)
            banner["image"] = message
        else:
            banner["image"] = old_file_name
        result = self.banners_collection.update_one({'_id': ObjectId(_id)}, {'$set': banner})
        if result.modified_count == 0:
            return False
        return True

    def delete(self, banner_id):
        result = self.banners_collection.delete_one({'_id': ObjectId(banner_id)})
        return result.deleted_count > 0
    
    def clientGet(self):
        data = self.banners_collection.find().sort('updated_at', -1)
        data = [banner['image'] for banner in data]
        return data