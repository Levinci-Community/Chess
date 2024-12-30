from flask import Blueprint, jsonify, request
from services.puzzle import PuzzleService
from flask_jwt_extended import jwt_required

puzzle_bp = Blueprint('puzzle', __name__)
puzzle_service = PuzzleService()

@puzzle_bp.get('/api/puzzles/generate-chess')
@jwt_required()
def generate_chess_puzzles_api():
    try:
        moves, fens = puzzle_service.generate_chess_puzzles()
        no_records = puzzle_service.save_puzzles("CHESS", moves, fens)
        return jsonify({
            "message": "Success",
            "no_records": no_records
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@puzzle_bp.get('/api/puzzles')
@jwt_required()
def get_all_puzzles():
    try:
        puzzles = puzzle_service.get_all()
        return jsonify({
            "message": "Success",
            "puzzles": puzzles
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@puzzle_bp.get('/api/puzzles/<puzzle_id>')
@jwt_required()
def get_puzzle_by_id(puzzle_id):
    try:
        puzzle = puzzle_service.get_by_id(puzzle_id)
        if puzzle:
            return jsonify({
                "message": "Success",
                "puzzle": puzzle
            }), 200
        else:
            return jsonify({"message": "Puzzle not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@puzzle_bp.delete('/api/puzzles/<puzzle_id>')
@jwt_required()
def delete_puzzle(puzzle_id):
    try:
        success = puzzle_service.delete(puzzle_id)
        if success:
            return jsonify({'message': 'Puzzle deleted successfully'}), 200
        else:
            return jsonify({'message': 'Puzzle not found'}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
