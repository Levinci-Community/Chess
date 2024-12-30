from flask import Flask
from unittest.mock import patch, MagicMock
from services.user import UserService
from database.mongodb import get_mongo
from database.redis import get_redis

def test_test_connection_success(test_client):
    with patch('database.mongodb.get_mongo') as mock_get_mongo:
        mock_get_mongo.return_value = MagicMock()  # Mock MongoDB client
        
        response = test_client.get('/api/test/connection')
        
        assert response.status_code == 200

def test_test_connection_failure(test_client):
    with patch('database.mongodb.get_mongo') as mock_get_mongo:
        mock_get_mongo.side_effect = Exception("Connection error")  # Mock MongoDB connection error
        
        response = test_client.get('/api/test/connection')
        
        assert response.status_code == 200

def test_get_all_user(test_client):
    with patch.object(UserService, 'get_all') as mock_get_all:
        mock_get_all.return_value = [{"id": 1, "username": "test_user"}]  # Mock user data
        
        response = test_client.get('/api/test/user/all')
        
        assert response.status_code == 200
        assert len(response.json) == 1
        assert response.json[0]['username'] == "test_user"

def test_test_redis(test_client):
    with patch('database.redis.get_redis') as mock_get_redis:
        mock_redis = MagicMock()
        mock_get_redis.return_value = mock_redis  # Mock Redis client
        
        response = test_client.get('/api/test/redis')
        
        assert response.status_code == 200

def test_set_redis_value(test_client):
    key = 'test_key'
    value = 'test_value'
        
    response = test_client.get(f'/api/test/redis/set?key={key}&value={value}')
        
    assert response.status_code == 500

def test_set_redis_value_missing_params(test_client):
    response = test_client.get('/api/test/redis/set')
    assert response.status_code == 400

def test_get_redis_value(test_client):
    key = 'test_key'
    response = test_client.get(f'/api/test/redis/get?key={key}')
    assert response.status_code == 500

def test_get_redis_value_missing_param(test_client):
    response = test_client.get('/api/test/redis/get')
    assert response.status_code == 400

def test_get_redis_value_key_not_found(test_client):
    with patch('database.redis.get_redis') as mock_get_redis:
        mock_redis = MagicMock()
        mock_get_redis.return_value = mock_redis  # Mock Redis client
        
        key = 'nonexistent_key'
        mock_redis.get.return_value = None
        
        response = test_client.get(f'/api/test/redis/get?key={key}')
        
        assert response.status_code == 500

