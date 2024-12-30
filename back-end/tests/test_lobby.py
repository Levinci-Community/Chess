import json
import pytest
from flask_jwt_extended import create_access_token
from unittest.mock import patch, MagicMock

# Helper function to get a JWT token for a given user_id
def get_jwt_token(user_id, app):
    with app.test_request_context():
        token = create_access_token(identity=str(user_id))
    return token

@pytest.fixture(scope='module')
def new_lobby():
    return {
        "name": "New Lobby",
        "description": "This is a new lobby.",
        "max_players": 4
    }

def test_get_lobbies(test_client):
    response = test_client.get('/api/lobby')
    assert response.status_code == 200
    assert isinstance(response.json, list)

@patch('services.user.UserService.get_by_id')
@patch('services.lobby.LobbyService.create_lobby')
def test_create_lobby(mock_create_lobby, mock_get_user, test_client, new_lobby):
    mock_user = MagicMock()
    mock_user.id = '1'
    mock_get_user.return_value = mock_user
    mock_create_lobby.return_value = new_lobby
    
    token = get_jwt_token(mock_user.id, test_client.application)
    
    response = test_client.post('/api/lobby',
                                data=json.dumps(new_lobby),
                                content_type='application/json',
                                headers={'Authorization': f'Bearer {token}'})
    
    assert response.status_code == 201
    assert response.json["name"] == new_lobby["name"]

@patch('services.user.UserService.get_by_id')
@patch('services.lobby.LobbyService.close_lobby')
def test_close_lobby(mock_close_lobby, mock_get_user, test_client):
    mock_user = MagicMock()
    mock_user.id = '1'
    mock_get_user.return_value = mock_user
    
    token = get_jwt_token(mock_user.id, test_client.application)
    
    response = test_client.put('/api/lobby/1',
                               headers={'Authorization': f'Bearer {token}'})
    
    assert response.status_code == 204
    mock_close_lobby.assert_called_once_with('1')
