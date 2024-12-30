from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from logging import error
from services.tournament_game import TournamentGameService
from services.user import UserService

tournament_game_bp = Blueprint('tournament_game', __name__)

game_service = TournamentGameService()
user_service = UserService()

@tournament_game_bp.post('/api/tournament_game')
@jwt_required()
def newGame():
    try:
        game = request.get_json()
        newGame = game_service.create_game(game)
        return jsonify(newGame), 201
    except Exception as e:
        error(e)
        return "Fail to create new game.", 500
    
@tournament_game_bp.get('/api/tournament_game/<game_id>')
@jwt_required()
def getGame(game_id: str):
    game = game_service.get_game(game_id)
    game['white_player'] = user_service.get_by_id(game['white']).to_json()
    game['black_player'] = user_service.get_by_id(game['black']).to_json()
    return jsonify(game), 200
    
@tournament_game_bp.get('/api/tournament_games/tv')
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

@tournament_game_bp.get('/api/tournament_games')
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
    
@tournament_game_bp.get('/api/tournamentGame/report')
@jwt_required()
def getGameReport():
    try:
        history = game_service.get_tournament_game_report()
        return jsonify(history), 200
    except Exception as e:
        error(e)
        return "Fail to get game history.", 500

@tournament_game_bp.get('/api/tournamentGame/<tournament_id>/game-history')
@jwt_required()
def get_tournament_game_by_user_id(tournament_id):
    try:
        user_id = get_jwt_identity()
        games = game_service.get_tournament_game_by_user_id(tournament_id, user_id)
        return jsonify({"data": games}), 200
    except Exception as e:
        error(e)
        return "Fail to get game history.", 500