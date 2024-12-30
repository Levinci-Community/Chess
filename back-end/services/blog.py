from bson import ObjectId
from database.mongodb import get_db
from datetime import datetime
from services.user import UserService
from services.image import ImageService
import uuid


class BlogService():
    def __init__(self) -> None:
        self.db = get_db()
        self.blogs_collection = self.db['blogs']
   
    def map(self, blog):
        blog['_id'] = str(blog['_id'])
        return blog

    def get_all(self):
        data = self.blogs_collection.find({}, {"comments": 0, "users_like": 0})
        data = data.sort('updated_at', -1)
        data = [self.map(blog) for blog in data]
        return data
    
    def get(self, _id):
        return self.map(self.blogs_collection.find_one({'_id': ObjectId(_id)}))

    def create(self, blog):
        if '_id' in blog:
            raise ValueError("Cannot create a blog with an existing _id")
        
        blog["likes"] = 0
        blog["comments"] = []
        blog["users_like"] = []
        blog["created_at"] = datetime.now().isoformat()
        blog["updated_at"] = datetime.now().isoformat()
        image = blog["image"]
        status, message = ImageService().save_file(image, f"blog-{uuid.uuid4().hex}", image.filename.split('.')[-1])
        if not status:
            raise Exception(message)
        blog["image"] = message
        result = self.blogs_collection.insert_one(blog)
        return self.map(self.blogs_collection.find_one({'_id': result.inserted_id}))
    
    def update(self, _id, blog):
        existing_blog = self.blogs_collection.find_one({'_id': ObjectId(_id)})
        if not existing_blog:
            return None  

        if '_id' in blog:
            del blog['_id'] 

        blog["likes"] = existing_blog["likes"]
        blog["comments"] = existing_blog["comments"]
        blog["users_like"] = existing_blog["users_like"]
        blog["updated_at"] = datetime.now().isoformat()

        image = blog["image"]
        old_file_name = existing_blog["image"]
        if image and type(image) != str:
            status, message = ImageService().save_file(image, old_file_name, image.filename.split('.')[-1])
            if not status:
                raise Exception(message)
            blog["image"] = message
        else:
            blog["image"] = old_file_name
        result = self.blogs_collection.update_one({'_id': ObjectId(_id)}, {'$set': blog})
        if result.modified_count == 0:
            return False
        return True

    def delete(self, blog_id):
        result = self.blogs_collection.delete_one({'_id': ObjectId(blog_id)})
        return result.deleted_count > 0
    
    def add_comment(self, blog_id, comment_data, user_id):
        comment_data["user_id"] = str(user_id)
        comment_data["created_at"] = datetime.now().isoformat()
        self.blogs_collection.update_one(
            {'_id': ObjectId(blog_id)},
            {'$push': {'comments': comment_data}}
        )
        return self.map(self.blogs_collection.find_one({'_id': ObjectId(blog_id)}))

    def remove_comment(self, blog_id, comment_id):
        self.blogs_collection.update_one(
            {'_id': ObjectId(blog_id)},
            {'$pull': {'comments': {'_id': ObjectId(comment_id)}}}
        )
        return self.map(self.blogs_collection.find_one({'_id': ObjectId(blog_id)}))

    def toggle_like(self, blog_id, user_id):
        blog = self.blogs_collection.find_one({'_id': ObjectId(blog_id)})
        
        if user_id in blog['users_like']:
            # User has already liked the blog, so unlike it
            self.blogs_collection.update_one(
                {'_id': ObjectId(blog_id)},
                {'$inc': {'likes': -1}},
                {'$pull': {'users_like': user_id}}
            )
        else:
            # User hasn't liked the blog, so like it
            self.blogs_collection.update_one(
                {'_id': ObjectId(blog_id)},
                {'$inc': {'likes': 1}},
                {'$addToSet': {'users_like': user_id}},
            )
        
        return self.map(self.blogs_collection.find_one({'_id': ObjectId(blog_id)}))
    
    def get_top(self, number):
        data = self.blogs_collection.find({}).sort('updated_at', -1).limit(number)
        data = [self.map(blog) for blog in data]
        return data