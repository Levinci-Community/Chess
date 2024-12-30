from bson import ObjectId
from database.mongodb import get_db
from datetime import datetime
from services.image import ImageService
import uuid

class BookService():
    def __init__(self) -> None:
        self.db = get_db()
        self.books_collection = self.db['books']

    def map(self, book):
        book['_id'] = str(book['_id'])
        return book

    def get_all(self):
        data = self.books_collection.find({}).sort('updated_at', -1)
        data = [self.map(book) for book in data]
        return data
    
    def get(self, _id):
        return self.map(self.books_collection.find_one({'_id': ObjectId(_id)}))

    def create(self, book):
        if '_id' in book:
            raise ValueError("Cannot create a book with an existing _id")

        book["created_at"] = datetime.now().isoformat()
        book["updated_at"] = datetime.now().isoformat()
        image = book["image"]
        status, message = ImageService().save_file(image, f"book-{uuid.uuid4().hex}", image.filename.split('.')[-1])
        if not status:
            raise Exception(message)
        book["image"] = message
        result = self.books_collection.insert_one(book)
        return self.map(self.books_collection.find_one({'_id': result.inserted_id}))
    
    def update(self, _id, book):
        existing_book = self.books_collection.find_one({'_id': ObjectId(_id)})
        if not existing_book:
            return None  

        if '_id' in book:
            del book['_id'] 

        book["updated_at"] = datetime.now().isoformat()

        image = book["image"]
        old_file_name = existing_book["image"]
        if image and type(image) != str:
            status, message = ImageService().save_file(image, old_file_name, image.filename.split('.')[-1])
            if not status:
                raise Exception(message)
            book["image"] = message
        else:
            book["image"] = old_file_name
        result = self.books_collection.update_one({'_id': ObjectId(_id)}, {'$set': book})
        if result.modified_count == 0:
            return False
        return True

    def delete(self, book_id):
        result = self.books_collection.delete_one({'_id': ObjectId(book_id)})
        return result.deleted_count > 0
    
    def get_top(self, number):
        data = self.books_collection.find({}).sort('updated_at', -1).limit(number)
        data = [self.map(book) for book in data]
        return data