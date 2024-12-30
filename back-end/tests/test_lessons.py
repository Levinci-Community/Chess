import json
import pytest
from flask_jwt_extended import create_access_token
lesson_id = None
def get_jwt_token(user_id, app):
    with app.test_request_context():
        token = create_access_token(identity=str(user_id))
    return token

@pytest.fixture(scope='module')
def new_lesson():
    return {
        "title": "New Lesson",
        "description": "This is a new lesson.",
        "content": "Lesson content here.",
        "author_id": "1"
    }

def test_create_lesson(test_client, new_lesson):
    global lesson_id
    token = get_jwt_token(new_lesson["author_id"], test_client.application)
    
    response = test_client.post('/api/lessons',
                                data=json.dumps(new_lesson),
                                content_type='application/json',
                                headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 201
    assert response.json["title"] == new_lesson["title"]
    lesson_id = response.json["_id"]

def test_get_lessons(test_client, admin_access_token):
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    response = test_client.get('/api/lessons', headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_get_lesson_by_id(test_client, new_lesson):
    global lesson_id
    response = test_client.get(f'/api/lessons/{lesson_id}')
    assert response.status_code == 200
    assert response.json["title"] == new_lesson["title"]


def test_delete_lesson(test_client, admin_access_token):
    global lesson_id
    headers = {
        'Authorization': f'Bearer {admin_access_token}',
        'Content-Type': 'application/json'
    }
    
    response = test_client.delete(f'/api/lessons/{lesson_id}',
                                  headers=headers)
    
    assert response.status_code == 401