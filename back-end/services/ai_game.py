from bson import ObjectId
from database.mongodb import get_db
from database.redis import get_redis
from random import randint
import requests
import json

STOCKFISH_URL = 'https://chess.workon.space/stockfish'
class AiGameService():
    def __init__(self) -> None:
        self.db = get_db()
        self.redis = get_redis()
        self.users_collection = self.db['users']
        self.ai_games_collection = self.db['ai_games']

    def map(self, game):
        game["_id"] = str(game["_id"])
        return game

    def create(self, user_id, game):
        game['status'] = "STARTED"
        random_value = randint(0, 1)
        if random_value == 0:
            game['white'] = 'ai'
            game['black'] = user_id
        else:
            game['white'] = user_id
            game['black'] = 'ai'
        result = self.ai_games_collection.insert_one(game)
        game_data = self.get(result.inserted_id)
        return game_data
        
    def get(self, game_id):
        game = self.ai_games_collection.find_one({'_id': ObjectId(game_id)})
        
        if game:
            return self.map(game)
        return None
    
    def draw(self, game_id):
        game = self.ai_games_collection.find_one({'_id': ObjectId(game_id)})
        if game:
            self.ai_games_collection.update_one(
                {'_id': ObjectId(game_id)},
                {'$set': {'status': 'DRAW'}}
            )

    def resign(self, game_id):
        game = self.ai_games_collection.find_one({'_id': ObjectId(game_id)})
        if game:
            self.ai_games_collection.update_one(
                {'_id': ObjectId(game_id)},
                {'$set': {'status': 'RESIGNED', 'winner': 'ai'}}
            )

    def checkmate(self, game_id, player_win_id):
        game = self.ai_games_collection.find_one({'_id': ObjectId(game_id)})

        if game:
            self.ai_games_collection.update_one(
                {'_id': ObjectId(game_id)},
                {'$set': {'status': 'CHECKMATE', 'winner': player_win_id}}
            )

    def cache_move(self, fen, moves, white_time, black_time):
        pass

    def request_ai_move(self, game_id, fen):
        game = self.ai_games_collection.find_one({'_id': ObjectId(game_id)})
        if game:
            level = game["Ai_level"]
            payload = {
                'fen': fen,
                'depth': level
            }
            response = requests.post(f'{STOCKFISH_URL}/generate-move', json=payload)
            if response.status_code == 200: 
                dict_response = json.loads(response.content)
                return dict_response["best_move"]
            else:
                raise Exception('Fail to generate move')

    def get_offline_game_report(self): 
        offlineGame = self.ai_games_collection.find()

        offline = {
            'count': 0,
            'variant': {
                'chess': 0,
            },
            'time': {
                'bullet': 0,
                'blitz': 0,
                'rapid': 0,
                'classical': 0
            },
            'status': {
                'draw': 0,
                'black_win': 0,
                'white_win': 0  
            },
            'ai_level': {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0
            },
            'winner': {
                'player': 0,
                'ai': 0
            }
        }

        for game in offlineGame:
            offline['count'] += 1
            if game.get('variant') == 'CHESS':
                offline['variant']['chess'] += 1
            
            if game.get('initial_time', 0) <= 3:
                offline['time']['bullet'] += 1
            elif game.get('initial_time', 0) <= 5:
                offline['time']['blitz'] += 1
            elif game.get('initial_time', 0) <= 15:
                offline['time']['rapid'] += 1
            else:
                offline['time']['classical'] += 1
            
            winner = game.get('winner')

            if winner and game.get('white') == winner:
                offline['status']['white_win'] += 1
            elif winner and game.get('black') == winner:
                offline['status']['black_win'] += 1
            else:
                offline['status']['draw'] += 1

            ai_level = str(game.get('Ai_level', 1))
            if ai_level in offline['ai_level']:
                offline['ai_level'][ai_level] += 1

            if game.get('winner') == 'ai':
                offline['winner']['ai'] += 1
            else:
                offline['winner']['player'] += 1
        return offline
