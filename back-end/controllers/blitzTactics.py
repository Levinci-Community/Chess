from flask import Blueprint, jsonify, redirect, request
from flask_jwt_extended import jwt_required
from services.user import UserService
import base64

blitztactic_bp = Blueprint('blitztactics', __name__)

BLITZ_TACTICS_URL = "https://chess.workon.space/UcG7F4xRfTzW1eVtLyPmNkQiOoAhDjBsErXuZvCwYxJbGzHpQqKiUlPfKsJdMgInLbHnVcXdFgBvNcMdHgXjZkLpWmRnPiOuYqAtWsEdRfYgUhIjOlP"

user_service = UserService()

@blitztactic_bp.route('/api/blitz-tactics/haste', methods=['GET'])
def pass_haste():
    token = request.args.get('token')
    if not token:
        return jsonify('Token is missing'), 400
    try:
        user_id = base64.b64decode(token).decode('utf-8')
        user = user_service.get_by_id(user_id=user_id)
        if not user:
            return jsonify('User not found'), 400
        return redirect(f"{BLITZ_TACTICS_URL}/haste")
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@blitztactic_bp.route('/api/blitz-tactics/three', methods=['GET'])
def pass_three():
    token = request.args.get('token')
    if not token:
        return jsonify('Token is missing'), 400
    try:
        user_id = base64.b64decode(token).decode('utf-8')
        user = user_service.get_by_id(user_id=user_id)
        if not user:
            return jsonify('User not found'), 400
        return redirect(f"{BLITZ_TACTICS_URL}/three")
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@blitztactic_bp.route('/api/blitz-tactics/countdown', methods=['GET'])
def pass_countdown():
    token = request.args.get('token')
    if not token:
        return jsonify('Token is missing'), 400
    try:
        user_id = base64.b64decode(token).decode('utf-8')
        user = user_service.get_by_id(user_id=user_id)
        if not user:
            return jsonify('User not found'), 400
        return redirect(f"{BLITZ_TACTICS_URL}/countdown")
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@blitztactic_bp.route('/api/blitz-tactics/speedrun', methods=['GET'])
def pass_speedrun():
    token = request.args.get('token')
    if not token:
        return jsonify('Token is missing'), 400
    try:
        user_id = base64.b64decode(token).decode('utf-8')
        user = user_service.get_by_id(user_id=user_id)
        if not user:
            return jsonify('User not found'), 400
        return redirect(f"{BLITZ_TACTICS_URL}/speedrun")
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@blitztactic_bp.route('/api/blitz-tactics/rated', methods=['GET'])
def pass_rated():
    token = request.args.get('token')
    if not token:
        return jsonify('Token is missing'), 400
    try:
        user_id = base64.b64decode(token).decode('utf-8')
        user = user_service.get_by_id(user_id=user_id)
        if not user:
            return jsonify('User not found'), 400
        return redirect(f"{BLITZ_TACTICS_URL}/rated")
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@blitztactic_bp.route('/api/blitz-tactics/infinity', methods=['GET'])
def pass_infinity():
    token = request.args.get('token')
    if not token:
        return jsonify('Token is missing'), 400
    try:
        user_id = base64.b64decode(token).decode('utf-8')
        user = user_service.get_by_id(user_id=user_id)
        if not user:
            return jsonify('User not found'), 400
        return redirect(f"{BLITZ_TACTICS_URL}/infinity")
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@blitztactic_bp.route('/api/blitz-tactics/repetition', methods=['GET'])
def pass_repetition():
    token = request.args.get('token')
    if not token:
        return jsonify('Token is missing'), 400
    try:
        user_id = base64.b64decode(token).decode('utf-8')
        user = user_service.get_by_id(user_id=user_id)
        if not user:
            return jsonify('User not found'), 400
        return redirect(f"{BLITZ_TACTICS_URL}/repetition")
    except Exception as e:
        return jsonify({"message": str(e)}), 500