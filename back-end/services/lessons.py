from flask import Flask, request, jsonify
from bson import ObjectId
from database.mongodb import get_db
from datetime import datetime

app = Flask(__name__)

class LessonService():
    def __init__(self) -> None:
        self.db = get_db()
        self.lessons_collection = self.db['lessons']

    def map_lesson(self, lesson):
        lesson['_id'] = str(lesson['_id'])
        return lesson

    def create_lesson(self, lesson_data):
        lesson_data["created_at"] = datetime.now().isoformat()
        result = self.lessons_collection.insert_one(lesson_data)
        return self.map_lesson(self.lessons_collection.find_one({'_id': result.inserted_id}))

    def get_lessons(self):
        lessons = self.lessons_collection.find({})
        return [self.map_lesson(lesson) for lesson in lessons]
    
    def clear_lessons(self):
        result = self.lessons_collection.delete_many({})
        return result.deleted_count
    
    def get_lesson_by_id(self, lesson_id):
        lesson = self.lessons_collection.find_one({'_id': ObjectId(lesson_id)})
        if lesson:
            return self.map_lesson(lesson)
        else:
            raise Exception('Lesson not found')
        
    def delete_lesson_by_id(self, lesson_id):
        result = self.lessons_collection.delete_one({'_id': ObjectId(lesson_id)})
        if result.deleted_count > 0:
            return True
        else:
            return False
