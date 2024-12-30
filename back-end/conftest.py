import pytest
from server import app
from database.mongodb import get_mongo
import os
import secrets
import json

@pytest.fixture(scope='module')
def test_client():
    flask_app = app

    flask_app.config['TESTING'] = True
    flask_app.config['MONGO_URI'] = 'mongodb://localhost:27017/test_db'
    flask_app.config['SECRET_KEY'] = secrets.token_hex(32)
    flask_app.config['JWT_SECRET_KEY'] = secrets.token_hex(32)
    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            mongo = get_mongo()
            mongo.db.drop_collection('achievements')
            yield testing_client
            mongo.db.drop_collection('achievements')

@pytest.fixture(scope='function')
def admin_access_token(test_client):
    response = test_client.post('/api/login', json={
        'username': 'leetun2k2',
        'password': 'mot234nam6'
    })

    if response.status_code != 200:
        raise Exception("Failed to log in as admin. Status code: {}".format(response.status_code))

    data = json.loads(response.data)

    if 'access_token' not in data:
        raise Exception("No access token found in the response. Response data: {}".format(data))

    return data['access_token']
