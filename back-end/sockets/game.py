from services.lobby import LobbyService
from services.game import GameService
from services.user import UserService
from flask_socketio import emit, join_room
from database.redis import get_redis
import json

lobby_service = LobbyService()
game_service = GameService()
user_service = UserService()
redis = get_redis()

def request_game(user_id, lobby_id):
    lobby = lobby_service.get_lobby(lobby_id) 
    if lobby['status'] == 'OPEN':
        print("Lobby is OPEN!")
        return
    
    user = user_service.get_by_id(user_id)
    if not user:
        print("User not found!")
        return
    
    if user.id == lobby['player_id']:
        print("User created lobbies is request!")
        return

    # get lobby
    game = game_service.get_by_lobby_id(lobby_id=lobby_id)
    if not game: # status == close => create game
        game = game_service.create_online_game(lobby, user)
    emit('game_ready', {'game': game, 'lobby_id': lobby_id}, broadcast=True, namespace='/')

def join_game(game_id: str): 
    game = game_service.get_game(game_id, "online")
    room = f'game-{game_id}'
    join_room(room)
    rawData = redis.get(room)
    data = json.loads(rawData)
    emit('game_start', {'game_id': game_id, "status": game["status"], "data": data}, room=room)

def send_move(game_id: str, fen: str, move: str, whiteTime: int, blackTime: int):
    room = f'game-{game_id}'
    data = {
            'move': move, 
            'fen': fen,
            'game_id': game_id,
            'whiteTime': whiteTime,
            'blackTime': blackTime
        }
    emit('receive_move', data, room=room)
    redis.set(room, json.dumps(data))

def offer_draw(game_id: str, player_offer_id: str):
    room = f'game-{game_id}'
    emit("offer_draw", {'game_id': game_id, "player_offer_id": player_offer_id}, room=room)

def accept_draw(game_id: str, player_accept_id: str):
    room = f'game-{game_id}'
    result = game_service.draw(game_id)
    if result:
        emit("accept_draw", {'game_id': game_id, "player_accept_id": player_accept_id}, room=room)

def reject_draw(game_id: str, player_reject_id: str):
    room = f'game-{game_id}'
    emit("reject_draw", {'game_id': game_id, "player_reject_id": player_reject_id}, room=room)

def resign(game_id: str, player_resign_id: str):
    room = f'game-{game_id}'
    result = game_service.resign(game_id, player_resign_id)
    if result:
        emit("resign", {'game_id': game_id, "player_resign_id": player_resign_id}, room=room)

def timeout(game_id: str, player_timeout_id: str):
    room = f'game-{game_id}'
    result = game_service.timeout(game_id, player_timeout_id)
    if result:
        emit("timeout", {'game_id': game_id, "player_timeout_id": player_timeout_id}, room=room)
    
def checkmate(game_id: str, winner_id: str):
    room = f'game-{game_id}'
    result = game_service.checkmate(game_id, winner_id)   
    if result:
        emit("checkmate", {'game_id': game_id}, room=room)