from flask import Flask, jsonify, request
from stockfish import StockfishException
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
    
@app.get('/stockfish')
def stockfish_index():
    return jsonify({"message": "Stockfish says hello."})

@app.route('/stockfish/generate-move', methods=['POST'])
def generate_move_route():
    try:
        data = request.json
        fen = data.get('fen')
        depth = data.get('depth', 10)
        best_move = generate_move(fen, depth)
        return jsonify({'best_move': best_move}), 200
    except StockfishException as e:
        return jsonify({'error': str(e)}), 400

@app.route('/stockfish/generate-top-moves', methods=['POST'])
def generate_top_moves_route():
    try:
        data = request.json
        fen = data.get('fen')
        depth = data.get('depth', 10)
        n = data.get('n')
        top_moves = generate_top_moves(fen, depth, n)
        return jsonify({'top_moves': top_moves}), 200
    except StockfishException as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/stockfish/get-evaluation', methods=['POST'])
def get_evaluation_route():
    try:
        data = request.json
        fen = data.get('fen')
        evaluation = get_evaluation(fen)
        return jsonify({'evaluation': evaluation}), 200
    except StockfishException as e:
        return jsonify({'error': str(e)}), 400

@app.route('/stockfish/get-evaluation-game', methods=['POST'])
def get_evaluation_pgn_route():
    try:
        data = request.json
        fen = data.get('fen')
        moves = data.get('moves')
        moves = moves.split(" ")
        evaluations = get_evaluation_game(fen, moves)
        return jsonify({'evaluations': evaluations}), 200
    except StockfishException as e:
        return jsonify({'error': str(e)}), 400

@app.route('/stockfish/generate-puzzles', methods=['GET'])
def get_generated_puzzles():
    moves, fens = generate_puzzles()
    return jsonify({'moves': moves, 'fens': fens})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
