from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from services.video import VideoService
from services.user import UserService

video_bp = Blueprint('video', __name__)

video_service = VideoService()
user_service = UserService()

@video_bp.route('/api/videos', methods=['GET'])
def get_all_videos():
    try:
        videos = video_service.get_all()
        return jsonify({
            "message": "success",
            "videos": videos
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@video_bp.route('/api/videos/<video_id>', methods=['GET'])
def get_video_by_id(video_id):
    try:
        video = video_service.get(video_id)
        if video:
            return jsonify({
                "message": "success",
                "video": video
            }), 200
        else:
            return jsonify({'message': 'video not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@video_bp.route('/api/videos', methods=['POST'])
@jwt_required()
def create_video():
    try:
        data = {
            "title": request.json.get('title'),
            "description": request.json.get('description'),
            "link": request.json.get('link'),
            "content": request.json.get('content'),
        }
        
        new_video = video_service.create(data)
        return jsonify({
            "message": "success",
            "video": new_video
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@video_bp.route('/api/videos/<video_id>', methods=['PUT'])
@jwt_required()
def update_video(video_id):
    try:
        data = {
            "title": request.json.get('title'),
            "description": request.json.get('description'),
            "link": request.json.get('link'),
            "content": request.json.get('content'),
        }
        updated = video_service.update(video_id, data)
        if updated:
            return jsonify({
                "message": "success",
            }), 200
        else:
            return jsonify({'message': 'video not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@video_bp.route('/api/videos/<video_id>', methods=['DELETE'])
@jwt_required()
def delete_video(video_id):
    try:
        success = video_service.delete(video_id)
        if success:
            return jsonify({'message': 'video deleted successfully'}), 200
        else:
            return jsonify({'message': 'video not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@video_bp.route('/api/videos/top/<number>', methods=['GET'])
def get_top_videos(number):
    try:
        videos = video_service.get_top(int(number))
        return jsonify({
            "message": "success",
            "videos": videos
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
