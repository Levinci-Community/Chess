from flask import Blueprint, jsonify, request
from flask_socketio import emit
from services.lobby import LobbyService
from services.game import GameService
from services.user import UserService
from flask_jwt_extended import jwt_required, get_jwt_identity

lobby_bp = Blueprint('lobby', __name__)
lobby_service = LobbyService()
game_service = GameService()

@lobby_bp.get('/api/lobby')
def getLobbies():
    try:
        lobbies = lobby_service.get_all_open_lobbies()
        return jsonify(lobbies), 200
    except Exception as e:
        return str(e), 500

@lobby_bp.post('/api/lobby')
@jwt_required()
def createLobby():
    try:
        user_id = get_jwt_identity()
        user = UserService().get_by_id(user_id)
        if not user: 
            raise Exception('User not found')
        lobby = request.get_json()
        newLobby = lobby_service.create_lobby(lobby, user_id)
        emit('lobby_created', {'lobby': newLobby}, broadcast=True, namespace='/')
        return jsonify(newLobby), 201
    except Exception as e:
        return str(e), 500
    
@lobby_bp.put('/api/lobby/<lobby_id>')
@jwt_required()
def closeLobby(lobby_id): 
    try:
        user_id = get_jwt_identity()
        user = UserService().get_by_id(user_id)
        if not user: 
            raise Exception('User not found')
        
        # close lobby
        lobby_service.close_lobby(lobby_id)
        emit('lobby_closed', {'lobby_id': lobby_id}, broadcast=True, namespace='/')
        return jsonify({}), 204
    except Exception as e:
        return str(e), 500