from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from services.banner import BannerService
from services.user import UserService

banner_bp = Blueprint('banner', __name__)

banner_service = BannerService()
user_service = UserService()

@banner_bp.route('/api/banners', methods=['GET'])
def get_all_banners():
    try:
        banners = banner_service.get_all()
        return jsonify({
            "message": "success",
            "banners": banners
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@banner_bp.route('/api/banners/<banner_id>', methods=['GET'])
def get_banner_by_id(banner_id):
    try:
        banner = banner_service.get(banner_id)
        if banner:
            return jsonify({
                "message": "success",
                "banner": banner
            }), 200
        else:
            return jsonify({'message': 'banner not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@banner_bp.route('/api/banners', methods=['POST'])
@jwt_required()
def create_banner():
    try:
        data = {
            "title": request.form.get('title'),
            "description": request.form.get('description'),
            "image": request.files.get('image'),
            "content": request.form.get('content')
        }
        new_banner = banner_service.create(data)
        return jsonify({
            "message": "success",
            "banner": new_banner
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@banner_bp.route('/api/banners/<banner_id>', methods=['PUT'])
@jwt_required()
def update_banner(banner_id):
    try:
        data = {
            "title": request.form.get('title'),
            "description": request.form.get('description'),
            "image": request.files.get('image'),
            "content": request.form.get('content')
        }
        updated = banner_service.update(banner_id, data)
        if updated:
            return jsonify({
                "message": "success",
            }), 200
        else:
            return jsonify({'message': 'banner not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@banner_bp.route('/api/banners/<banner_id>', methods=['DELETE'])
@jwt_required()
def delete_banner(banner_id):
    try:
        success = banner_service.delete(banner_id)
        if success:
            return jsonify({'message': 'banner deleted successfully'}), 200
        else:
            return jsonify({'message': 'banner not found'}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@banner_bp.route('/api/banners/client', methods=['GET'])
def get_top_banners():
    try:
        banners = banner_service.clientGet()
        return jsonify({
            "message": "success",
            "banners": banners
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500