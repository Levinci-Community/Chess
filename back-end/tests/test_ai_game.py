import pytest
import json
from flask_jwt_extended import create_access_token

created_game_id = None

def test_new_ai_game(test_client, admin_access_token):
    global created_game_id
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.post('/api/ai-game', headers=headers, json={'game_data': 'test'})
    assert response.status_code == 201
    data = json.loads(response.data)
    assert '_id' in data
    created_game_id = data['_id']

def test_get_ai_game(test_client, admin_access_token):
    global created_game_id
    assert created_game_id is not None, "Game ID was not created in test_new_ai_game"
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get(f'/api/ai-game/{created_game_id}', headers=headers)
    assert response.status_code == 200

# def test_draw_ai_game(test_client, admin_access_token):
#     global created_game_id
#     assert created_game_id is not None, "Game ID was not created in test_new_ai_game"
#     headers = {
#         'Authorization': f'Bearer {admin_access_token}',
#         'Content-Type': 'application/json'
#     }
#     response = test_client.put(f'/api/ai-game/{created_game_id}/draw', headers=headers)
#     assert response.status_code == 200

def test_resign_ai_game(test_client, admin_access_token):
    global created_game_id
    assert created_game_id is not None, "Game ID was not created in test_new_ai_game"
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.put(f'/api/ai-game/{created_game_id}/resign', headers=headers)
    assert response.status_code == 200

def test_checkmate_ai_game(test_client, admin_access_token):
    global created_game_id
    assert created_game_id is not None, "Game ID was not created in test_new_ai_game"
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.put(f'/api/ai-game/{created_game_id}/checkmate', headers=headers, json={'player_win_id': 'winner_id'})
    assert response.status_code == 200

# def test_request_ai_move(test_client, admin_access_token):
#     global created_game_id
#     assert created_game_id is not None, "Game ID was not created in test_new_ai_game"
#     headers = {
#         'Authorization': f'Bearer {admin_access_token}',
#         'Content-Type': 'application/json'
#     }
#     response = test_client.post(f'/api/ai-game/{created_game_id}/request_ai_move', headers=headers, json={'fen': 'some_fen'})
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert 'move' in data
