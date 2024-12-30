from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.lessons import LessonService

lesson_bp = Blueprint('lessons', __name__)
lesson_service = LessonService()

@lesson_bp.post('/api/lessons')
@jwt_required()
def create_lesson():
    try:
        lesson_data = request.get_json()
        new_lesson = lesson_service.create_lesson(lesson_data)
        return jsonify(new_lesson), 201
    except Exception as e:
        return str(e), 500

@lesson_bp.get('/api/lessons')
def get_lessons():
    try:
        lessons = lesson_service.get_lessons()  
        return jsonify(lessons), 200
    except Exception as e:
        return str(e), 500

@lesson_bp.delete('/api/lessons/<lesson_id>')
@jwt_required()
def delete_lesson(lesson_id):
    try:
        user_id = get_jwt_identity()
        lesson = lesson_service.get_lesson_by_id(lesson_id)
        if lesson['author_id'] != user_id:
            return 'Unauthorized', 401

        lesson_service.delete_lesson_by_id(lesson_id)
        return 'Lesson deleted successfully', 200
    except Exception as e:
        return str(e), 500
    
@lesson_bp.get('/api/lessons/<lesson_id>')
def get_lesson_by_id(lesson_id):
    try:
        lesson = lesson_service.get_lesson_by_id(lesson_id)
        return jsonify(lesson), 200
    except Exception as e:
        return str(e), 500
