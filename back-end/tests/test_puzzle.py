import json
import pytest
from flask import Flask
from unittest.mock import patch, MagicMock
from datetime import datetime
import uuid
from flask_jwt_extended import create_access_token


# Helper function to generate a JWT token
def get_jwt_token(user_id, app):
    with app.test_request_context():
        token = create_access_token(identity=str(user_id))
    return token

# Fixture for a new puzzle data
@pytest.fixture(scope='module')
def new_puzzle():
    return {
        "question": "What is the best move?",
        "answer": "Nf6",
        "difficulty": "Medium"
    }

# Mocked test cases for puzzle_bp

@patch('services.puzzle.PuzzleService.generate_chess_puzzles')
@patch('services.puzzle.PuzzleService.save_puzzles')
def test_generate_chess_puzzles_api(mock_save_puzzles, mock_generate_chess_puzzles, test_client):
    # Mocking the PuzzleService methods
    mock_generate_chess_puzzles.return_value = (['Nf6'], ['rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'])
    mock_save_puzzles.return_value = 1
    
    # Mocked JWT token for authorization
    token = get_jwt_token("test_user_id", test_client.application)
    
    # Send a GET request to the endpoint
    response = test_client.get('/api/puzzles/generate-chess',
                               headers={'Authorization': f'Bearer {token}'})
    
    # Assertions
    assert response.status_code == 200
    assert response.json['message'] == "Success"
    assert response.json['no_records'] == 1

@patch('services.puzzle.PuzzleService.get_all')
def test_get_all_puzzles(mock_get_all, test_client):
    # Mocking the PuzzleService method
    mock_get_all.return_value = [{"id": 1, "question": "What is the best move?"}]
    
    # Mocked JWT token for authorization
    token = get_jwt_token("test_user_id", test_client.application)
    
    # Send a GET request to the endpoint
    response = test_client.get('/api/puzzles',
                               headers={'Authorization': f'Bearer {token}'})
    
    # Assertions
    assert response.status_code == 200
    assert response.json['message'] == "Success"
    assert len(response.json['puzzles']) == 1

@patch('services.puzzle.PuzzleService.get_by_id')
def test_get_puzzle_by_id(mock_get_by_id, test_client):
    # Mocking the PuzzleService method
    mock_get_by_id.return_value = {"id": 1, "question": "What is the best move?"}
    
    # Mocked JWT token for authorization
    token = get_jwt_token("test_user_id", test_client.application)
    
    # Send a GET request to the endpoint
    response = test_client.get('/api/puzzles/1',
                               headers={'Authorization': f'Bearer {token}'})
    
    # Assertions
    assert response.status_code == 200
    assert response.json['message'] == "Success"
    assert response.json['puzzle']['id'] == 1

@patch('services.puzzle.PuzzleService.delete')
def test_delete_puzzle(mock_delete, test_client):
    # Mocking the PuzzleService method
    mock_delete.return_value = True
    
    # Mocked JWT token for authorization
    token = get_jwt_token("test_user_id", test_client.application)
    
    # Send a DELETE request to the endpoint
    response = test_client.delete('/api/puzzles/1',
                                  headers={'Authorization': f'Bearer {token}'})
    
    # Assertions
    assert response.status_code == 200
    assert response.json['message'] == "Puzzle deleted successfully"

