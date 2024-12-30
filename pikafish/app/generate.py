import subprocess
from app.pikafish import get_pikafish

def generate_move(fen, depth=10):
    pikafish = get_pikafish(fen=fen, depth=depth)
    best_move = pikafish.get_best_move()
    return best_move

def generate_top_moves(fen, depth, n):
    pikafish = get_pikafish(fen=fen, depth=depth)
    moves = pikafish.get_top_moves()
    return moves

def generate_puzzles():
    subprocess.run(['python', './app/generator/generator.py', '--engine', './pikafish'])
    subprocess.run(['python', './app/generator/puzzler.py', '--engine', './pikafish', './positions.epd'])
    subprocess.run(['python', './app/generator/pgn.py', './puzzles.epd'])
    with open('./puzzles.pgn', 'r') as file:
        file_content = file.read()
    pgns = file_content.split('\n\n')
    return pgns
    