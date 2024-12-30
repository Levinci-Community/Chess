import pytest
import json
from unittest.mock import patch, MagicMock

created_game_id = None
def test_new_game(test_client, admin_access_token):
    global created_game_id
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    with patch('services.game.GameService.create_game') as mock_create_game:
        mock_create_game.return_value = {"_id": created_game_id}

        response = test_client.post('/api/game', headers=headers, json={
            'mode': 'online'
        })
        assert response.status_code == 201
        assert '_id' in response.json
        data = json.loads(response.data)
        created_game_id = data['_id']


def test_update_game(test_client, admin_access_token):
    global created_game_id
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.put(f'/api/game/{created_game_id}', headers=headers, json={
        'mode': 'online'
    })
    assert response.status_code == 500


def test_get_tv_games(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }

    response = test_client.get('/api/games/tv', headers=headers)
    assert response.status_code == 200

def test_get_all_games(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }

    response = test_client.get('/api/games', headers=headers)
    assert response.status_code == 200

def test_save_game_history(test_client, admin_access_token):
    global created_game_id
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }

    with patch('services.game.GameService.save_game_history') as mock_save_game_history:
        mock_save_game_history.return_value = True

        response = test_client.post(f'/api/game/{created_game_id}/history', headers=headers, json={
            'result': 'test_result'
        })
        assert response.status_code == 200
        assert response.json['message'] == "Game history saved successfully."

def test_get_game_history(test_client, admin_access_token):
    player_id = '66617baf4147392ac432efab'
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }

    with patch('services.game.GameService.get_game_history') as mock_get_game_history:
        mock_get_game_history.return_value = [{"id": "history_game_id"}]

        response = test_client.get(f'/api/player/{player_id}/history', headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json, list)
