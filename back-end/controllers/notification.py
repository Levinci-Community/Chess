from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.notification import NotificationService
from services.user import UserService
from services.game import GameService

notification_bp = Blueprint('notification', __name__)

notification_service = NotificationService()
game_service = GameService()
user_service = UserService()


@notification_bp.route('/api/notifications', methods=['GET'])
def get_all_notifications():
    try:
        notifications = notification_service.get_all()
        return jsonify({
            "message": "success",
            "notifications": notifications
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@notification_bp.route('/api/notifications/<notification_id>', methods=['GET'])
def get_notification_by_id(notification_id):
    try:
        notification = notification_service.get(notification_id)
        if notification:
            return jsonify({
                "message": "success",
                "notification": notification
            }), 200
        else:
            return jsonify({'message': 'notification not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@notification_bp.route('/api/notifications/<notification_id>/your-games', methods=['GET'])
@jwt_required()
def get_game_in_notification(notification_id):
    try:
        user_id = get_jwt_identity()
        user = user_service.get_by_id(user_id)
        if not user:
            return jsonify({"message": "User not found."}), 400

        # get all game in notifications
        games = game_service.get_by_notification_id(notification_id)

        # filter game has user_id
        res = []
        for game in games:
            if game["white"] == user_id or game["black"] == user_id:
                res.append(game)

        return jsonify({
            "message": "success",
            "games": res
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@notification_bp.route('/api/notifications', methods=['POST'])
@jwt_required()
def create_notification():
    try:
        data = {
            "title": request.json.get('title'),
            "description": request.json.get('description')
        }
        
        new_notification = notification_service.create(data)
        return jsonify({
            "message": "success",
            "notification": new_notification
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@notification_bp.route('/api/notifications/<notification_id>', methods=['PUT'])
@jwt_required()
def update_notification(notification_id):
    try:
        data = {
            "title": request.json.get('title'),
            "description": request.json.get('description'),
        }
        updated = notification_service.update(notification_id, data)
        if updated:
            return jsonify({
                "message": "success",
            }), 200
        else:
            return jsonify({'message': 'notification not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@notification_bp.route('/api/notifications/<notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    try:
        success = notification_service.delete(notification_id)
        if success:
            return jsonify({'message': 'notification deleted successfully'}), 200
        else:
            return jsonify({'message': 'notification not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@notification_bp.route('/api/notifications/top', methods=['GET'])
def get_top_notifications():
    try:
        notifications = notification_service.get_top()
        return jsonify({
            "message": "success",
            "notifications": notifications
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500