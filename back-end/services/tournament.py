from bson import ObjectId
from database.mongodb import get_db
from database.redis import get_redis
from datetime import datetime
import random
from common.constant import *

class TournamentService():
    def __init__(self) -> None:
        self.db = get_db()
        self.tournaments_collection = self.db['tournaments']
        self.users_collection = self.db['users']
        self.redis = get_redis()
        self.tournament_games_collection = self.db['tournament_games']

    def map(self, tournament):
        tournament['_id'] = str(tournament['_id'])
        return tournament

    def get_all(self):
        data = self.tournaments_collection.find({}).sort('updated_at', -1)
        data = [self.map(tournament) for tournament in data]
        return data
    
    def get(self, _id):
        return self.map(self.tournaments_collection.find_one({'_id': ObjectId(_id)}))

    def create(self, tournament):
        if '_id' in tournament:
            raise ValueError("Cannot create a tournament with an existing _id")

        tournament["created_at"] = datetime.now().isoformat()
        tournament["updated_at"] = datetime.now().isoformat()
        result = self.tournaments_collection.insert_one(tournament)
        return self.map(self.tournaments_collection.find_one({'_id': result.inserted_id}))
    
    def update(self, _id, tournament):
        existing_tournament = self.tournaments_collection.find_one({'_id': ObjectId(_id)})
        if not existing_tournament:
            return None  

        if '_id' in tournament:
            del tournament['_id'] 

        tournament["updated_at"] = datetime.now().isoformat()

        result = self.tournaments_collection.update_one({'_id': ObjectId(_id)}, {'$set': tournament})
        if result.modified_count == 0:
            return False
        return True

    def delete(self, tournament_id):
        result = self.tournaments_collection.delete_one({'_id': ObjectId(tournament_id)})
        return result.deleted_count > 0
    
    def join(self, tournament_id, user_id):
        user = self.users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return False
        
        user_data = {}
        user_data['id'] = str(user['_id'])
        user_data['username'] = user['username']
        user_data['name'] = user['name']
        user_data['rating'] = user['rating']['chess']['mu']
        user_data['score'] = 0

        result = self.tournaments_collection.update_one(
            {'_id': ObjectId(tournament_id)},
            {'$addToSet': {'players': user_id}, '$push': {'scoreboard': user_data}}
        )
        return result.modified_count > 0

    def leave(self, tournament_id, user_id):
        result = self.tournaments_collection.update_one(
            {'_id': ObjectId(tournament_id)},
            {'$pull': {'players': user_id}}
        )

        if result.modified_count == 0:
            return False
        
        result = self.tournaments_collection.update_one(
            {'_id': ObjectId(tournament_id)},
            {'$pull': {'scoreboard': {'id': user_id}}}
        )
        return result.modified_count > 0

    def get_scoreboard(self, tournament_id):
        tournament = self.tournaments_collection.find_one({'_id': ObjectId(tournament_id)})
        if not tournament:
            return None
        scoreboard = tournament.get('scoreboard', [])
        return scoreboard
    
    def update_player_score(self, tournament_id, player_id, score):
        result = self.tournaments_collection.update_one(
            {'_id': ObjectId(tournament_id), 'scoreboard.player_id': player_id},
            {'$set': {'scoreboard.$.score': score}}
        )
        return result.modified_count > 0

    def update_game_history(self, tournament_id, game):
        result = self.tournaments_collection.update_one(
            {'_id': ObjectId(tournament_id)},
            {'$push': {'game_history': game}}
        )
        return result.modified_count > 0

    def get_user_game_history(self, tournament_id, user_id):
        tournament = self.tournaments_collection.find_one({'_id': ObjectId(tournament_id)})
        if not tournament:
            return None
        game_history = tournament.get('game_history', [])
        user_game_history = [game for game in game_history if game['player_id'] == user_id]
        return user_game_history

    def get_tournaments_for_user(self, user_id):
        tournaments = self.tournaments_collection.find({'players': user_id}).sort('updated_at', -1)
        tournaments = [self.map(tournament) for tournament in tournaments]
        return tournaments

    def get_upcoming_tournaments(self):
        current_time = datetime.now().isoformat()
        tournaments = self.tournaments_collection.find({'start_time': {'$gte': current_time}}).sort('start_time', 1)
        tournaments = [self.map(tournament) for tournament in tournaments]
        return tournaments

    def get_ongoing_tournaments(self):
        current_time = datetime.now().isoformat()
        tournaments = self.tournaments_collection.find({'start_time': {'$lte': current_time}, 'end_time': {'$gte': current_time}}).sort('start_time', 1)
        tournaments = [self.map(tournament) for tournament in tournaments]
        return tournaments

    def get_past_tournaments(self):
        current_time = datetime.now().isoformat()
        tournaments = self.tournaments_collection.find({'end_time': {'$lt': current_time}}).sort('end_time', -1)
        tournaments = [self.map(tournament) for tournament in tournaments]
        return tournaments
    
    def _get_redis_pool_key(self, tournament_id):
        return f"tournament:{tournament_id}:pool"

    def join_pool(self, tournament_id, player_id):
        pool_key = self._get_redis_pool_key(tournament_id)
        if self.redis.sismember(pool_key, player_id):
            raise ValueError("Player already in the pool")

        self.redis.sadd(pool_key, player_id)

    def leave_pool(self, tournament_id, player_id):
        pool_key = self._get_redis_pool_key(tournament_id)
        if not self.redis.sismember(pool_key, player_id):
            raise ValueError("Player not in the pool")

        self.redis.srem(pool_key, player_id)

    def match_game(self, tournament_id):
        tournament = self.tournaments_collection.find_one({"_id": ObjectId(tournament_id)})
        if not tournament:
            raise ValueError("Tournament not found")

        pool_key = self._get_redis_pool_key(tournament_id)
        pool = list(self.redis.smembers(pool_key))
        if len(pool) < 3:
            return None

        # Randomly select two players from the pool
        player1, player2 = random.sample(pool, 2)

        # create game
        game = {
            'tournament_id': tournament_id,
            'white': str(player1)[2:-1],
            'black': str(player2)[2:-1],
            'status': 'matched',
            "variant": tournament.get("variant", CHESS),
            "fen": CHESS_FEN,
            "initial_time": tournament.get("initial_time", 10),
            "bonus_time": tournament.get("bonus_time", 0),
            "status": "STARTED",
            'created_at': datetime.now().isoformat(),
        }

        # add game to db
        game_id = self.tournament_games_collection.insert_one(game).inserted_id
        game['_id'] = str(game_id)

        # Remove matched players from the pool
        self.redis.srem(pool_key, player1, player2)
        return game
    
    def get_tournament_pool(self, tournament_id):
        pool_key = self._get_redis_pool_key(tournament_id)
        pool = list(self.redis.smembers(pool_key))
        return pool
        