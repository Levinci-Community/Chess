from flask import Blueprint, jsonify, request
from database.mongodb import get_mongo
from flask_login import login_required
from logging import error
from services.user import UserService
from database.redis import get_redis

test_bp = Blueprint('test', __name__)

@test_bp.get('/api/test/connection')
def test_connection():
    try:
        client = get_mongo()
        return "You successfully connected to MongoDB!", 200
    except Exception as e:
        error(e)
        return "Fail to connected to MongoDB!", 500
    
@test_bp.route('/api/test/user/all')
def get_all_user():
    service = UserService()
    data = service.get_all()
    return jsonify(data), 200

@test_bp.route('/api/test/redis')
def test_redis():
    redis = get_redis()
    return jsonify({}), 200

@test_bp.route('/api/test/redis/set', methods=['GET'])
def set_redis_value():
    key = request.args.get('key')
    value = request.args.get('value')
    
    if not key or not value:
        return jsonify({'error': 'Key or value is missing'}), 400

    redis = get_redis()
    try:
        redis.set(key, value)
        return jsonify({}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/api/test/redis/get', methods=['GET'])
def get_redis_value():
    key = request.args.get('key')
    
    if not key:
        return jsonify({'error': 'Key is missing'}), 400

    redis = get_redis()
    try:
        value = redis.get(key)
        if value is None:
            return jsonify({'error': 'Key not found'}), 404
        return jsonify({key: value.decode()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
