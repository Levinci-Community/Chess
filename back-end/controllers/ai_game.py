from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from logging import error
from services.ai_game import AiGameService
from services.user import UserService

ai_game_bp = Blueprint('ai_game', __name__)

game_service = AiGameService()
user_service = UserService()

@ai_game_bp.post('/api/ai-game')
@jwt_required()
def newAiGame():
    user_id = get_jwt_identity()
    try:
        game = request.get_json()
        newAiGame = game_service.create(user_id, game)
        return jsonify(newAiGame), 201
    except Exception as e:
        error(e)
        return "Fail to create game.", 500
    
@ai_game_bp.get('/api/ai-game/<id>')
@jwt_required()
def get(id):
    try:
        newAiGame = game_service.get(id)
        return jsonify(newAiGame), 200
    except Exception as e:
        error(e)
        return "Fail to get game data.", 500
    
@ai_game_bp.put('/api/ai-game/<id>/draw')
@jwt_required()
def draw(id):
    try:
        game_service.draw(id)
        jsonify({}), 200
    except Exception as e:
        error(e)
        return "Fail to get game data.", 500
    
@ai_game_bp.put('/api/ai-game/<id>/resign')
@jwt_required()
def resign(id):
    try:
        game_service.resign(id)
        return jsonify({}), 200
    except Exception as e:
        error(e)
        return "Fail to get game data.", 500
    
@ai_game_bp.put('/api/ai-game/<id>/checkmate')
@jwt_required()
def checkmate(id):
    try:
        data = request.get_json()
        player_win_id = data['player_win_id']
        game_service.checkmate(id, player_win_id)
        return jsonify({}), 200
    except Exception as e:
        error(e)
        return "Fail to get game data.", 500
    
@ai_game_bp.post('/api/ai-game/<id>/request_ai_move')
@jwt_required()
def request_ai_move(id):
    try:
        data = request.get_json()
        fen = data["fen"]
        move = game_service.request_ai_move(id, fen)
        return jsonify({'move': move}), 200
    except Exception as e:
        error(e)
        return "Fail to send move.", 500
    
@ai_game_bp.get('/api/aiGame/report')
@jwt_required()
def getGameReport():
    try:
        history = game_service.get_offline_game_report()
        return jsonify(history), 200
    except Exception as e:
        error(e)
        return "Fail to get game history.", 500
    