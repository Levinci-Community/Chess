from flask import Flask, jsonify, request
from app.model import PikafishException
from app.game import get_parameters, get_board_visual
from app.generate import generate_move, generate_top_moves, generate_puzzles
from app.analysis import get_evaluation, get_evaluation_game

app = Flask(__name__)

@app.get('/')
def index():
    try:
        parameters = get_parameters()
        board = get_board_visual()
        return jsonify({"parameters": parameters, "board": board}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.get('/pikafish')
def pikafish_index():
    return jsonify({"message": "Pikafish says hello."})

@app.route('/pikafish/generate-move', methods=['POST'])
def generate_move_route():
    try:
        data = request.json
        fen = data.get('fen')
        depth = data.get('depth', 10)
        best_move = generate_move(fen, depth)
        return jsonify({'best_move': best_move}), 200
    except PikafishException as e:
        return jsonify({'error': str(e)}), 400

@app.route('/pikafish/generate-top-moves', methods=['POST'])
def generate_top_moves_route():
    try:
        data = request.json
        fen = data.get('fen')
        depth = data.get('depth', 10)
        n = data.get('n')
        top_moves = generate_top_moves(fen, depth, n)
        return jsonify({'top_moves': top_moves}), 200
    except PikafishException as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/pikafish/get-evaluation', methods=['POST'])
def get_evaluation_route():
    try:
        data = request.json
        fen = data.get('fen')
        evaluation = get_evaluation(fen)
        return jsonify({'evaluation': evaluation}), 200
    except PikafishException as e:
        return jsonify({'error': str(e)}), 400

@app.route('/pikafish/get-evaluation-game', methods=['POST'])
def get_evaluation_pgn_route():
    try:
        data = request.json
        fen = data.get('fen')
        moves = data.get('moves')
        moves = moves.split(" ")
        evaluations = get_evaluation_game(fen, moves)
        return jsonify({'evaluations': evaluations}), 200
    except PikafishException as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/pikafish/generate-puzzles', methods=['GET'])
def get_generated_puzzles():
    puzzles = generate_puzzles()
    return jsonify({'puzzles': puzzles})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True)
