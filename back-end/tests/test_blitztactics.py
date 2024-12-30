import pytest
from unittest.mock import patch
from flask import url_for
import base64

BLITZ_TACTICS_URL = "https://chess.workon.space/UcG7F4xRfTzW1eVtLyPmNkQiOoAhDjBsErXuZvCwYxJbGzHpQqKiUlPfKsJdMgInLbHnVcXdFgBvNcMdHgXjZkLpWmRnPiOuYqAtWsEdRfYgUhIjOlP"

def generate_token(user_id):
    return base64.b64encode(user_id.encode('utf-8')).decode('utf-8')

@pytest.fixture(scope='module')
def test_client():
    from server import app

    with app.test_client() as client:
        yield client

@pytest.mark.parametrize("route, endpoint", [
    ('/api/blitz-tactics/haste', '/haste'),
    ('/api/blitz-tactics/three', '/three'),
    ('/api/blitz-tactics/countdown', '/countdown'),
    ('/api/blitz-tactics/speedrun', '/speedrun'),
    ('/api/blitz-tactics/rated', '/rated'),
    ('/api/blitz-tactics/infinity', '/infinity'),
    ('/api/blitz-tactics/repetition', '/repetition'),
])
def test_blitztactics_routes(test_client, route, endpoint):
    user_id = 'test_user_id'
    token = generate_token(user_id)

    with patch('services.user.UserService.get_by_id') as mock_get_by_id:
        mock_user = {
            'id': user_id,
            'email': 'user@example.com',
            'name': 'Test User'
        }
        mock_get_by_id.return_value = mock_user
        
        response = test_client.get(f'{route}?token={token}')
        
        assert response.status_code == 302
        assert response.location == f"{BLITZ_TACTICS_URL}{endpoint}"

def test_blitztactics_routes_missing_token(test_client):
    routes = [
        '/api/blitz-tactics/haste',
        '/api/blitz-tactics/three',
        '/api/blitz-tactics/countdown',
        '/api/blitz-tactics/speedrun',
        '/api/blitz-tactics/rated',
        '/api/blitz-tactics/infinity',
        '/api/blitz-tactics/repetition',
    ]

    for route in routes:
        response = test_client.get(route)
        assert response.status_code == 400
        assert response.json == 'Token is missing'

def test_blitztactics_routes_invalid_token(test_client):
    invalid_token = generate_token('invalid_user_id')

    with patch('services.user.UserService.get_by_id') as mock_get_by_id:
        mock_get_by_id.return_value = None

        routes = [
            '/api/blitz-tactics/haste',
            '/api/blitz-tactics/three',
            '/api/blitz-tactics/countdown',
            '/api/blitz-tactics/speedrun',
            '/api/blitz-tactics/rated',
            '/api/blitz-tactics/infinity',
            '/api/blitz-tactics/repetition',
        ]

        for route in routes:
            response = test_client.get(f'{route}?token={invalid_token}')
            assert response.status_code == 400
            assert response.json == 'User not found'

def test_blitztactics_routes_exception(test_client):
    valid_token = generate_token('test_user_id')

    with patch('services.user.UserService.get_by_id') as mock_get_by_id:
        mock_get_by_id.side_effect = Exception('Some error')

        routes = [
            '/api/blitz-tactics/haste',
            '/api/blitz-tactics/three',
            '/api/blitz-tactics/countdown',
            '/api/blitz-tactics/speedrun',
            '/api/blitz-tactics/rated',
            '/api/blitz-tactics/infinity',
            '/api/blitz-tactics/repetition',
        ]

        for route in routes:
            response = test_client.get(f'{route}?token={valid_token}')
            assert response.status_code == 500
            assert response.json == {"message": 'Some error'}
