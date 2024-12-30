from bson import ObjectId
from database.mongodb import get_db
from datetime import datetime
import requests
from random import randint

STOCKFISH_URL = 'https://chess.workon.space/stockfish'
PIKAFISH_URL = 'https://chess.workon.space/pikafish'

class PuzzleService():
    def __init__(self) -> None:
        self.pieces = ['r', 'n', 'b', 'q', 'k', 'p', 'c', 'a']
        self.db = get_db()
        self.puzzles_collection = self.db['puzzles']

    def map_puzzle(self, puzzle):
        puzzle['_id'] = str(puzzle['_id'])
        return puzzle

    def get_all(self):
        data = self.puzzles_collection.find({}).sort('created_at', -1)
        data = [self.map_puzzle(puzzle) for puzzle in data]
        return data

    def get_by_id(self, puzzle_id):
        return self.map_puzzle(self.puzzles_collection.find_one({'_id': ObjectId(puzzle_id)}))
    
    def get_random(self):
        num_puzzles = self.puzzles_collection.count_documents({})
        if num_puzzles == 0:
            random_index = randint(0, num_puzzles - 1)
        random_puzzle = self.puzzles_collection.find({}).skip(random_index).limit(1)
        return self.map_puzzle(random_puzzle)

    def generate_chess_puzzles(self):
        try:
            response = requests.get(f'{STOCKFISH_URL}/generate-puzzles')
            data = response.json()
            moves = data["moves"] 
            fens = data["fens"]
            return moves, fens
        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")

    def save_puzzles(self, variant, moves, fens):
        n = len(fens)
        puzzles = []
        for i in range(n):
            fen = self.clean_fen(fens[i])
            move = self.clean_move(moves[i])
            puzzles.append({
                'variant': variant,
                'fen': fen,
                'moves': move,
                'created_at': datetime.now().isoformat(),
            })
        result = self.puzzles_collection.insert_many(puzzles)
        return len(result.inserted_ids)

    def clean_fen(self, full_fen):
        return full_fen.split('"')[1]
    
    def clean_move(self, string_moves: str):
        full_moves = string_moves.split(' ')
        moves = []
        for move in full_moves:
            if move[0].lower() in self.pieces:
                moves.append(move)
        return moves
    
    def delete(self, puzzle_id:str):
        result = self.puzzles_collection.delete_one({'_id': ObjectId(puzzle_id)})
        return result.deleted_count > 0
        
