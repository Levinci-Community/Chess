from services.tournament_game import TournamentGameService
from services.user import UserService
from flask_socketio import emit, join_room
from database.redis import get_redis
import json

game_service = TournamentGameService()
user_service = UserService()
redis = get_redis()

def join_game(game_id: str): 
    game = game_service.get_game(game_id)
    room = f'tournament_game-{game_id}'
    join_room(room)
    rawData = redis.get(room)
    data = json.loads(rawData)
    emit('tournament_game_game_start', {'game_id': game_id, "status": game["status"], "data": data}, room=room)

def send_move(game_id: str, fen: str, move: str, whiteTime: int, blackTime: int):
    room = f'tournament_game-{game_id}'
    data = {
            'move': move, 
            'fen': fen,
            'game_id': game_id,
            'whiteTime': whiteTime,
            'blackTime': blackTime
        }
    emit('tournament_game_receive_move', data, room=room)
    redis.set(room, json.dumps(data))

def offer_draw(game_id: str, player_offer_id: str):
    room = f'tournament_game-{game_id}'
    emit("tournament_game_offer_draw", {'game_id': game_id, "player_offer_id": player_offer_id}, room=room)

def accept_draw(game_id: str, player_accept_id: str):
    room = f'tournament_game-{game_id}'
    result = game_service.draw(game_id)
    if result:
        emit("tournament_game_accept_draw", {'game_id': game_id, "player_accept_id": player_accept_id}, room=room)

def reject_draw(game_id: str, player_reject_id: str):
    room = f'tournament_game-{game_id}'
    emit("tournament_game_reject_draw", {'game_id': game_id, "player_reject_id": player_reject_id}, room=room)

def resign(game_id: str, player_resign_id: str):
    room = f'tournament_game-{game_id}'
    result = game_service.resign(game_id, player_resign_id)
    if result:
        emit("tournament_game_resign", {'game_id': game_id, "player_resign_id": player_resign_id}, room=room)

def timeout(game_id: str, player_timeout_id: str):
    room = f'tournament_game-{game_id}'
    result = game_service.timeout(game_id, player_timeout_id)
    if result:
        emit("tournament_game_timeout", {'game_id': game_id, "player_timeout_id": player_timeout_id}, room=room)
    
def checkmate(game_id: str, winner_id: str):
    print("###############", game_id, winner_id)
    room = f'tournament_game-{game_id}'
    result = game_service.checkmate(game_id, winner_id)   
    if result:
        emit("tournament_game_checkmate", {'game_id': game_id}, room=room)