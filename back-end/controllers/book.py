from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from services.book import BookService
from services.user import UserService

book_bp = Blueprint('book', __name__)

book_service = BookService()
user_service = UserService()

@book_bp.route('/api/books', methods=['GET'])
def get_all_books():
    try:
        books = book_service.get_all()
        return jsonify({
            "message": "success",
            "books": books
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@book_bp.route('/api/books/<book_id>', methods=['GET'])
def get_book_by_id(book_id):
    try:
        book = book_service.get(book_id)
        if book:
            return jsonify({
                "message": "success",
                "book": book
            }), 200
        else:
            return jsonify({'message': 'Book not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@book_bp.route('/api/books', methods=['POST'])
@jwt_required()
def create_book():
    try:
        data = {
            "title": request.form.get('title'),
            "description": request.form.get('description'),
            "image": request.files.get('image'),
            "content": request.form.get('content')
        }
        new_book = book_service.create(data)
        return jsonify({
            "message": "success",
            "book": new_book
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@book_bp.route('/api/books/<book_id>', methods=['PUT'])
@jwt_required()
def update_book(book_id):
    try:
        data = {
            "title": request.form.get('title'),
            "description": request.form.get('description'),
            "image": request.files.get('image'),
            "content": request.form.get('content')
        }
        updated = book_service.update(book_id, data)
        if updated:
            return jsonify({
                "message": "success",
            }), 200
        else:
            return jsonify({'message': 'Book not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@book_bp.route('/api/books/<book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    try:
        success = book_service.delete(book_id)
        if success:
            return jsonify({'message': 'Book deleted successfully'}), 200
        else:
            return jsonify({'message': 'Book not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@book_bp.route('/api/books/top/<number>', methods=['GET'])
def get_top_books(number:int):
    try:
        books = book_service.get_top(int(number))
        return jsonify({
            "message": "success",
            "books": books
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500