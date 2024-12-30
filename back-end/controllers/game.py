from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from logging import error
from services.game import GameService
from services.user import UserService

game_bp = Blueprint('game', __name__)

game_service = GameService()
user_service = UserService()

@game_bp.post('/api/game')
@jwt_required()
def newGame():
    try:
        game = request.get_json()
        mode = game['mode']
        newGame = game_service.create_game(game, mode)
        return jsonify(newGame), 201
    except Exception as e:
        error(e)
        return "Fail to create new game.", 500
    
@game_bp.get('/api/game/<game_id>&mode=<mode>')
@jwt_required()
def getGame(game_id: str, mode: str):
    game = game_service.get_game(game_id, mode)
    game['white_player'] = user_service.get_by_id(game['white']).to_json()
    game['black_player'] = user_service.get_by_id(game['black']).to_json()
    return jsonify(game), 200

@game_bp.put('/api/game/<game_id>')
@jwt_required()
def updateGame(game_id):
    try:
        game = request.get_json()
        game_service.update_game(game_id, game, "online")
        return "Game updated successfully.", 200
    except Exception as e:
        error(e)
        return "Fail to update game profile.", 500
    
@game_bp.delete('/api/game')
@jwt_required()
def deleteGame(game_id, mode):
    try:
        game_service.delete_game(game_id, mode)
        return "Game deleted successfully.", 200
    except Exception as e:
        error(e)
        return "Fail to delete game profile.", 500
    
@game_bp.get('/api/games/tv')
@jwt_required()
def getTV():
    try:
        games = game_service.get_tv()
        return jsonify({
            "message": "success",
            "games": games
        }), 200
    except Exception as e:
        error(e)
        return "Fail to get games.", 500

@game_bp.get('/api/games')
@jwt_required()
def getAll():
    try:
        games = game_service.get_all()
        return jsonify({
            "message": "success",
            "games": games
        }), 200
    except Exception as e:
        error(e)
        return "Fail to get games.", 500

@game_bp.post('/api/game/<game_id>/history')
@jwt_required()
def saveGameHistory(game_id):
    try:
        result = request.json.get('result')
        game_service.save_game_history(game_id, result)
        return jsonify({"message": "Game history saved successfully."}), 200
    except Exception as e:
        error(e)
        return "Fail to save game history.", 500

@game_bp.get('/api/player/<player_id>/history')
@jwt_required()
def getGameHistory(player_id):
    try:
        history = game_service.get_game_history(player_id)
        return jsonify(history), 200
    except Exception as e:
        error(e)
        return "Fail to get game history.", 500
    
@game_bp.get('/api/onlineGame/report')
@jwt_required()
def getGameReport():
    try:
        history = game_service.get_online_game_report()
        return jsonify(history), 200
    except Exception as e:
        error(e)
        return "Fail to get game history.", 500