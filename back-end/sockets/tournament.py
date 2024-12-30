from services.tournament import TournamentService
from services.user import UserService

from flask_socketio import emit, join_room, leave_room

user_service = UserService()
tournament_service = TournamentService()

def join_tournament(tournament_id, user_id):
    user = user_service.get_by_id(user_id)
    if not user:
        print("User not found.") 
        return
    
    tournament = tournament_service.get(tournament_id)
    if not tournament:
        print("Tournament not found")
        return

    tournament_players = tournament.get("players", [])
    if user_id not in tournament_players:
        print("User did not join tournament")
        return
    
    # add user to room & pool
    room = f"tournament_{tournament_id}"
    join_room(room=room)
    tournament_service.join_pool(tournament_id, user_id)
    game = tournament_service.match_game(tournament_id)

    if not game:    
        emit("join_tournament", {}, room=room)
        return
    
    emit("tournament_game_found", game, room=room)

def leave_tournament(tournament_id, user_id):
    user = user_service.get_by_id(user_id)
    if not user:
        print("User not found.") 
        return
    
    tournament = tournament_service.get(tournament_id)
    if not tournament:
        print("Tournament not found")
        return

    tournament_players = tournament.get("players", [])
    if user_id in tournament_players:
        print("User is not remove from tournament")
        return

    # add user to room & pool
    room = f"tournament_{tournament_id}"
    join_room(room=room)
    tournament_service.leave_pool(tournament_id, user_id)