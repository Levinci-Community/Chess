from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from services.achievement import AchievementService
from services.user import UserService

achievement_bp = Blueprint('achievement', __name__)

achievement_service = AchievementService()
user_service = UserService()

@achievement_bp.route('/api/achievements', methods=['GET'])
def get_all_achievements():
    try:
        achievements = achievement_service.get_all()
        return jsonify({
            "message": "success",
            "achievements": achievements
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@achievement_bp.route('/api/achievements/honor-list', methods=['GET'])
def get_honor_list():
    try:
        honor_list, events = achievement_service.get_honor_list()
        return jsonify({
            "message": "success",
            "honor_list": honor_list,
            "events": events
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@achievement_bp.route('/api/achievements/<achievement_id>', methods=['GET'])
def get_achievement_by_id(achievement_id):
    try:
        achievement = achievement_service.get(achievement_id)
        if achievement:
            return jsonify({
                "message": "success",
                "achievement": achievement
            }), 200
        else:
            return jsonify({'message': 'achievement not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@achievement_bp.route('/api/achievements', methods=['POST'])
@jwt_required()
def create_achievement():
    try:
        data = {
            "event": request.json.get('event'),
            "time": request.json.get('time'),
            "member": request.json.get('member'),
            "reward": request.json.get('reward'),
        }
        
        new_achievement = achievement_service.create(data)
        return jsonify({
            "message": "success",
            "achievement": new_achievement
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@achievement_bp.route('/api/achievements/<achievement_id>', methods=['PUT'])
@jwt_required()
def update_achievement(achievement_id):
    try:
        data = {
            "event": request.json.get('event'),
            "time": request.json.get('time'),
            "member": request.json.get('member'),
            "reward": request.json.get('reward'),
        }
        updated = achievement_service.update(achievement_id, data)
        if updated:
            return jsonify({
                "message": "success",
            }), 200
        else:
            return jsonify({'message': 'achievement not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@achievement_bp.route('/api/achievements/<achievement_id>', methods=['DELETE'])
@jwt_required()
def delete_achievement(achievement_id):
    try:
        success = achievement_service.delete(achievement_id)
        if success:
            return jsonify({'message': 'achievement deleted successfully'}), 200
        else:
            return jsonify({'message': 'achievement not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@achievement_bp.route('/api/achievements/top/<number>', methods=['GET'])
def get_top_achievements(number):
    try:
        achievements = achievement_service.get_top(int(number))
        return jsonify({
            "message": "success",
            "achievements": achievements
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
